package com.example.loginsystem.dto;

public class GroqRequest {

    private String cvText;
    private String jobRole;

    public GroqRequest() {
    }

    public GroqRequest(String cvText, String jobRole) {
        this.cvText = cvText;
        this.jobRole = jobRole;
    }

    public String getCvText() {
        return cvText;
    }

    public void setCvText(String cvText) {
        this.cvText = cvText;
    }

    public String getJobRole() {
        return jobRole;
    }

    public void setJobRole(String jobRole) {
        this.jobRole = jobRole;
    }
}