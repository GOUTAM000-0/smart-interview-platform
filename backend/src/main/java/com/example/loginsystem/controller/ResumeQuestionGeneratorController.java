package com.example.loginsystem.controller;

import com.example.loginsystem.dto.GenerateResumeQuestionResponse;
import com.example.loginsystem.service.ResumeQuestionGeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/ai")

public class ResumeQuestionGeneratorController {

    @Autowired
    private ResumeQuestionGeneratorService resumeQuestionGeneratorService;

    @PostMapping(
            value = "/generate-from-resume",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public GenerateResumeQuestionResponse generateQuestions(

            @RequestParam("resume") MultipartFile resume,

            @RequestParam("jobRole") String jobRole

    ) {

        return resumeQuestionGeneratorService.generateQuestions(
                resume,
                jobRole
        );
    }
}