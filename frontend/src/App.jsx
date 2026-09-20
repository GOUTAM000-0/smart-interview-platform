import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

// Login
import Login from "./pages/Login";

// Candidate Authentication
import Register from "./pages/Register";
import VerifyRegistration from "./pages/VerifyRegistration";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";

// Interviewer Authentication
import InterviewerRegister from "./pages/InterviewerRegister";
import InterviewerVerifyRegistration from "./pages/InterviewerVerifyRegistration";
import InterviewerForgotPassword from "./pages/InterviewerForgotPassword";
import InterviewerVerifyOtp from "./pages/InterviewerVerifyOtp";
import InterviewerResetPassword from "./pages/InterviewerResetPassword";

// Candidate
import CandidateDashboard from "./pages/CandidateDashboard";
import CandidateInterviewRoom from "./pages/CandidateInterviewRoom";

// Interviewer
import InterviewerDashboard from "./pages/InterviewerDashboard";
import ConductInterview from "./pages/ConductInterview";
import InterviewerInterviewRoom from "./pages/InterviewerInterviewRoom";
import AIQuestionGenerator from "./pages/AIQuestionGenerator";

// Common
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

function App() {

    return (

        <Routes>

            {/* Default */}

            <Route
                path="/"
                element={<Navigate to="/login" replace />}
            />

            {/* Login */}

            <Route
                path="/login"
                element={<Login />}
            />

            {/* ================= Candidate Authentication ================= */}

            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/verify-registration"
                element={<VerifyRegistration />}
            />

            <Route
                path="/forgot-password"
                element={<ForgotPassword />}
            />

            <Route
                path="/verify-otp"
                element={<VerifyOtp />}
            />

            <Route
                path="/reset-password"
                element={<ResetPassword />}
            />

            {/* ================= Interviewer Authentication ================= */}

            <Route
                path="/interviewer/register"
                element={<InterviewerRegister />}
            />

            <Route
                path="/interviewer/verify-registration"
                element={<InterviewerVerifyRegistration />}
            />

            <Route
                path="/interviewer/forgot-password"
                element={<InterviewerForgotPassword />}
            />

            <Route
                path="/interviewer/verify-otp"
                element={<InterviewerVerifyOtp />}
            />

            <Route
                path="/interviewer/reset-password"
                element={<InterviewerResetPassword />}
            />

            {/* ================= Candidate ================= */}

            <Route
                path="/candidate/dashboard"
                element={
                    <ProtectedRoute
                        allowedRoles={["ROLE_CANDIDATE"]}
                    >
                        <CandidateDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/candidate/interview"
                element={
                    <ProtectedRoute
                        allowedRoles={["ROLE_CANDIDATE"]}
                    >
                        <CandidateInterviewRoom />
                    </ProtectedRoute>
                }
            />

            {/* ================= Interviewer ================= */}

            <Route
                path="/interviewer/dashboard"
                element={
                    <ProtectedRoute
                        allowedRoles={["ROLE_INTERVIEWER"]}
                    >
                        <InterviewerDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/interviewer/conduct"
                element={
                    <ProtectedRoute
                        allowedRoles={["ROLE_INTERVIEWER"]}
                    >
                        <ConductInterview />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/interviewer/interview"
                element={
                    <ProtectedRoute
                        allowedRoles={["ROLE_INTERVIEWER"]}
                    >
                        <InterviewerInterviewRoom />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/interviewer/ai"
                element={
                    <ProtectedRoute
                        allowedRoles={["ROLE_INTERVIEWER"]}
                    >
                        <AIQuestionGenerator />
                    </ProtectedRoute>
                }
            />

            {/* ================= Common ================= */}

            <Route
                path="/unauthorized"
                element={<Unauthorized />}
            />

            <Route
                path="*"
                element={<NotFound />}
            />

        </Routes>

    );

}

export default App;