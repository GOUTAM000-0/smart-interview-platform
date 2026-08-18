package com.example.loginsystem.controller;

import com.example.loginsystem.dto.CandidateDashboardResponse;
import com.example.loginsystem.service.CandidateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/candidate")
public class CandidateController {

    @Autowired
    private CandidateService candidateService;

    @GetMapping("/home")
    public CandidateDashboardResponse home(Authentication authentication) {

        return candidateService.getDashboard(
                authentication.getName()
        );
    }
}