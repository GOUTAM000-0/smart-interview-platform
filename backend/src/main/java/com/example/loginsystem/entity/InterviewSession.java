package com.example.loginsystem.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "interview_sessions")
public class InterviewSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String sessionId;

    @Column(nullable = false)
    private String conductorEmail;

    @Column(nullable = false)
    private String candidateEmail;

    private String interviewer2;

    private String interviewer3;

    private String interviewer4;

    @Column(nullable = false)
    private String status;

    // ===============================
    // Uploaded CV Path
    // ===============================
    @Column(name = "cv_path")
    private String cvPath;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public InterviewSession() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getConductorEmail() {
        return conductorEmail;
    }

    public void setConductorEmail(String conductorEmail) {
        this.conductorEmail = conductorEmail;
    }

    public String getCandidateEmail() {
        return candidateEmail;
    }

    public void setCandidateEmail(String candidateEmail) {
        this.candidateEmail = candidateEmail;
    }

    public String getInterviewer2() {
        return interviewer2;
    }

    public void setInterviewer2(String interviewer2) {
        this.interviewer2 = interviewer2;
    }

    public String getInterviewer3() {
        return interviewer3;
    }

    public void setInterviewer3(String interviewer3) {
        this.interviewer3 = interviewer3;
    }

    public String getInterviewer4() {
        return interviewer4;
    }

    public void setInterviewer4(String interviewer4) {
        this.interviewer4 = interviewer4;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCvPath() {
        return cvPath;
    }

    public void setCvPath(String cvPath) {
        this.cvPath = cvPath;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}