package com.example.loginsystem.repository;

import com.example.loginsystem.entity.Interviewer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InterviewerRepository extends JpaRepository<Interviewer, Long> {

    Optional<Interviewer> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

}