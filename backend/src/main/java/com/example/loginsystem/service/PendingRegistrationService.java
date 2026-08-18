package com.example.loginsystem.service;
import com.example.loginsystem.entity.User;
import com.example.loginsystem.dto.RegisterRequest;
import com.example.loginsystem.entity.PendingRegistration;
import com.example.loginsystem.repository.PendingRegistrationRepository;
import com.example.loginsystem.repository.UserRepository;
import com.example.loginsystem.response.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PendingRegistrationService {

    @Autowired
    private PendingRegistrationRepository pendingRegistrationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private OtpService otpService;

    public ApiResponse sendRegistrationOtp(RegisterRequest request) {

        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return new ApiResponse(false, "Email is already registered.");
        }

        // Check if phone already exists
        if (userRepository.findByPhone(request.getPhone()).isPresent()) {
            return new ApiResponse(false, "Phone number is already registered.");
        }

        // Check password and confirm password
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return new ApiResponse(false, "Passwords do not match.");
        }

        // Delete previous pending registration if exists
        pendingRegistrationRepository.findByEmail(request.getEmail())
                .ifPresent(pendingRegistrationRepository::delete);

        // Generate OTP
        String otp = otpService.generateOtp();

        // Create Pending Registration
        PendingRegistration pending = new PendingRegistration();

        pending.setName(request.getName());
        pending.setEmail(request.getEmail());
        pending.setPhone(request.getPhone());
        pending.setPassword(passwordEncoder.encode(request.getPassword()));
        pending.setOtp(otp);
        pending.setCreatedAt(LocalDateTime.now());
        pending.setExpiryTime(LocalDateTime.now().plusMinutes(5));

        // Save
        pendingRegistrationRepository.save(pending);

        // Send Email
        String subject = "LoginSystem Email Verification OTP";

        String body =
                "Hello,\n\n" +
                        "Your OTP for email verification is: " + otp + "\n\n" +
                        "This OTP is valid for 5 minutes.\n\n" +
                        "Regards,\nLoginSystem Team";

        emailService.sendEmail(request.getEmail(), subject, body);

        return new ApiResponse(true, "OTP sent successfully. Please verify your email.");
    }


    public ApiResponse verifyRegistration(String email, String otp) {

        // Find pending registration
        PendingRegistration pending =
                pendingRegistrationRepository.findByEmail(email).orElse(null);

        if (pending == null) {
            return new ApiResponse(false, "Registration request not found.");
        }

        // Check OTP
        if (!pending.getOtp().equals(otp)) {
            return new ApiResponse(false, "Invalid OTP.");
        }

        // Check Expiry
        if (pending.getExpiryTime().isBefore(LocalDateTime.now())) {

            pendingRegistrationRepository.delete(pending);

            return new ApiResponse(false, "OTP has expired.");
        }

        // Create User
        User user = new User();

        user.setName(pending.getName());
        user.setEmail(pending.getEmail());
        user.setPhone(pending.getPhone());
        user.setPassword(pending.getPassword());

// Assign Candidate Role
        user.setRole("ROLE_CANDIDATE");

        userRepository.save(user);
        // Delete Pending Registration
        pendingRegistrationRepository.delete(pending);

        return new ApiResponse(true, "Registration Successful.");
    }
}