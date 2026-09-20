# Smart Interview System

> AI-powered platform for conducting structured technical interviews with real-time communication between candidates and interviewers.

The **Smart Interview System** is a full-stack web application designed to simplify and modernize the technical interview process.

The platform provides dedicated experiences for **Candidates** and **Interviewers**, combining secure authentication, AI-powered question generation, real-time communication, and online interview rooms into a single application.

---

## Overview

Smart Interview System provides a centralized platform for conducting technical interviews without relying on multiple disconnected tools.

### Key Features

- Candidate and Interviewer registration
- OTP-based account verification
- JWT-based authentication
- Role-based access control
- Candidate dashboard
- Interviewer dashboard
- Interview invitations
- AI-powered technical question generation
- Resume-based question generation
- Real-time interview communication
- WebSocket/STOMP integration
- WebRTC-based video communication
- Online interview rooms
- Password recovery and reset
- Secure REST API integration

---

## System Architecture

```text
                         Smart Interview System
                                  │
                 ┌────────────────┴────────────────┐
                 │                                 │
              Frontend                          Backend
                 │                                 │
           React + Vite                       Spring Boot
                 │                                 │
                 │                    ┌────────────┴────────────┐
                 │                    │                         │
                 │                  MySQL                    Groq AI
                 │
                 └──────────── REST API / WebSocket ────────────┘
                                  │
                           Interview Session
```
SmartInterviewSystem/
│
├── backend/
│   ├── src/
│   ├── pom.xml
│   ├── Dockerfile
│   └── README.md
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
│
├── .gitignore
└── README.md
