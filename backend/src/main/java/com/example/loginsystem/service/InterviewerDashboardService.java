package com.example.loginsystem.service;

import com.example.loginsystem.dto.InterviewerDashboardResponse;
import com.example.loginsystem.entity.Interviewer;
import com.example.loginsystem.repository.InterviewerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InterviewerDashboardService {

    @Autowired
    private InterviewerRepository interviewerRepository;

    public InterviewerDashboardResponse getDashboard(String email) {

        Interviewer interviewer =
                interviewerRepository.findByEmail(email).orElse(null);

        if (interviewer == null) {

            return new InterviewerDashboardResponse(
                    false,
                    null,
                    null,
                    null,
                    null,
                    "Interviewer not found."
            );
        }

        return new InterviewerDashboardResponse(
                true,
                interviewer.getName(),
                interviewer.getEmail(),
                interviewer.getCompanyName(),
                interviewer.getRole(),
                "Choose an option below."
        );
    }
}