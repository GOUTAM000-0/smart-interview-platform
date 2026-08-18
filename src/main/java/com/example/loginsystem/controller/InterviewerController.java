package com.example.loginsystem.controller;

import com.example.loginsystem.dto.InterviewerForgotPasswordRequest;
import com.example.loginsystem.dto.InterviewerLoginRequest;
import com.example.loginsystem.dto.InterviewerRegisterRequest;
import com.example.loginsystem.dto.InterviewerResetPasswordRequest;
import com.example.loginsystem.dto.InterviewerVerifyOtpRequest;
import com.example.loginsystem.dto.VerifyInterviewerRegistrationRequest;
import com.example.loginsystem.response.ApiResponse;
import com.example.loginsystem.service.InterviewerService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/interviewers")
public class InterviewerController {

    @Autowired
    private InterviewerService interviewerService;

    // Register Interviewer
    @PostMapping("/register")
    public ApiResponse registerInterviewer(
            @Valid @RequestBody InterviewerRegisterRequest request) {

        return interviewerService.registerInterviewer(request);
    }

    @GetMapping("/test")
    public String test() {
        return "JWT Working";
    }

    // Verify Registration OTP
    @PostMapping("/verify-registration")
    public ApiResponse verifyRegistration(
            @Valid @RequestBody VerifyInterviewerRegistrationRequest request) {

        return interviewerService.verifyRegistration(
                request.getEmail(),
                request.getOtp()
        );
    }

    // Login
    @PostMapping("/login")
    public ApiResponse loginInterviewer(
            @Valid @RequestBody InterviewerLoginRequest request) {

        return interviewerService.loginInterviewer(request);
    }

    // Forgot Password
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse> forgotPassword(
            @Valid @RequestBody InterviewerForgotPasswordRequest request) {

        ApiResponse response = interviewerService.forgotPassword(request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.badRequest().body(response);
    }

    // Verify OTP
    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse> verifyOtp(
            @Valid @RequestBody InterviewerVerifyOtpRequest request) {

        ApiResponse response = interviewerService.verifyOtp(request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.badRequest().body(response);
    }

    // Reset Password
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse> resetPassword(
            @Valid @RequestBody InterviewerResetPasswordRequest request) {

        ApiResponse response = interviewerService.resetPassword(request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.badRequest().body(response);
    }
}