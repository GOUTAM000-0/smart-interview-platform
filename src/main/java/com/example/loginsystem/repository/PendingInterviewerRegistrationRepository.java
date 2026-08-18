package com.example.loginsystem.repository;

import com.example.loginsystem.entity.PendingInterviewerRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.Optional;


@Repository
public interface PendingInterviewerRegistrationRepository
        extends JpaRepository<PendingInterviewerRegistration, Long> {

    Optional<PendingInterviewerRegistration> findByEmail(String email);

    void deleteByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);
}