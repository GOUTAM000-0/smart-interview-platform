package com.example.loginsystem.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ResumePdfExtractorService {

    public String extractText(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Please upload a resume.");
        }

        try (PDDocument document = Loader.loadPDF(file.getBytes())) {

            PDFTextStripper stripper = new PDFTextStripper();

            return stripper.getText(document);

        } catch (IOException e) {

            throw new RuntimeException("Unable to read PDF file.");
        }
    }
}