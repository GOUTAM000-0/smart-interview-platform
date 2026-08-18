package com.example.loginsystem.service;

import com.example.loginsystem.entity.OtpDetails;
import com.example.loginsystem.repository.OtpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.loginsystem.response.ApiResponse;


import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private OtpRepository otpRepository;

    public String generateOtp() {

        Random random = new Random();

        int otp = 100000 + random.nextInt(900000);

        return String.valueOf(otp);
    }

    public void saveOtp(String email, String otp) {

        Optional<OtpDetails> existingOtp = otpRepository.findByEmail(email);

        OtpDetails otpDetails;

        if (existingOtp.isPresent()) {

            otpDetails = existingOtp.get();

        } else {

            otpDetails = new OtpDetails();
            otpDetails.setEmail(email);

        }

        otpDetails.setOtp(otp);

        otpDetails.setExpiryTime(LocalDateTime.now().plusMinutes(5));

        otpDetails.setVerified(false);

        otpRepository.save(otpDetails);
    }

    public ApiResponse verifyOtp(String email, String otp) {

        Optional<OtpDetails> optionalOtp =
                otpRepository.findByEmailAndOtp(email, otp);

        if (optionalOtp.isEmpty()) {
            return new ApiResponse(false, "Invalid OTP.");
        }

        OtpDetails otpDetails = optionalOtp.get();

        // Check OTP Expiry
        if (otpDetails.getExpiryTime().isBefore(LocalDateTime.now())) {
            return new ApiResponse(false, "OTP has expired.");
        }

        // Mark OTP as verified
        otpDetails.setVerified(true);

        otpRepository.save(otpDetails);

        return new ApiResponse(true, "OTP verified successfully.");
    }

}