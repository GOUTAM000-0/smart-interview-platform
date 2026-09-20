import websocketService from "./websocketService";

/*
    Expected backend STOMP mappings (Spring @MessageMapping-style —
    implement these server-side to match):

    Client sends to (app prefix):
        "/app/room/join"    { sessionId, participantId }
        "/app/room/leave"   { sessionId, participantId }
        "/app/signal"       { type: "offer"|"answer"|"ice-candidate",
                               to, sessionId, offer|answer|candidate }

    Client subscribes to:
        "/topic/room/{sessionId}"     presence broadcast to everyone in
                                       the room -> { type: "user-joined" |
                                       "user-left", participantId }
        "/user/queue/signal"          targeted at me (server routes via
                                       Principal) -> { type, from, offer |
                                       answer | candidate }
        "/user/queue/invitations"     new invitation pushed to a candidate
        "/user/queue/invitations-update"  full invitations list pushed to
                                           an interviewer

    "participantId" / "to" / "from" are the user's email — there's no
    socket-id equivalent in STOMP, so the server must resolve Principal
    -> email on its end (e.g. convertAndSendToUser(email, ...)).
*/

class WebRTCService {

    constructor() {

        this.localStream = null;
        this.screenStream = null;
        this.isScreenSharing = false;

        this.peerConnections = {};
        this.remoteStreams = {};

        this.currentRoom = null;
        this.roomDestination = null;
        this.selfEmail = null;

        this.configuration = {
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" },
                { urls: "stun:stun1.l.google.com:19302" }
            ]
        };

        // UI components subscribe to these instead of polling
        this.callbacks = {
            onRemoteStream: null,
            onUserLeft: null,
            onInvitation: null,
            onInvitationUpdate: null
        };

    }

    // ===========================================
    // Connection lifecycle
    // ===========================================

    /**
     * @param {string} token     - JWT for the STOMP connect header
     * @param {string} selfEmail - identifies this user to peers (must
     *                             match the Principal your backend resolves)
     * @param {Function} onReady - fired once connected AND subscribed
     */
    connect(token, selfEmail, onReady) {

        this.selfEmail = selfEmail;

        websocketService.connect(token, () => {

            websocketService.subscribe("/user/queue/signal", (message) => {
                this._handleSignal(message);
            });

            websocketService.subscribe("/user/queue/invitations", (invitation) => {
                if (this.callbacks.onInvitation) {
                    this.callbacks.onInvitation(invitation);
                }
            });

            websocketService.subscribe("/user/queue/invitations-update", (invitations) => {
                if (this.callbacks.onInvitationUpdate) {
                    this.callbacks.onInvitationUpdate(invitations);
                }
            });

            if (onReady) {
                onReady();
            }

        });

    }

    disconnect() {
        websocketService.disconnect();
    }

    on(event, callback) {
        this.callbacks[event] = callback;
    }

    // ===========================================
    // Camera + Microphone
    // ===========================================

    async startLocalStream(videoElement) {

        this.localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });

        if (videoElement) {
            videoElement.srcObject = this.localStream;
        }

        return this.localStream;

    }

    // ===========================================
    // Room
    // ===========================================

    joinRoom(sessionId) {

        this.currentRoom = sessionId;
        this.roomDestination = `/topic/room/${sessionId}`;

        websocketService.subscribe(this.roomDestination, (message) => {
            this._handlePresence(message);
        });

        websocketService.send("/app/room/join", {
            sessionId,
            participantId: this.selfEmail
        });

    }

    _handlePresence(message) {

        if (!message || message.participantId === this.selfEmail) {
            return;
        }

        if (message.type === "user-joined") {
            // Whoever was already in the room initiates the offer
            // to the newcomer.
            this._ensurePeer(message.participantId, true);
        }

        if (message.type === "user-left") {
            this.closePeer(message.participantId);
            if (this.callbacks.onUserLeft) {
                this.callbacks.onUserLeft(message.participantId);
            }
        }

    }

    // ===========================================
    // Signaling (multiplexed over /app/signal + /user/queue/signal)
    // ===========================================

    _handleSignal(message) {

        if (!message) return;

        const { type, from } = message;

        if (type === "offer") {
            this._receiveOffer(from, message.offer);
        } else if (type === "answer") {
            this._receiveAnswer(from, message.answer);
        } else if (type === "ice-candidate") {
            this._receiveIceCandidate(from, message.candidate);
        }

    }

    async _receiveOffer(from, offer) {

        const peer = this._ensurePeer(from, false);

        await peer.setRemoteDescription(new RTCSessionDescription(offer));

        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);

        websocketService.send("/app/signal", {
            type: "answer",
            to: from,
            sessionId: this.currentRoom,
            answer
        });

    }

    async _receiveAnswer(from, answer) {
        const peer = this.peerConnections[from];
        if (peer) {
            await peer.setRemoteDescription(new RTCSessionDescription(answer));
        }
    }

    async _receiveIceCandidate(from, candidate) {
        const peer = this.peerConnections[from];
        if (peer && candidate) {
            try {
                await peer.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (err) {
                console.error("Failed to add ICE candidate", err);
            }
        }
    }

    // ===========================================
    // Peer connection (internal)
    // ===========================================

    _ensurePeer(participantId, isInitiator) {

        if (this.peerConnections[participantId]) {
            return this.peerConnections[participantId];
        }

        const peer = new RTCPeerConnection(this.configuration);
        this.peerConnections[participantId] = peer;

        if (this.localStream) {
            this.localStream.getTracks().forEach(track => {
                peer.addTrack(track, this.localStream);
            });
        }

        peer.ontrack = (event) => {
            const stream = event.streams[0];
            this.remoteStreams[participantId] = stream;
            if (this.callbacks.onRemoteStream) {
                this.callbacks.onRemoteStream(participantId, stream);
            }
        };

        peer.onicecandidate = (event) => {
            if (event.candidate) {
                websocketService.send("/app/signal", {
                    type: "ice-candidate",
                    to: participantId,
                    sessionId: this.currentRoom,
                    candidate: event.candidate
                });
            }
        };

        peer.onconnectionstatechange = () => {
            if (["disconnected", "failed", "closed"].includes(peer.connectionState)) {
                this.closePeer(participantId);
            }
        };

        if (isInitiator) {
            this._createAndSendOffer(participantId, peer);
        }

        return peer;

    }

    async _createAndSendOffer(participantId, peer) {

        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);

        websocketService.send("/app/signal", {
            type: "offer",
            to: participantId,
            sessionId: this.currentRoom,
            offer
        });

    }

    // ===========================================
    // Screen sharing
    // Swaps the outgoing video track on every open
    // peer connection, then swaps it back on stop.
    // ===========================================

    async toggleScreenShare() {

        if (this.isScreenSharing) {
            return this._stopScreenShare();
        }

        this.screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: true
        });

        const screenTrack = this.screenStream.getVideoTracks()[0];

        Object.values(this.peerConnections).forEach(peer => {
            const sender = peer.getSenders().find(s => s.track && s.track.kind === "video");
            if (sender) {
                sender.replaceTrack(screenTrack);
            }
        });

        // If the user stops sharing from the browser's own UI
        screenTrack.onended = () => {
            this._stopScreenShare();
        };

        this.isScreenSharing = true;
        return this.screenStream;

    }

    _stopScreenShare() {

        if (this.screenStream) {
            this.screenStream.getTracks().forEach(track => track.stop());
            this.screenStream = null;
        }

        const cameraTrack = this.localStream?.getVideoTracks()[0];

        if (cameraTrack) {
            Object.values(this.peerConnections).forEach(peer => {
                const sender = peer.getSenders().find(s => s.track && s.track.kind === "video");
                if (sender) {
                    sender.replaceTrack(cameraTrack);
                }
            });
        }

        this.isScreenSharing = false;
        return this.localStream;

    }

    // ===========================================
    // Camera / Mic toggles
    // ===========================================

    toggleCamera(enabled) {
        if (!this.localStream) return;
        this.localStream.getVideoTracks().forEach(track => track.enabled = enabled);
    }

    toggleMicrophone(enabled) {
        if (!this.localStream) return;
        this.localStream.getAudioTracks().forEach(track => track.enabled = enabled);
    }

    // ===========================================
    // Cleanup
    // ===========================================

    closePeer(participantId) {
        const peer = this.peerConnections[participantId];
        if (peer) {
            peer.close();
            delete this.peerConnections[participantId];
            delete this.remoteStreams[participantId];
        }
    }

    leaveRoom() {

        if (this.currentRoom) {

            websocketService.send("/app/room/leave", {
                sessionId: this.currentRoom,
                participantId: this.selfEmail
            });

            websocketService.unsubscribe(this.roomDestination);

        }

        Object.keys(this.peerConnections).forEach(id => this.closePeer(id));

        if (this.screenStream) {
            this.screenStream.getTracks().forEach(track => track.stop());
            this.screenStream = null;
            this.isScreenSharing = false;
        }

        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
            this.localStream = null;
        }

        this.currentRoom = null;
        this.roomDestination = null;

    }

}

export default new WebRTCService();