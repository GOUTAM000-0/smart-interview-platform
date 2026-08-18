package com.example.loginsystem.dto;

public class InterviewerDashboardResponse {

    private boolean success;
    private String name;
    private String email;
    private String companyName;
    private String role;
    private String message;

    public InterviewerDashboardResponse() {
    }

    public InterviewerDashboardResponse(
            boolean success,
            String name,
            String email,
            String companyName,
            String role,
            String message) {

        this.success = success;
        this.name = name;
        this.email = email;
        this.companyName = companyName;
        this.role = role;
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

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}