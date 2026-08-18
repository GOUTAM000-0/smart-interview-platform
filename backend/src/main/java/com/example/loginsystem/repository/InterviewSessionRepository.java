package com.example.loginsystem.repository;

import com.example.loginsystem.entity.InterviewSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InterviewSessionRepository
        extends JpaRepository<InterviewSession, Long> {

    Optional<InterviewSession> findBySessionId(String sessionId);

    List<InterviewSession> findByCandidateEmail(String candidateEmail);

    List<InterviewSession> findByConductorEmail(String conductorEmail);

    List<InterviewSession> findByInterviewer2(String interviewer2);

    List<InterviewSession> findByInterviewer3(String interviewer3);

    List<InterviewSession> findByInterviewer4(String interviewer4);
}