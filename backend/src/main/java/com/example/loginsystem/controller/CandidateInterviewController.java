package com.example.loginsystem.controller;

import com.example.loginsystem.dto.InterviewInvitationResponse;
import com.example.loginsystem.service.InterviewInvitationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidate")
public class CandidateInterviewController {

    @Autowired
    private InterviewInvitationService interviewInvitationService;

    // Candidate -> View Interview Invitations
    @GetMapping("/interviews")
    public List<InterviewInvitationResponse> getInvitations(
            Authentication authentication) {

        return interviewInvitationService.getCandidateInvitations(
                authentication.getName()
        );
    }


    // Candidate -> Accept Interview
    @PostMapping("/accept/{sessionId}")
    public String acceptInterview(
            @PathVariable String sessionId,
            Authentication authentication) {

        return interviewInvitationService.acceptInterview(
                sessionId,
                authentication.getName()
        );
    }

    // Candidate -> Reject Interview
    @PostMapping("/reject/{sessionId}")
    public String rejectInterview(
            @PathVariable String sessionId,
            Authentication authentication) {

        return interviewInvitationService.rejectInterview(
                sessionId,
                authentication.getName()
        );
    }
}