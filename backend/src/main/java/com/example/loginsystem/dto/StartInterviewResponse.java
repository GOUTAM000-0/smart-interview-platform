package com.example.loginsystem.dto;

public class StartInterviewResponse {

    private boolean success;

    private String sessionId;

    private String message;

    public StartInterviewResponse() {
    }

    public StartInterviewResponse(
            boolean success,
            String sessionId,
            String message) {

        this.success = success;
        this.sessionId = sessionId;
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}