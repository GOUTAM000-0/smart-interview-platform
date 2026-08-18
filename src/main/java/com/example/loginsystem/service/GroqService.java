package com.example.loginsystem.service;

import com.example.loginsystem.config.GroqConfig;
import com.example.loginsystem.dto.GenerateQuestionRequest;
import com.example.loginsystem.dto.GroqResponse;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GroqService {

    @Autowired
    private GroqConfig groqConfig;

    @Autowired
    private PdfExtractorService pdfExtractorService;

    private final RestTemplate restTemplate = new RestTemplate();

    public GroqResponse generateQuestions(GenerateQuestionRequest request) {

        try {

            // Extract CV text automatically from uploaded PDF
            String cvText =
                    pdfExtractorService.extractCvText(request.getSessionId());

            // Limit text size (important for free Groq quota)
            if (cvText.length() > 12000) {
                cvText = cvText.substring(0, 12000);
            }

            String prompt =
                    """
                    You are a Senior Technical Interviewer.
            
                    Read the candidate CV carefully.
            
                    Candidate Resume:
            
                    %s
            
                    Job Role:
            
                    %s
            
                    Generate interview questions ONLY in VALID JSON.
            
                    Return EXACTLY this JSON structure:
            
                    {
                      "hr":[
                        {
                          "question":"",
                          "answer":""
                        }
                      ],
            
                      "resume":[
                        {
                          "question":"",
                          "answer":""
                        }
                      ],
            
                      "technical":[
                        {
                          "question":"",
                          "answer":""
                        }
                      ],
            
                      "coding":[
                        {
                          "question":"",
                          "answer":""
                        }
                      ],
            
                      "project":[
                        {
                          "question":"",
                          "answer":""
                        }
                      ]
                    }
            
                    Rules:
            
                    Generate
            
                    3 HR Questions
            
                    3 Resume Questions
            
                    10 Technical Questions
            
                    2 Coding Questions
            
                    5 Project Questions
            
                    Every question MUST have a professional interview answer.
            
                    Return ONLY JSON.
            
                    No markdown.
            
                    No explanation.
            
                    No ```json
            
                    No extra text.
            
                    """.formatted(cvText, request.getJobRole());

            JSONObject body = new JSONObject();

            body.put("model", groqConfig.getModel());

            JSONArray messages = new JSONArray();

            JSONObject userMessage = new JSONObject();

            userMessage.put("role", "user");
            userMessage.put("content", prompt);

            messages.put(userMessage);

            body.put("messages", messages);

            HttpHeaders headers = new HttpHeaders();

            headers.setContentType(MediaType.APPLICATION_JSON);

            headers.setBearerAuth(groqConfig.getApiKey());

            HttpEntity<String> entity =
                    new HttpEntity<>(body.toString(), headers);

            ResponseEntity<String> response =
                    restTemplate.exchange(
                            groqConfig.getApiUrl(),
                            HttpMethod.POST,
                            entity,
                            String.class
                    );

            JSONObject json = new JSONObject(response.getBody());

            String content =
                    json.getJSONArray("choices")
                            .getJSONObject(0)
                            .getJSONObject("message")
                            .getString("content");

// Remove accidental markdown fences if the model includes them
            content = content.replace("```json", "")
                    .replace("```", "")
                    .trim();

            com.fasterxml.jackson.databind.ObjectMapper mapper =
                    new com.fasterxml.jackson.databind.ObjectMapper();

            Object questionObject =
                    mapper.readValue(content, Object.class);

            return new GroqResponse(
                    true,
                    "Questions Generated Successfully.",
                    questionObject
            );

        } catch (Exception e) {

            e.printStackTrace();

            return new GroqResponse(
                    false,
                    e.getMessage(),
                    null
            );
        }
    }
}