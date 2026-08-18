package com.example.loginsystem.service;

import com.example.loginsystem.dto.InterviewerRegisterRequest;
import com.example.loginsystem.entity.Interviewer;
import com.example.loginsystem.entity.PendingInterviewerRegistration;
import com.example.loginsystem.repository.InterviewerRepository;
import com.example.loginsystem.repository.PendingInterviewerRegistrationRepository;
import com.example.loginsystem.response.ApiResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;


@Service
public class PendingInterviewerRegistrationService {


    @Autowired
    private PendingInterviewerRegistrationRepository pendingInterviewerRegistrationRepository;


    @Autowired
    private InterviewerRepository interviewerRepository;


    @Autowired
    private PasswordEncoder passwordEncoder;


    @Autowired
    private EmailService emailService;


    @Autowired
    private OtpService otpService;



    public ApiResponse sendRegistrationOtp(
            InterviewerRegisterRequest request) {


        // Check email already exists
        if (interviewerRepository.findByEmail(request.getEmail()).isPresent()) {

            return new ApiResponse(false,
                    "Email is already registered.");
        }


        // Check phone already exists
        if (interviewerRepository.existsByPhone(request.getPhone())) {

            return new ApiResponse(false,
                    "Phone number is already registered.");
        }


        // Check password match
        if (!request.getPassword()
                .equals(request.getConfirmPassword())) {

            return new ApiResponse(false,
                    "Passwords do not match.");
        }



        // Remove old pending registration
        pendingInterviewerRegistrationRepository
                .findByEmail(request.getEmail())
                .ifPresent(
                        pendingInterviewerRegistrationRepository::delete
                );



        // Generate OTP
        String otp = otpService.generateOtp();



        // Create pending interviewer

        PendingInterviewerRegistration pending =
                new PendingInterviewerRegistration();


        pending.setName(request.getName());

        pending.setEmail(request.getEmail());

        pending.setPhone(request.getPhone());

        pending.setCompanyName(request.getCompanyName());


        // Encrypt password before temporary storage
        pending.setPassword(
                passwordEncoder.encode(request.getPassword())
        );


        pending.setOtp(otp);


        pending.setCreatedAt(LocalDateTime.now());

        pending.setExpiryTime(
                LocalDateTime.now().plusMinutes(5)
        );



        pendingInterviewerRegistrationRepository.save(pending);



        // Send OTP Email

        String subject =
                "LoginSystem Interviewer Email Verification OTP";


        String body =
                "Hello,\n\n" +
                        "Your OTP for interviewer email verification is: "
                        + otp +
                        "\n\nThis OTP is valid for 5 minutes.\n\n" +
                        "Regards,\nLoginSystem Team";


        emailService.sendEmail(
                request.getEmail(),
                subject,
                body
        );


        return new ApiResponse(
                true,
                "OTP sent successfully. Please verify your email."
        );
    }




    public ApiResponse verifyRegistration(
            String email,
            String otp) {


        PendingInterviewerRegistration pending =
                pendingInterviewerRegistrationRepository
                        .findByEmail(email)
                        .orElse(null);



        if (pending == null) {

            return new ApiResponse(false,
                    "Registration request not found.");
        }



        if (!pending.getOtp().equals(otp)) {

            return new ApiResponse(false,
                    "Invalid OTP.");
        }



        // OTP expiry check

        if (pending.getExpiryTime()
                .isBefore(LocalDateTime.now())) {


            pendingInterviewerRegistrationRepository
                    .delete(pending);


            return new ApiResponse(false,
                    "OTP has expired.");
        }




        // Create interviewer

        Interviewer interviewer = new Interviewer();


        interviewer.setName(
                pending.getName()
        );


        interviewer.setEmail(
                pending.getEmail()
        );


        interviewer.setPhone(
                pending.getPhone()
        );


        interviewer.setCompanyName(
                pending.getCompanyName()
        );


        interviewer.setPassword(
                pending.getPassword()
        );

      // Assign Interviewer Role
        interviewer.setRole("ROLE_INTERVIEWER");

        interviewerRepository.save(interviewer);



        // Delete pending data

        pendingInterviewerRegistrationRepository
                .delete(pending);



        return new ApiResponse(
                true,
                "Interviewer Registration Successful."
        );
    }
}