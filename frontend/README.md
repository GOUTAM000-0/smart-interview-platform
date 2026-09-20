# Smart Interview System — Frontend

The frontend application for the **Smart Interview System**, an AI-powered platform for conducting structured technical interviews between candidates and interviewers.

Built with **React and Vite**, the frontend provides authentication, dashboards, interview rooms, AI question generation, real-time communication, and role-based user experiences.

---

## Features

### Authentication

- Candidate registration
- Interviewer registration
- Login
- OTP verification
- Forgot password
- Password reset
- Protected routes
- Role-based access

### Candidate

- Candidate dashboard
- Interview invitations
- Interview acceptance
- Online interview room
- Real-time interview interaction

### Interviewer

- Interviewer dashboard
- Start interviews
- Conduct interviews
- Candidate management
- AI-powered question generation
- Online interview room

### Real-Time Features

- WebSocket / STOMP communication
- Real-time interview updates
- WebRTC communication
- Interview room synchronization

---

# Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend framework |
| Vite | Development and build tool |
| JavaScript | Programming language |
| React Router | Application routing |
| Axios | REST API communication |
| WebSocket / STOMP | Real-time communication |
| WebRTC | Video/audio communication |
| CSS3 | Styling |
| ESLint | Code quality |

---

# Frontend Architecture

```text
                    Smart Interview System
                             │
              ┌──────────────┴──────────────┐
              │                             │
          Candidate                     Interviewer
              │                             │
              ▼                             ▼
          Login/Register               Login/Register
              │                             │
              ▼                             ▼
          Dashboard                    Dashboard
              │                             │
              │                       Create Interview
              │                             │
              └──────────────┬──────────────┘
                             │
                      Interview Room
                             │
                    ┌────────┴────────┐
                    │                 │
                WebSocket           WebRTC
                    │                 │
                    └────────┬────────┘
                             │
                      Live Interview
```
```text
frontend/
│
├── public/
│
├── src/
│   │
│   ├── assets/
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
│   │   ├── InterviewerDashboard.jsx
│   │   ├── InterviewerInterviewRoom.jsx
│   │   ├── InterviewerRegister.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── ...
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
```

### Authentication
Authentication state is managed using React Context.

```text
                    AuthContext
                         │
          ┌──────────────┼──────────────┐
          │              │              │
        Login          Logout        User State
          │                             │
          └──────────────┬──────────────┘
                         │
                  Protected Routes
```

### AI Question Generator
```text
Interviewer
     │
     ▼
AI Question Generator
     │
     ▼
Frontend Service
     │
     ▼
Spring Boot Backend
     │
     ▼
Groq AI
     │
     ▼
Generated Questions
```
