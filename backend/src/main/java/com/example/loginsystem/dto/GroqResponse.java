package com.example.loginsystem.dto;

public class GroqResponse {

    private boolean success;
    private String message;
    private Object questions;

    public GroqResponse() {
    }

    public GroqResponse(boolean success,
                        String message,
                        Object questions) {

        this.success = success;
        this.message = message;
        this.questions = questions;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getQuestions() {
        return questions;
    }

    public void setQuestions(Object questions) {
        this.questions = questions;
    }
}