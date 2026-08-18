package com.example.loginsystem.controller;

import com.example.loginsystem.dto.InterviewerDashboardResponse;
import com.example.loginsystem.service.InterviewerDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/interviewer")
public class InterviewerHomeController {

    @Autowired
    private InterviewerDashboardService interviewerDashboardService;

    @GetMapping("/home")
    public InterviewerDashboardResponse home(Authentication authentication) {

        return interviewerDashboardService.getDashboard(
                authentication.getName()
        );
    }
}