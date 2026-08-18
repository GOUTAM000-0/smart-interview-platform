package com.example.loginsystem.service;

import com.example.loginsystem.entity.InterviewerOtpDetails;
import com.example.loginsystem.repository.InterviewerOtpRepository;
import com.example.loginsystem.response.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class InterviewerOtpService {

    @Autowired
    private InterviewerOtpRepository interviewerOtpRepository;

    public String generateOtp() {

        Random random = new Random();

        int number = 100000 + random.nextInt(900000);

        return String.valueOf(number);
    }

    public void saveOtp(String email, String otp) {

        interviewerOtpRepository.deleteByEmail(email);

        InterviewerOtpDetails otpDetails = new InterviewerOtpDetails();

        otpDetails.setEmail(email);
        otpDetails.setOtp(otp);
        otpDetails.setVerified(false);
        otpDetails.setCreatedAt(LocalDateTime.now());
        otpDetails.setExpiryTime(LocalDateTime.now().plusMinutes(5));

        interviewerOtpRepository.save(otpDetails);
    }

    public ApiResponse verifyOtp(String email, String otp) {

        InterviewerOtpDetails otpDetails =
                interviewerOtpRepository.findByEmail(email).orElse(null);

        if (otpDetails == null) {
            return new ApiResponse(false, "OTP not found.");
        }

        if (!otpDetails.getOtp().equals(otp)) {
            return new ApiResponse(false, "Invalid OTP.");
        }

        if (otpDetails.getExpiryTime().isBefore(LocalDateTime.now())) {

            interviewerOtpRepository.delete(otpDetails);

            return new ApiResponse(false, "OTP expired.");
        }

        otpDetails.setVerified(true);

        interviewerOtpRepository.save(otpDetails);

        return new ApiResponse(true, "OTP Verified Successfully.");
    }
}