# Smart Interview System — Frontend

A modern React-based frontend for the **Smart Interview System**, an AI-powered technical interview platform designed to support structured interviews between candidates and interviewers.

The frontend provides dedicated experiences for **Candidates** and **Interviewers**, including authentication, interview management, AI-powered question generation, real-time interview communication, and protected role-based dashboards.

---

## Overview

The Smart Interview System frontend communicates with a Spring Boot backend through REST APIs and real-time WebSocket connections.

It provides:

- Candidate authentication and registration
- Interviewer authentication and registration
- OTP-based verification flows
- Role-based access control
- Candidate dashboard
- Interviewer dashboard
- AI-powered interview question generation
- Technical interview rooms
- Real-time interview communication
- WebRTC-based interview communication
- WebSocket/STOMP integration
- Protected routes
- Password reset and recovery flows
- Responsive user interface

---

## Technology Stack

| Category | Technology |
|---|---|
| Framework | React |
| Build Tool | Vite |
| Language | JavaScript (ES6+) |
| Routing | React Router |
| HTTP Client | Axios |
| Real-Time Communication | WebSocket / STOMP |
| Video Communication | WebRTC |
| Authentication | JWT |
| Styling | CSS3 |
| Code Quality | ESLint |
| Backend Integration | Spring Boot REST API |

---

## Frontend Architecture

frontend/
│
├── public/
│   ├── _redirects
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   │
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   │
│   ├── components/
│   │   ├── AlertMessage.jsx
│   │   ├── AuthBackground.jsx
│   │   ├── AuthLayout.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Navbar.jsx
│   │   ├── NotificationBell.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── RoleSelectionModal.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── hooks/
│   │   └── useAuth.js
│   │
│   ├── pages/
│   │   ├── AIQuestionGenerator.jsx
│   │   ├── CandidateDashboard.jsx
│   │   ├── CandidateInterviewRoom.jsx
│   │   ├── ConductInterview.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── InterviewerDashboard.jsx
│   │   ├── InterviewerForgotPassword.jsx
│   │   ├── InterviewerInterviewRoom.jsx
│   │   ├── InterviewerRegister.jsx
│   │   ├── InterviewerResetPassword.jsx
│   │   ├── InterviewerVerifyOtp.jsx
│   │   ├── InterviewerVerifyRegistration.jsx
│   │   ├── Login.jsx
│   │   ├── NotFound.jsx
│   │   ├── Register.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── Unauthorized.jsx
│   │   ├── VerifyOtp.jsx
│   │   └── VerifyRegistration.jsx
│   │
│   ├── services/
│   │   ├── aiService.js
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── interviewService.js
│   │   ├── webrtcService.js
│   │   └── websocketService.js
│   │
│   ├── utils/
│   │   └── auth.js
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── eslint.config.js

                 Smart Interview System
                         │
                ┌────────┴────────┐
                │                 │
            Candidate         Interviewer
                │                 │
          Candidate UI      Interviewer UI
