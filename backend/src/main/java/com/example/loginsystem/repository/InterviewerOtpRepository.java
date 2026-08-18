package com.example.loginsystem.repository;

import com.example.loginsystem.entity.InterviewerOtpDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InterviewerOtpRepository
        extends JpaRepository<InterviewerOtpDetails, Long> {

    Optional<InterviewerOtpDetails> findByEmail(String email);

    Optional<InterviewerOtpDetails> findByEmailAndVerifiedTrue(String email);

    void deleteByEmail(String email);
}