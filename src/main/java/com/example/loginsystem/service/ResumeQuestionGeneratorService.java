package com.example.loginsystem.service;

import com.example.loginsystem.config.GroqConfig;
import com.example.loginsystem.dto.GenerateResumeQuestionResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ResumeQuestionGeneratorService {

    @Autowired
    private ResumePdfExtractorService resumePdfExtractorService;

    @Autowired
    private GroqConfig groqConfig;

    private final RestTemplate restTemplate = new RestTemplate();

    public GenerateResumeQuestionResponse generateQuestions(
            MultipartFile resume,
            String jobRole) {

        try {

            // Extract text from uploaded PDF
            String resumeText =
                    resumePdfExtractorService.extractText(resume);

            // Limit text size
            if (resumeText.length() > 12000) {
                resumeText = resumeText.substring(0, 12000);
            }

            String prompt =
                    """
                    You are a Senior Technical Interviewer.

                    Read the candidate resume carefully.

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

                    2 HR Questions

                    3 Resume Questions

                    15 Technical Questions

                    3 Coding Questions

                    3 Project Questions

                    Every question MUST have a professional interview answer.

                    Return ONLY JSON.

                    No markdown.

                    No explanation.

                    No ```json

                    No extra text.

                    """.formatted(resumeText, jobRole);

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

            content = content.replace("```json", "")
                    .replace("```", "")
                    .trim();

            ObjectMapper mapper = new ObjectMapper();

            Object questionObject =
                    mapper.readValue(content, Object.class);

            return new GenerateResumeQuestionResponse(
                    true,
                    "Questions Generated Successfully.",
                    questionObject
            );

        } catch (Exception e) {

            e.printStackTrace();

            return new GenerateResumeQuestionResponse(
                    false,
                    e.getMessage(),
                    null
            );
        }
    }
}