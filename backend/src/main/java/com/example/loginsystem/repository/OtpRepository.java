package com.example.loginsystem.repository;

import com.example.loginsystem.entity.OtpDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OtpRepository extends JpaRepository<OtpDetails, Long> {

    Optional<OtpDetails> findByEmail(String email);
    Optional<OtpDetails> findByEmailAndOtp(String email, String otp);
    Optional<OtpDetails> findByEmailAndVerifiedTrue(String email);

    void deleteByEmail(String email);

}