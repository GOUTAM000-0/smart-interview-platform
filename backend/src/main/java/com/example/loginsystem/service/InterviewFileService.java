package com.example.loginsystem.service;

import com.example.loginsystem.dto.UploadCvResponse;
import com.example.loginsystem.entity.InterviewSession;
import com.example.loginsystem.repository.InterviewSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Optional;

@Service
public class InterviewFileService {

    @Autowired
    private InterviewSessionRepository interviewSessionRepository;

    private static final String UPLOAD_DIR = "uploads";

    public UploadCvResponse uploadCv(
            String sessionId,
            MultipartFile file,
            Authentication authentication) {

        Optional<InterviewSession> optionalSession =
                interviewSessionRepository.findBySessionId(sessionId);

        if (optionalSession.isEmpty()) {
            return new UploadCvResponse(
                    false,
                    "Interview session not found.",
                    null
            );
        }

        InterviewSession session = optionalSession.get();

        // Only candidate can upload
        if (!session.getCandidateEmail().equals(authentication.getName())) {
            return new UploadCvResponse(
                    false,
                    "Only candidate can upload CV.",
                    null
            );
        }

        if (file == null || file.isEmpty()) {
            return new UploadCvResponse(
                    false,
                    "Please select a file.",
                    null
            );
        }

        try {

            Path uploadPath = Paths.get(UPLOAD_DIR);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFileName = file.getOriginalFilename();

            if (originalFileName == null || originalFileName.isBlank()) {
                return new UploadCvResponse(
                        false,
                        "Invalid file name.",
                        null
                );
            }

            String fileName = sessionId + "_" + originalFileName;

            Path destination = uploadPath.resolve(fileName);

            try (InputStream inputStream = file.getInputStream()) {

                Files.copy(
                        inputStream,
                        destination,
                        StandardCopyOption.REPLACE_EXISTING
                );
            }

            session.setCvPath(destination.toString());

            interviewSessionRepository.save(session);

            System.out.println("CV uploaded successfully: " + destination.toAbsolutePath());

            return new UploadCvResponse(
                    true,
                    "CV uploaded successfully.",
                    fileName
            );

        } catch (Exception e) {

            e.printStackTrace();

            return new UploadCvResponse(
                    false,
                    e.getClass().getSimpleName() + " : " + e.getMessage(),
                    null
            );
        }
    }
}