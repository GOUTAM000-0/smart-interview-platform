package com.example.loginsystem.dto;

import java.time.LocalDateTime;

public class InterviewInvitationResponse {

    private String sessionId;
    private String conductorEmail;
    private String candidateEmail;
    private String interviewer2;
    private String interviewer3;
    private String interviewer4;
    private String status;
    private LocalDateTime createdAt;

    public InterviewInvitationResponse() {
    }

    public InterviewInvitationResponse(
            String sessionId,
            String conductorEmail,
            String candidateEmail,
            String interviewer2,
            String interviewer3,
            String interviewer4,
            String status,
            LocalDateTime createdAt) {

        this.sessionId = sessionId;
        this.conductorEmail = conductorEmail;
        this.candidateEmail = candidateEmail;
        this.interviewer2 = interviewer2;
        this.interviewer3 = interviewer3;
        this.interviewer4 = interviewer4;
        this.status = status;
        this.createdAt = createdAt;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}