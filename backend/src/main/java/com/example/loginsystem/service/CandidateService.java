package com.example.loginsystem.service;

import com.example.loginsystem.dto.CandidateDashboardResponse;
import com.example.loginsystem.entity.User;
import com.example.loginsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CandidateService {

    @Autowired
    private UserRepository userRepository;

    public CandidateDashboardResponse getDashboard(String email) {

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {

            return new CandidateDashboardResponse(
                    false,
                    null,
                    null,
                    null,
                    null,
                    "Candidate not found."
            );
        }

        return new CandidateDashboardResponse(
                true,
                user.getName(),
                user.getEmail(),
                user.getRole(),
                "AVAILABLE",
                "Waiting for Interview Invitation..."
        );
    }
}