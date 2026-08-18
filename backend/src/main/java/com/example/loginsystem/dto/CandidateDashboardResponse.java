package com.example.loginsystem.dto;

public class CandidateDashboardResponse {

    private boolean success;
    private String name;
    private String email;
    private String role;
    private String status;
    private String message;

    public CandidateDashboardResponse() {
    }

    public CandidateDashboardResponse(
            boolean success,
            String name,
            String email,
            String role,
            String status,
            String message) {

        this.success = success;
        this.name = name;
        this.email = email;
        this.role = role;
        this.status = status;
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}