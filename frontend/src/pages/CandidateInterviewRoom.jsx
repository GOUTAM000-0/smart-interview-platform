import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import webrtcService from "../services/webrtcService";
import api from "../services/api";
import useAuth from "../hooks/useAuth";

function CandidateInterviewRoom() {

    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const sessionId = location.state?.sessionId;

    const localVideoRef = useRef(null);

    const [cameraOn, setCameraOn] = useState(true);
    const [micOn, setMicOn] = useState(true);
    const [screenSharing, setScreenSharing] = useState(false);

    const [remoteStreams, setRemoteStreams] = useState({});

    const [cv, setCv] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {

        if (!sessionId || !user?.email) {
            if (!sessionId) navigate("/candidate/dashboard");
            return;
        }

        let isMounted = true;

        const token = localStorage.getItem("token");

        const setup = async () => {

            const stream = await webrtcService.startLocalStream(localVideoRef.current);

            if (!isMounted) {
                stream.getTracks().forEach(track => track.stop());
                return;
            }

            webrtcService.on("onRemoteStream", (participantId, remoteStream) => {
                if (isMounted) {
                    setRemoteStreams(prev => ({
                        ...prev,
                        [participantId]: remoteStream
                    }));
                }
            });

            webrtcService.on("onUserLeft", (participantId) => {
                if (isMounted) {
                    setRemoteStreams(prev => {
                        const updated = { ...prev };
                        delete updated[participantId];
                        return updated;
                    });
                }
            });

            webrtcService.connect(token, user.email, () => {
                if (isMounted) {
                    webrtcService.joinRoom(sessionId);
                }
            });

        };

        setup();

        return () => {
            isMounted = false;
            webrtcService.leaveRoom();
            webrtcService.disconnect();
        };

    }, [sessionId, navigate, user?.email]);

    const toggleMic = () => {
        const next = !micOn;
        setMicOn(next);
        webrtcService.toggleMicrophone(next);
    };

    const toggleCamera = () => {
        const next = !cameraOn;
        setCameraOn(next);
        webrtcService.toggleCamera(next);
    };

    const handleToggleScreenShare = async () => {

        try {

            const stream = await webrtcService.toggleScreenShare();

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }

            setScreenSharing(webrtcService.isScreenSharing);

        } catch (error) {

            console.error("Screen share failed", error);

        }

    };

    const leaveInterview = () => {
        webrtcService.leaveRoom();
        webrtcService.disconnect();
        navigate("/candidate/dashboard");
    };

    // Backend contract:
    // POST http://localhost:8080/api/interview/upload-cv/{sessionId}
    // Authorization: Bearer <candidate JWT>
    // multipart/form-data body, field name "file"
    // -> { success, message, fileName }
    const uploadCV = async () => {

        if (!cv) {

            alert("Please select a CV.");

            return;

        }

        if (!sessionId) {

            alert("Missing interview session. Please rejoin the interview.");

            return;

        }

        try {

            setUploading(true);

            const formData = new FormData();
            formData.append("file", cv);

            const response = await api.post(
                `/interview/upload-cv/${sessionId}`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" }
                }
            );

            if (response.data?.success) {
                alert(response.data.message || "CV uploaded successfully.");
            } else {
                alert(response.data?.message || "Failed to upload CV.");
            }

        } catch (error) {

            alert(

                error.response?.data?.message ||

                "Failed to upload CV."

            );

        } finally {

            setUploading(false);

        }

    };

    // Everyone else in the room (interviewer, and any co-interviewers) —
    // rendered as small tiles underneath the candidate's own main stage.
    const remoteEntries = Object.entries(remoteStreams);
    const totalParticipants = remoteEntries.length + 1;

    return (

        <div className="interview-page">

            <div className="interview-header">

                <h2 className="interview-title">
                    Candidate Interview Room
                    <span className="participant-badge">
                        {totalParticipants} Participant{totalParticipants !== 1 ? "s" : ""}
                    </span>
                </h2>

                <button className="leave-btn" onClick={leaveInterview}>
                    Leave Interview
                </button>

            </div>

            <div className="interview-body">

                {/* Video */}

                <div className="video-stack">

                    {/* Main stage — the candidate's own camera */}
                    <div className="stage">

                        <video
                            ref={localVideoRef}
                            autoPlay
                            muted
                            playsInline
                        />

                        <span className="tile-label">
                            <span className="dot" />
                            You {screenSharing ? "(Sharing Screen)" : ""}
                        </span>

                    </div>

                    {/* Interviewer(s) — smaller tiles below the main stage */}
                    <div className="thumb-row">

                        {remoteEntries.map(([participantId, stream]) => (

                            <div className="thumb-tile" key={participantId}>

                                <video
                                    autoPlay
                                    playsInline
                                    ref={(el) => { if (el) el.srcObject = stream; }}
                                />

                                <span className="tile-label">{participantId}</span>

                            </div>

                        ))}

                        {remoteEntries.length === 0 && (
                            <div className="thumb-placeholder">
                                Waiting for interviewer to join…
                            </div>
                        )}

                    </div>

                    <div className="controls-bar">

                        <button
                            className={`control-btn ${micOn ? "is-on" : ""}`}
                            onClick={toggleMic}
                        >
                            {micOn ? "Mute" : "Unmute"}
                        </button>

                        <button
                            className={`control-btn ${cameraOn ? "is-on" : ""}`}
                            onClick={toggleCamera}
                            disabled={screenSharing}
                        >
                            {cameraOn ? "Camera Off" : "Camera On"}
                        </button>

                        <button
                            className={`control-btn ${screenSharing ? "is-share" : ""}`}
                            onClick={handleToggleScreenShare}
                        >
                            {screenSharing ? "Stop Sharing" : "Share Screen"}
                        </button>

                    </div>

                </div>

                {/* Upload CV */}

                <div className="side-panel">

                    <div className="side-panel-header">Upload Resume</div>

                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setCv(e.target.files[0])}
                    />

                    <button className="panel-btn" onClick={uploadCV} disabled={uploading}>
                        {uploading ? "Uploading…" : "Upload CV"}
                    </button>

                    {cv && (
                        <div className="file-note">
                            Selected: {cv.name}
                        </div>
                    )}

                </div>

            </div>

        </div>

    );

}

export default CandidateInterviewRoom;