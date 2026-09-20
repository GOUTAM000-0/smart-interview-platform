import { useState } from "react";
import {  useNavigate } from "react-router-dom";

import AuthBackground from "../components/AuthBackground";
import AlertMessage from "../components/AlertMessage";
import RoleSelectionModal from "../components/RoleSelectionModal";

import authService from "../services/authService";
import useAuth from "../hooks/useAuth";

function Login() {

    const navigate = useNavigate();
    const { login } = useAuth();

    // Register Modal
    const [showRoleModal, setShowRoleModal] = useState(false);

    // Forgot Password Modal
    const [showForgotModal, setShowForgotModal] = useState(false);

    const [loading, setLoading] = useState(false);

    const [loginRole, setLoginRole] = useState("CANDIDATE");

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [alert, setAlert] = useState({
        show: false,
        variant: "",
        message: ""
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const response = await authService.login(
                loginRole,
                formData
            );

            login(
                response.token,
                {
                    email: formData.email,
                    role: response.role
                }
            );

            setAlert({
                show: true,
                variant: "success",
                message: response.message
            });

            setTimeout(() => {

                switch (response.role) {

                    case "ROLE_CANDIDATE":
                        navigate("/candidate/dashboard");
                        break;

                    case "ROLE_INTERVIEWER":
                        navigate("/interviewer/dashboard");
                        break;

                    default:
                        navigate("/unauthorized");

                }

            }, 1000);

        } catch (error) {

            setAlert({
                show: true,
                variant: "danger",
                message:
                    error.response?.data?.message ||
                    "Unable to connect to Spring Boot Server."
            });

        } finally {

            setLoading(false);

        }

    };

    return (

        <>

            {/* Decorative left side */}

            <div className="hero-panel">

                <div className="hero-content">

                    <span className="hero-eyebrow">
                        One Platform, Two Roles
                    </span>

                    <h1 className="hero-title">
                        Welcome to our{" "}
                        <span className="accent">
                            Smart Interview Platform
                        </span>
                    </h1>

                    <p className="hero-subtitle">
                        Built for candidates and interviewers alike —
                        connect, interview, and track progress from one
                        secure account.
                    </p>

                    <ul className="hero-features">

                        <li>
                            <span className="feature-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M15 10L20 7V17L15 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                    <rect x="3" y="6" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                                </svg>
                            </span>
                            Live, secure video interviews
                        </li>

                        <li>
                            <span className="feature-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.7"/>
                                    <circle cx="17" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.7"/>
                                    <path d="M3 19c0-3 2.5-5 5-5s5 2 5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                                    <path d="M13.5 14.2c2 .2 3.7 1.9 3.7 4.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                                </svg>
                            </span>
                            One account for candidates &amp; interviewers
                        </li>

                        <li>
                            <span className="feature-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M4 19V13M10 19V8M16 19V11M22 19V5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                                </svg>
                            </span>
                            Structured feedback &amp; progress tracking
                        </li>

                    </ul>

                </div>

                <div className="hero-graphic">

                    <svg viewBox="0 0 520 420" fill="none" xmlns="http://www.w3.org/2000/svg">

                        <circle cx="260" cy="210" r="190" stroke="rgba(255,255,255,0.14)" strokeWidth="1"/>
                        <circle cx="260" cy="210" r="140" stroke="rgba(255,255,255,0.16)" strokeWidth="1" strokeDasharray="4 6"/>
                        <circle cx="260" cy="210" r="90" stroke="rgba(255,255,255,0.20)" strokeWidth="1"/>

                        <line x1="150" y1="190" x2="360" y2="230" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>

                        <circle cx="150" cy="190" r="26" fill="rgba(255,255,255,0.06)" stroke="#ffffff" strokeWidth="1.5"/>
                        <circle cx="360" cy="230" r="26" fill="rgba(255,255,255,0.06)" stroke="#ffffff" strokeWidth="1.5"/>

                        <circle cx="150" cy="190" r="6" fill="#ffffff"/>
                        <circle cx="360" cy="230" r="6" fill="#ffffff"/>

                        <circle cx="270" cy="120" r="4" fill="rgba(255,255,255,.7)"/>
                        <circle cx="320" cy="330" r="4" fill="rgba(255,255,255,.7)"/>
                        <circle cx="120" cy="290" r="4" fill="rgba(255,255,255,.7)"/>

                    </svg>

                </div>

            </div>

            <AuthBackground title="LOGIN">

                <AlertMessage
                    show={alert.show}
                    variant={alert.variant}
                    message={alert.message}
                    onClose={() =>
                        setAlert({
                            ...alert,
                            show: false
                        })
                    }
                />

                <p className="form-subtitle">
                    Sign in to continue to your dashboard
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="mb-1">

                        <span className="role-toggle-label">
                            Login As
                        </span>

                        <div className="role-toggle">

                            <div className="form-check">

                                <input
                                    className="form-check-input"
                                    type="radio"
                                    id="roleCandidate"
                                    value="CANDIDATE"
                                    checked={loginRole === "CANDIDATE"}
                                    onChange={(e) =>
                                        setLoginRole(e.target.value)
                                    }
                                />

                                <label
                                    className="form-check-label"
                                    htmlFor="roleCandidate"
                                >
                                    Candidate
                                </label>

                            </div>

                            <div className="form-check">

                                <input
                                    className="form-check-input"
                                    type="radio"
                                    id="roleInterviewer"
                                    value="INTERVIEWER"
                                    checked={loginRole === "INTERVIEWER"}
                                    onChange={(e) =>
                                        setLoginRole(e.target.value)
                                    }
                                />

                                <label
                                    className="form-check-label"
                                    htmlFor="roleInterviewer"
                                >
                                    Interviewer
                                </label>

                            </div>

                        </div>

                    </div>

                    <div className="input-box">

                        <span className="input-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M3 6L11.15 12.1C11.65 12.47 12.35 12.47 12.85 12.1L21 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/>
                            </svg>
                        </span>

                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="input-box">

                        <span className="input-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6"/>
                                <path d="M8 10V7A4 4 0 0 1 16 7V10" stroke="currentColor" strokeWidth="1.6"/>
                            </svg>
                        </span>

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="options-row">

                        <div className="form-check">

                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="rememberMe"
                            />

                            <label
                                className="form-check-label"
                                htmlFor="rememberMe"
                            >
                            Remember Me
                            </label>

                        </div>

                        <button
                            type="button"
                            className="btn btn-link p-0 text-decoration-none"
                            onClick={() =>
                                setShowForgotModal(true)
                            }
                        >
                            Forgot Password?
                        </button>

                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={loading}
                    >

                        {loading
                            ? "LOGGING IN..."
                            : "LOGIN"}

                    </button>

                    <div className="text-center mt-4">

                        <span>

                            New User?

                        </span>

                        <button
                            type="button"
                            className="btn btn-link text-decoration-none"
                            onClick={() =>
                                setShowRoleModal(true)
                            }
                        >

                            Register

                        </button>

                    </div>

                </form>

            </AuthBackground>

            {/* Register Modal */}

            <RoleSelectionModal
                show={showRoleModal}
                title="Register As"
                candidateText="Candidate"
                interviewerText="Interviewer"
                onClose={() =>
                    setShowRoleModal(false)
                }
                onSelectRole={(role) => {

                    setShowRoleModal(false);

                    if (role === "CANDIDATE") {

                        navigate("/register");

                    } else {

                        navigate("/interviewer/register");

                    }

                }}
            />

            {/* Forgot Password Modal */}

            <RoleSelectionModal
                show={showForgotModal}
                title="Forgot Password"
                candidateText="Candidate"
                interviewerText="Interviewer"
                onClose={() =>
                    setShowForgotModal(false)
                }
                onSelectRole={(role) => {

                    setShowForgotModal(false);

                    if (role === "CANDIDATE") {

                        navigate("/forgot-password");

                    } else {

                        navigate("/interviewer/forgot-password");

                    }

                }}
            />

        </>

    );

}

export default Login;