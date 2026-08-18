package com.example.loginsystem.service;

import com.example.loginsystem.dto.InterviewerLoginRequest;
import com.example.loginsystem.dto.InterviewerRegisterRequest;
import com.example.loginsystem.entity.Interviewer;
import com.example.loginsystem.repository.InterviewerRepository;
import com.example.loginsystem.response.ApiResponse;
import com.example.loginsystem.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;


import com.example.loginsystem.dto.InterviewerForgotPasswordRequest;
import com.example.loginsystem.dto.InterviewerResetPasswordRequest;
import com.example.loginsystem.dto.InterviewerVerifyOtpRequest;

import com.example.loginsystem.entity.InterviewerOtpDetails;
import com.example.loginsystem.repository.InterviewerOtpRepository;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@Service
public class InterviewerService {

    @Autowired
    private InterviewerRepository interviewerRepository;

    @Autowired
    private PendingInterviewerRegistrationService pendingInterviewerRegistrationService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private InterviewerOtpService interviewerOtpService;

    @Autowired
    private InterviewerOtpRepository interviewerOtpRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public ApiResponse registerInterviewer(InterviewerRegisterRequest request) {

        return pendingInterviewerRegistrationService.sendRegistrationOtp(request);
    }

    public ApiResponse verifyRegistration(String email, String otp) {

        return pendingInterviewerRegistrationService.verifyRegistration(email, otp);
    }

    public ApiResponse loginInterviewer(InterviewerLoginRequest request) {

        try {

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

        } catch (BadCredentialsException ex) {

            return new ApiResponse(false, "Invalid Email or Password.");
        }

        Interviewer interviewer =
                interviewerRepository.findByEmail(request.getEmail())
                        .orElse(null);

        if (interviewer == null) {
            return new ApiResponse(false, "Interviewer not found.");
        }

        String token = jwtUtil.generateToken(
                interviewer.getEmail(),
                interviewer.getRole()
        );

        return new ApiResponse(
                true,
                "Interviewer Login Successful.",
                token,
                interviewer.getRole()
        );
    }

    public ApiResponse forgotPassword(InterviewerForgotPasswordRequest request) {

        Optional<Interviewer> interviewerOptional =
                interviewerRepository.findByEmail(request.getEmail());

        if (interviewerOptional.isEmpty()) {
            return new ApiResponse(false, "Email is not registered.");
        }

        String otp = interviewerOtpService.generateOtp();

        interviewerOtpService.saveOtp(
                request.getEmail(),
                otp
        );

        String subject = "LoginSystem Interviewer Password Reset OTP";

        String body =
                "Hello,\n\n" +
                        "Your OTP for password reset is: " + otp + "\n\n" +
                        "This OTP is valid for 5 minutes.\n\n" +
                        "If you did not request this, please ignore this email.\n\n" +
                        "Regards,\nLoginSystem Team";

        emailService.sendEmail(
                request.getEmail(),
                subject,
                body
        );

        return new ApiResponse(
                true,
                "OTP sent successfully."
        );
    }

    public ApiResponse verifyOtp(InterviewerVerifyOtpRequest request) {

        return interviewerOtpService.verifyOtp(
                request.getEmail(),
                request.getOtp()
        );
    }
    public ApiResponse resetPassword(InterviewerResetPasswordRequest request) {

        // Check password match
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            return new ApiResponse(false, "Passwords do not match.");
        }

        // Check interviewer exists
        Optional<Interviewer> interviewerOptional =
                interviewerRepository.findByEmail(request.getEmail());

        if (interviewerOptional.isEmpty()) {
            return new ApiResponse(false, "Interviewer not found.");
        }

        // Check OTP verified
        Optional<InterviewerOtpDetails> otpOptional =
                interviewerOtpRepository.findByEmailAndVerifiedTrue(
                        request.getEmail()
                );

        if (otpOptional.isEmpty()) {
            return new ApiResponse(false, "OTP verification required.");
        }

        // Update password
        Interviewer interviewer = interviewerOptional.get();

        interviewer.setPassword(
                passwordEncoder.encode(request.getNewPassword())
        );

        interviewerRepository.save(interviewer);

        // Delete OTP
        interviewerOtpRepository.delete(otpOptional.get());

        return new ApiResponse(
                true,
                "Password updated successfully."
        );
    }
}