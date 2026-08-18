package com.example.loginsystem.dto;

public class GenerateQuestionRequest {

    private String sessionId;
    private String jobRole;

    public GenerateQuestionRequest() {
    }

    public GenerateQuestionRequest(String sessionId, String jobRole) {
        this.sessionId = sessionId;
        this.jobRole = jobRole;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getJobRole() {
        return jobRole;
    }

    public void setJobRole(String jobRole) {
        this.jobRole = jobRole;
    }
}