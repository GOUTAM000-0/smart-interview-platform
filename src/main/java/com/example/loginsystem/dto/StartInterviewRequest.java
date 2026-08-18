package com.example.loginsystem.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class StartInterviewRequest {

    @NotBlank(message = "Candidate Email is required.")
    @Email(message = "Invalid Candidate Email.")
    private String candidateEmail;

    @Email(message = "Invalid Interviewer 2 Email.")
    private String interviewer2;

    @Email(message = "Invalid Interviewer 3 Email.")
    private String interviewer3;

    @Email(message = "Invalid Interviewer 4 Email.")
    private String interviewer4;

    public StartInterviewRequest() {
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
}