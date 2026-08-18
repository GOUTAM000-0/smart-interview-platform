package com.example.loginsystem.controller;

import com.example.loginsystem.dto.UploadCvResponse;
import com.example.loginsystem.entity.InterviewSession;
import com.example.loginsystem.repository.InterviewSessionRepository;
import com.example.loginsystem.service.InterviewFileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

@RestController
@RequestMapping("/api/interview")

public class InterviewFileController {

    @Autowired
    private InterviewFileService interviewFileService;

    @Autowired
    private InterviewSessionRepository interviewSessionRepository;

    // ===========================================
    // Candidate Upload CV
    // ===========================================
    @PostMapping("/upload-cv/{sessionId}")
    public UploadCvResponse uploadCv(
            @PathVariable String sessionId,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {

        return interviewFileService.uploadCv(
                sessionId,
                file,
                authentication
        );
    }

    // ===========================================
    // Download CV
    // ===========================================
    @GetMapping("/download-cv/{sessionId}")
    public ResponseEntity<Resource> downloadCv(
            @PathVariable String sessionId,
            Authentication authentication) {

        InterviewSession session = interviewSessionRepository
                .findBySessionId(sessionId)
                .orElse(null);

        if (session == null) {
            return ResponseEntity.notFound().build();
        }

        String email = authentication.getName();

        // Allow only participants of this interview
        boolean allowed =
                email.equals(session.getCandidateEmail()) ||
                        email.equals(session.getConductorEmail()) ||
                        email.equals(session.getInterviewer2()) ||
                        email.equals(session.getInterviewer3()) ||
                        email.equals(session.getInterviewer4());

        if (!allowed) {
            return ResponseEntity.status(403).build();
        }

        if (session.getCvPath() == null) {
            return ResponseEntity.notFound().build();
        }

        File file = new File(session.getCvPath());

        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new FileSystemResource(file);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + file.getName() + "\""
                )
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }
}