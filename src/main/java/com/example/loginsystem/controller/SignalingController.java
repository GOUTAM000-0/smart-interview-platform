package com.example.loginsystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@Controller
public class SignalingController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // sessionId -> set of participant emails currently in that room.
    // Used only to track membership; not persisted, resets on restart.
    private final Map<String, Set<String>> roomParticipants = new ConcurrentHashMap<>();

    // ===========================================
    // Room join
    // Broadcasts "user-joined" to everyone already subscribed to
    // /topic/room/{sessionId}. Each existing participant's client
    // reacts by initiating an offer to the newcomer (see
    // webrtcService.js _handlePresence -> _ensurePeer(..., true)).
    // ===========================================
    @MessageMapping("/room/join")
    public void joinRoom(@Payload Map<String, Object> payload, Principal principal) {

        String sessionId = (String) payload.get("sessionId");

        String participantId =
                principal != null ? principal.getName() : (String) payload.get("participantId");

        if (sessionId == null || participantId == null) {
            return;
        }

        Set<String> participants =
                roomParticipants.computeIfAbsent(sessionId, key -> new CopyOnWriteArraySet<>());

        participants.add(participantId);

        Map<String, Object> joinedEvent = new HashMap<>();
        joinedEvent.put("type", "user-joined");
        joinedEvent.put("participantId", participantId);

        // Cast to Object to force the (String destination, Object payload)
        // overload — without it, a raw Map<String,Object> ambiguously
        // matches convertAndSend(Object payload, Map<String,Object> headers)
        // as well, since a String destination also satisfies Object payload.
        messagingTemplate.convertAndSend("/topic/room/" + sessionId, (Object) joinedEvent);
    }

    // ===========================================
    // Room leave
    // ===========================================
    @MessageMapping("/room/leave")
    public void leaveRoom(@Payload Map<String, Object> payload, Principal principal) {

        String sessionId = (String) payload.get("sessionId");

        String participantId =
                principal != null ? principal.getName() : (String) payload.get("participantId");

        if (sessionId == null || participantId == null) {
            return;
        }

        Set<String> participants = roomParticipants.get(sessionId);

        if (participants != null) {
            participants.remove(participantId);
            if (participants.isEmpty()) {
                roomParticipants.remove(sessionId);
            }
        }

        Map<String, Object> leftEvent = new HashMap<>();
        leftEvent.put("type", "user-left");
        leftEvent.put("participantId", participantId);

        messagingTemplate.convertAndSend("/topic/room/" + sessionId, (Object) leftEvent);
    }

    // ===========================================
    // Offer / Answer / ICE candidate
    // Routed to exactly the intended recipient via
    // convertAndSendToUser, NOT broadcast to the whole room.
    // "from" is taken from the authenticated Principal (not
    // trusted from the client payload) so it can't be spoofed.
    // ===========================================
    @MessageMapping("/signal")
    public void signal(@Payload Map<String, Object> message, Principal principal) {

        String to = (String) message.get("to");

        if (to == null || principal == null) {
            return;
        }

        message.put("from", principal.getName());

        messagingTemplate.convertAndSendToUser(to, "/queue/signal", (Object) message);
    }

}