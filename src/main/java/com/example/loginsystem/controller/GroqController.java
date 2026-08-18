package com.example.loginsystem.controller;

import com.example.loginsystem.dto.GenerateQuestionRequest;
import com.example.loginsystem.dto.GroqResponse;
import com.example.loginsystem.service.GroqService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/interviewer")

public class GroqController {

    @Autowired
    private GroqService groqService;

    @PostMapping("/generate-questions")
    public GroqResponse generateQuestions(
            @RequestBody GenerateQuestionRequest request) {

        return groqService.generateQuestions(request);
    }
}