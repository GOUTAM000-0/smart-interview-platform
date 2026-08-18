package com.example.loginsystem.controller;

import com.example.loginsystem.dto.InterviewSessionResponse;
import com.example.loginsystem.dto.StartInterviewRequest;
import com.example.loginsystem.dto.StartInterviewResponse;
import com.example.loginsystem.service.InterviewSessionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/interviewer")
public class InterviewSessionController {

    @Autowired
    private InterviewSessionService interviewSessionService;

    // ==========================================
    // Start Interview
    // ==========================================
    @PostMapping("/start-interview")
    public StartInterviewResponse startInterview(
            Authentication authentication,
            @Valid @RequestBody StartInterviewRequest request) {

        String conductorEmail = authentication.getName();

        return interviewSessionService.startInterview(
                conductorEmail,
                request
        );
    }

    // ==========================================
    // Get Session Details
    // ==========================================
    @GetMapping("/session/{sessionId}")
    public InterviewSessionResponse getSession(
            @PathVariable String sessionId) {

        return interviewSessionService.getSession(sessionId);
    }




    // ==========================================
// Complete Interview
// ==========================================
    @PutMapping("/complete/{sessionId}")
    public StartInterviewResponse completeInterview(
            @PathVariable String sessionId,
            Authentication authentication) {

        return interviewSessionService.completeInterview(
                sessionId,
                authentication.getName()
        );
    }
}