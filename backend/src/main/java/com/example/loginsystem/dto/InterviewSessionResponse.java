package com.example.loginsystem.dto;

import java.util.List;

public class InterviewSessionResponse {

    private String sessionId;
    private String conductorEmail;
    private String candidateEmail;
    private List<String> participants;
    private String status;

    public InterviewSessionResponse() {
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

    public List<String> getParticipants() {
        return participants;
    }

    public void setParticipants(List<String> participants) {
        this.participants = participants;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

}