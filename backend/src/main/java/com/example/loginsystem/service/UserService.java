package com.example.loginsystem.service;

import com.example.loginsystem.repository.OtpRepository;
import com.example.loginsystem.dto.VerifyOtpRequest;
import com.example.loginsystem.dto.ForgotPasswordRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.example.loginsystem.response.ApiResponse;
import com.example.loginsystem.dto.LoginRequest;
import com.example.loginsystem.dto.RegisterRequest;
import com.example.loginsystem.entity.User;
import com.example.loginsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;
import com.example.loginsystem.dto.ResetPasswordRequest;
import com.example.loginsystem.entity.OtpDetails;

import com.example.loginsystem.security.JwtUtil;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.BadCredentialsException;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PendingRegistrationService pendingRegistrationService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private OtpService otpService;



    @Autowired
    private EmailService emailService;

    @Autowired
    private OtpRepository otpRepository;


    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    public ApiResponse registerUser(RegisterRequest request) {

        return pendingRegistrationService.sendRegistrationOtp(request);

    }


    public ApiResponse loginUser(LoginRequest request) {

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

        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            return new ApiResponse(false, "User not found.");
        }

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole()
        );

        return new ApiResponse(
                true,
                "Login Successful.",
                token,
                user.getRole()
        );
    }


    public ApiResponse forgotPassword(ForgotPasswordRequest request) {

        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        if (userOptional.isEmpty()) {
            return new ApiResponse(false, "Email is not registered.");
        }

        String otp = otpService.generateOtp();

        otpService.saveOtp(request.getEmail(), otp);

        String subject = "LoginSystem Password Reset OTP";

        String body =
                "Hello,\n\n" +
                        "Your OTP for password reset is: " + otp + "\n\n" +
                        "This OTP is valid for 5 minutes.\n\n" +
                        "If you did not request this, please ignore this email.\n\n" +
                        "Regards,\nLoginSystem Team";

        emailService.sendEmail(request.getEmail(), subject, body);

        return new ApiResponse(true, "OTP sent successfully.");
    }

    public ApiResponse resetPassword(ResetPasswordRequest request) {

        // Check whether passwords match
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            return new ApiResponse(false, "Passwords do not match.");
        }

        // Check user exists
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        if (userOptional.isEmpty()) {
            return new ApiResponse(false, "User not found.");
        }

        // Check OTP has been verified
        Optional<OtpDetails> otpOptional =
                otpRepository.findByEmailAndVerifiedTrue(request.getEmail());

        if (otpOptional.isEmpty()) {
            return new ApiResponse(false, "OTP verification required.");
        }

        // Update password
        User user = userOptional.get();

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);

        // Delete OTP after successful reset
        otpRepository.delete(otpOptional.get());

        return new ApiResponse(true, "Password updated successfully.");
    }

    public ApiResponse verifyOtp(VerifyOtpRequest request) {

        return otpService.verifyOtp(
                request.getEmail(),
                request.getOtp()
        );
    }

    public ApiResponse verifyRegistration(String email, String otp) {

        return pendingRegistrationService.verifyRegistration(email, otp);

    }
}