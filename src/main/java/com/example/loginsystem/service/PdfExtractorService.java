package com.example.loginsystem.service;

import com.example.loginsystem.entity.InterviewSession;
import com.example.loginsystem.repository.InterviewSessionRepository;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.Optional;

@Service
public class PdfExtractorService {

    @Autowired
    private InterviewSessionRepository interviewSessionRepository;

    public String extractCvText(String sessionId) {

        Optional<InterviewSession> optionalSession =
                interviewSessionRepository.findBySessionId(sessionId);

        if (optionalSession.isEmpty()) {
            throw new RuntimeException("Interview Session Not Found.");
        }

        InterviewSession session = optionalSession.get();

        if (session.getCvPath() == null || session.getCvPath().isBlank()) {
            throw new RuntimeException("Candidate has not uploaded CV.");
        }

        File pdfFile = new File(session.getCvPath());

        if (!pdfFile.exists()) {
            throw new RuntimeException("CV file not found.");
        }

        try (PDDocument document = Loader.loadPDF(pdfFile)) {

            PDFTextStripper stripper = new PDFTextStripper();

            return stripper.getText(document);

        } catch (IOException e) {

            throw new RuntimeException("Unable to read CV PDF.");
        }
    }
}