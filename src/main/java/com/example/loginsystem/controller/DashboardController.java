package com.example.loginsystem.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DashboardController {

    @GetMapping("/api/dashboard")
    public String dashboard(Authentication authentication) {

        String role = authentication.getAuthorities()
                .iterator()
                .next()
                .getAuthority();

        if ("ROLE_CANDIDATE".equals(role)) {
            return "Your login successful as a Candidate.";
        }

        if ("ROLE_INTERVIEWER".equals(role)) {
            return "Your login successful as an Interviewer.";
        }

        return "Unknown Role";
    }
}