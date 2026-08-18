package com.example.loginsystem.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class VerifyInterviewerRegistrationRequest {

    @Email(message = "Invalid email")
    @NotBlank(message = "Email is required")
    private String email;

    @Pattern(regexp = "\\d{6}", message = "OTP must be 6 digits")
    private String otp;

    public VerifyInterviewerRegistrationRequest() {
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }
}