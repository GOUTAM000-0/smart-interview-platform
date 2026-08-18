package com.example.loginsystem.service;

import com.example.loginsystem.dto.InterviewInvitationResponse;
import com.example.loginsystem.entity.InterviewSession;
import com.example.loginsystem.repository.InterviewSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class InterviewInvitationService {

    @Autowired
    private InterviewSessionRepository interviewSessionRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // ===========================================
    // Candidate: View interview invitations
    // ===========================================
    public List<InterviewInvitationResponse> getCandidateInvitations(String email) {

        List<InterviewSession> sessions =
                interviewSessionRepository.findByCandidateEmail(email);

        return toResponseList(sessions);
    }

    // ===========================================
    // Candidate Accept Interview
    // ===========================================
    public String acceptInterview(String sessionId, String candidateEmail) {

        InterviewSession session =
                interviewSessionRepository.findBySessionId(sessionId)
                        .orElse(null);

        if (session == null) {
            return "Interview Session Not Found.";
        }

        // Security Check
        if (!session.getCandidateEmail().equalsIgnoreCase(candidateEmail)) {
            return "Unauthorized Candidate.";
        }

        session.setStatus("ACCEPTED");

        interviewSessionRepository.save(session);

        notifyInterviewers(session);

        return "Interview Accepted Successfully.";
    }

    // ===========================================
    // Candidate Reject Interview
    // ===========================================
    public String rejectInterview(String sessionId, String candidateEmail) {

        InterviewSession session =
                interviewSessionRepository.findBySessionId(sessionId)
                        .orElse(null);

        if (session == null) {
            return "Interview Session Not Found.";
        }

        // Security Check
        if (!session.getCandidateEmail().equalsIgnoreCase(candidateEmail)) {
            return "Unauthorized Candidate.";
        }

        session.setStatus("REJECTED");

        interviewSessionRepository.save(session);

        notifyInterviewers(session);

        return "Interview Rejected Successfully.";
    }

    // ===========================================
    // Conductor: View Created Interviews
    // ===========================================
    public List<InterviewInvitationResponse> getInterviewerSessions(String email) {

        List<InterviewSession> sessions =
                interviewSessionRepository.findByConductorEmail(email);

        return toResponseList(sessions);
    }

    // ===========================================
    // Invited Interviewer: View Invitations
    // ===========================================
    public List<InterviewInvitationResponse> getInterviewerInvitations(String email) {

        List<InterviewSession> sessions = new ArrayList<>();

        sessions.addAll(interviewSessionRepository.findByInterviewer2(email));
        sessions.addAll(interviewSessionRepository.findByInterviewer3(email));
        sessions.addAll(interviewSessionRepository.findByInterviewer4(email));

        List<InterviewInvitationResponse> response = new ArrayList<>();

        for (InterviewSession session : sessions) {

            // Show invitation only after candidate has accepted
            if ("ACCEPTED".equalsIgnoreCase(session.getStatus())) {
                response.add(toResponse(session));
            }
        }

        return response;
    }

    // ===========================================
    // Real-time push: called after accept/reject so the
    // conductor and every invited interviewer's dashboard
    // updates live instead of needing a manual refresh.
    // ===========================================
    private void notifyInterviewers(InterviewSession session) {

        // Conductor sees ALL their created sessions regardless of status
        pushUpdatedListTo(session.getConductorEmail());

        // Invited interviewers only ever see ACCEPTED sessions, but we
        // still push on reject too so a stale PENDING entry (if any
        // client cached one) gets cleared/refreshed correctly.
        if (session.getInterviewer2() != null) {
            pushUpdatedListTo(session.getInterviewer2());
        }
        if (session.getInterviewer3() != null) {
            pushUpdatedListTo(session.getInterviewer3());
        }
        if (session.getInterviewer4() != null) {
            pushUpdatedListTo(session.getInterviewer4());
        }
    }

    // Builds the same merged view (conducted + invited-accepted) that
    // InterviewerDashboard.jsx builds on initial load, and pushes it to
    // that user's private queue: /user/queue/invitations-update
    private void pushUpdatedListTo(String email) {

        Map<String, InterviewInvitationResponse> merged = new LinkedHashMap<>();

        for (InterviewSession s : interviewSessionRepository.findByConductorEmail(email)) {
            merged.put(s.getSessionId(), toResponse(s));
        }

        List<InterviewSession> invited = new ArrayList<>();
        invited.addAll(interviewSessionRepository.findByInterviewer2(email));
        invited.addAll(interviewSessionRepository.findByInterviewer3(email));
        invited.addAll(interviewSessionRepository.findByInterviewer4(email));

        for (InterviewSession s : invited) {
            if ("ACCEPTED".equalsIgnoreCase(s.getStatus())) {
                merged.put(s.getSessionId(), toResponse(s));
            }
        }

        messagingTemplate.convertAndSendToUser(
                email,
                "/queue/invitations-update",
                new ArrayList<>(merged.values())
        );
    }

    // ===========================================
    // Helpers
    // ===========================================
    private InterviewInvitationResponse toResponse(InterviewSession session) {
        return new InterviewInvitationResponse(
                session.getSessionId(),
                session.getConductorEmail(),
                session.getCandidateEmail(),
                session.getInterviewer2(),
                session.getInterviewer3(),
                session.getInterviewer4(),
                session.getStatus(),
                session.getCreatedAt()
        );
    }

    private List<InterviewInvitationResponse> toResponseList(List<InterviewSession> sessions) {
        List<InterviewInvitationResponse> response = new ArrayList<>();
        for (InterviewSession session : sessions) {
            response.add(toResponse(session));
        }
        return response;
    }
}