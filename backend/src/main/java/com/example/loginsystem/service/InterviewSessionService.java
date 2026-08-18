package com.example.loginsystem.service;

import com.example.loginsystem.dto.InterviewSessionResponse;
import com.example.loginsystem.dto.StartInterviewRequest;
import com.example.loginsystem.dto.StartInterviewResponse;
import com.example.loginsystem.entity.InterviewSession;
import com.example.loginsystem.repository.InterviewSessionRepository;
import com.example.loginsystem.repository.InterviewerRepository;
import com.example.loginsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class InterviewSessionService {

    @Autowired
    private InterviewSessionRepository interviewSessionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InterviewerRepository interviewerRepository;

    // =====================================================
    // Start Interview
    // =====================================================

    public StartInterviewResponse startInterview(
            String conductorEmail,
            StartInterviewRequest request) {

        conductorEmail = normalize(conductorEmail);

        String candidateEmail = normalize(request.getCandidateEmail());
        String interviewer2 = normalize(request.getInterviewer2());
        String interviewer3 = normalize(request.getInterviewer3());
        String interviewer4 = normalize(request.getInterviewer4());

        // Candidate must exist
        // NOTE: findByEmail is case-sensitive at the DB level, so we
        // normalize on our side. If your repository queries are also
        // case-sensitive, this still only helps if emails are stored
        // consistently — see note below the method.
        if (userRepository.findByEmail(candidateEmail).isEmpty()) {

            return new StartInterviewResponse(
                    false,
                    null,
                    "Candidate not found."
            );
        }

        Set<String> emails = new HashSet<>();

        emails.add(conductorEmail);

        // Candidate duplicate check
        if (!emails.add(candidateEmail)) {

            return new StartInterviewResponse(
                    false,
                    null,
                    "Duplicate email found."
            );
        }

        // Interviewer 2
        if (interviewer2 != null && !interviewer2.isBlank()) {

            if (interviewerRepository.findByEmail(interviewer2).isEmpty()) {

                return new StartInterviewResponse(
                        false,
                        null,
                        "Interviewer 2 not found."
                );
            }

            if (!emails.add(interviewer2)) {

                return new StartInterviewResponse(
                        false,
                        null,
                        "Duplicate email found."
                );
            }
        }

        // Interviewer 3
        if (interviewer3 != null && !interviewer3.isBlank()) {

            if (interviewerRepository.findByEmail(interviewer3).isEmpty()) {

                return new StartInterviewResponse(
                        false,
                        null,
                        "Interviewer 3 not found."
                );
            }

            if (!emails.add(interviewer3)) {

                return new StartInterviewResponse(
                        false,
                        null,
                        "Duplicate email found."
                );
            }
        }

        // Interviewer 4
        if (interviewer4 != null && !interviewer4.isBlank()) {

            if (interviewerRepository.findByEmail(interviewer4).isEmpty()) {

                return new StartInterviewResponse(
                        false,
                        null,
                        "Interviewer 4 not found."
                );
            }

            if (!emails.add(interviewer4)) {

                return new StartInterviewResponse(
                        false,
                        null,
                        "Duplicate email found."
                );
            }
        }

        String sessionId = "INT-" +
                UUID.randomUUID()
                        .toString()
                        .replace("-", "")
                        .substring(0, 8)
                        .toUpperCase();

        InterviewSession session = new InterviewSession();

        session.setSessionId(sessionId);
        session.setConductorEmail(conductorEmail);
        session.setCandidateEmail(candidateEmail);
        session.setInterviewer2(interviewer2);
        session.setInterviewer3(interviewer3);
        session.setInterviewer4(interviewer4);
        session.setStatus("PENDING");
        session.setCreatedAt(LocalDateTime.now());

        interviewSessionRepository.save(session);

        return new StartInterviewResponse(
                true,
                sessionId,
                "Interview Session Created Successfully."
        );
    }

    // =====================================================
    // Get Interview Session Details
    // =====================================================

    public InterviewSessionResponse getSession(String sessionId) {

        InterviewSession session = interviewSessionRepository
                .findBySessionId(sessionId)
                .orElseThrow(() ->
                        new RuntimeException("Interview Session Not Found."));

        InterviewSessionResponse response = new InterviewSessionResponse();

        response.setSessionId(session.getSessionId());
        response.setConductorEmail(session.getConductorEmail());
        response.setCandidateEmail(session.getCandidateEmail());
        response.setStatus(session.getStatus());

        List<String> participants = new ArrayList<>();

        participants.add(session.getCandidateEmail());
        participants.add(session.getConductorEmail());

        if (session.getInterviewer2() != null &&
                !session.getInterviewer2().isBlank()) {
            participants.add(session.getInterviewer2());
        }

        if (session.getInterviewer3() != null &&
                !session.getInterviewer3().isBlank()) {
            participants.add(session.getInterviewer3());
        }

        if (session.getInterviewer4() != null &&
                !session.getInterviewer4().isBlank()) {
            participants.add(session.getInterviewer4());
        }

        response.setParticipants(participants);

        return response;
    }



    // =====================================================
// Complete Interview
// =====================================================

    public StartInterviewResponse completeInterview(
            String sessionId,
            String interviewerEmail) {

        InterviewSession session = interviewSessionRepository
                .findBySessionId(sessionId)
                .orElseThrow(() ->
                        new RuntimeException("Interview Session Not Found."));

        interviewerEmail = normalize(interviewerEmail);

        boolean authorized =
                interviewerEmail.equals(normalize(session.getConductorEmail()))
                        || interviewerEmail.equals(normalize(session.getInterviewer2()))
                        || interviewerEmail.equals(normalize(session.getInterviewer3()))
                        || interviewerEmail.equals(normalize(session.getInterviewer4()));

        if (!authorized) {

            return new StartInterviewResponse(
                    false,
                    null,
                    "You are not authorized to complete this interview."
            );
        }

        session.setStatus("COMPLETED");

        interviewSessionRepository.save(session);

        return new StartInterviewResponse(
                true,
                sessionId,
                "Interview completed successfully."
        );
    }



    // =====================================================
    // Helper: trim + lowercase so email comparisons/lookups
    // are consistent regardless of how the user typed them
    // =====================================================
    private String normalize(String email) {
        if (email == null) {
            return null;
        }
        return email.trim().toLowerCase();
    }

}