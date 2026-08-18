package com.example.loginsystem.model;

public class SignalMessage {

    private String type;

    private String sessionId;

    private String sender;

    private String receiver;

    private String data;

    public SignalMessage() {
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }


    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }


    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }


    public String getReceiver() {
        return receiver;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }


    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }
}