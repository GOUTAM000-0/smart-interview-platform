package com.example.loginsystem.controller;

import com.example.loginsystem.dto.InterviewInvitationResponse;
import com.example.loginsystem.service.InterviewInvitationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/interviewer")
public class InterviewerInterviewController {

    @Autowired
    private InterviewInvitationService interviewInvitationService;

    // ===========================================
    // Conductor -> View Created Interviews
    // ===========================================
    @GetMapping("/interviews")
    public List<InterviewInvitationResponse> getMyInterviews(
            Authentication authentication) {

        return interviewInvitationService.getInterviewerSessions(
                authentication.getName()
        );
    }

    // ===========================================
    // Invited Interviewer -> View Interview Invitations
    // ===========================================
    @GetMapping("/invitations")
    public List<InterviewInvitationResponse> getInvitations(
            Authentication authentication) {

        return interviewInvitationService.getInterviewerInvitations(
                authentication.getName()
        );
    }
}