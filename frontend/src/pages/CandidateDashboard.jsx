import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import useAuth from "../hooks/useAuth";
import webrtcService from "../services/webrtcService";

// Scoped styles, kept in this file so the component is self-contained.
// Namespaced under .cd-page so nothing leaks into the rest of the app.
// Uses the same design tokens as ConductInterview for a consistent
// look across the interviewer and candidate experiences.
const styles = `
.cd-page {
    --cd-bg: #f3f5f6;
    --cd-surface: #ffffff;
    --cd-ink: #17222c;
    --cd-ink-soft: #3d4c58;
    --cd-muted: #6b7a86;
    --cd-border: #e2e7ea;
    --cd-primary: #1f5f52;
    --cd-primary-dark: #143f37;
    --cd-primary-tint: #e8f1ee;
    --cd-success: #2f7d5c;
    --cd-success-bg: #eaf6f0;
    --cd-danger: #c0392b;
    --cd-danger-dark: #9c2f22;
    --cd-danger-tint: #fbeae8;
    --cd-focus: rgba(31, 95, 82, 0.28);

    --cd-font-display: "Fraunces", Georgia, serif;
    --cd-font-body: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
    --cd-font-mono: "JetBrains Mono", "SFMono-Regular", Consolas, monospace;

    box-sizing: border-box;
    min-height: 100vh;
    padding: 48px 20px 60px;
    background:
        radial-gradient(circle at 88% 0%, #e9f0ee 0%, transparent 45%),
        var(--cd-bg);
    font-family: var(--cd-font-body);
    color: var(--cd-ink);
}

.cd-page *,
.cd-page *::before,
.cd-page *::after {
    box-sizing: border-box;
}

.cd-shell {
    max-width: 760px;
    margin: 0 auto;
}

/* ---------- Header ---------- */

.cd-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
    margin-bottom: 32px;
}

.cd-eyebrow {
    display: inline-block;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--cd-primary);
    margin-bottom: 8px;
}

.cd-welcome {
    font-family: var(--cd-font-display);
    font-weight: 600;
    font-size: 27px;
    line-height: 1.2;
    margin: 0 0 6px;
    color: var(--cd-ink);
}

.cd-welcome__wave {
    display: inline-block;
    margin-left: 4px;
}

.cd-subtitle {
    margin: 0;
    font-size: 14px;
    color: var(--cd-muted);
}

.cd-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 18px;
    font-family: var(--cd-font-body);
    font-size: 14px;
    font-weight: 600;
    border-radius: 10px;
    border: 1px solid transparent;
    cursor: pointer;
    transition: background 0.15s ease, border-color 0.15s ease, transform 0.05s ease, color 0.15s ease;
    white-space: nowrap;
}

.cd-button:active {
    transform: translateY(1px);
}

.cd-button--ghost {
    color: var(--cd-ink-soft);
    background: var(--cd-surface);
    border-color: var(--cd-border);
}

.cd-button--ghost:hover {
    border-color: #c7d0d5;
    background: #f7f8f9;
}

.cd-button--danger {
    color: var(--cd-danger);
    background: var(--cd-danger-tint);
    border-color: transparent;
}

.cd-button--danger:hover {
    background: var(--cd-danger);
    color: #ffffff;
}

.cd-button--success {
    color: #ffffff;
    background: var(--cd-success);
}

.cd-button--success:hover {
    background: #245f45;
}

/* ---------- Waiting card ---------- */

.cd-card {
    background: var(--cd-surface);
    border: 1px solid var(--cd-border);
    border-radius: 18px;
    box-shadow: 0 1px 2px rgba(23, 34, 44, 0.04), 0 18px 40px -22px rgba(20, 63, 55, 0.25);
    padding: 56px 40px;
    text-align: center;
}

.cd-icon-ring {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 92px;
    height: 92px;
    border-radius: 50%;
    background: var(--cd-primary-tint);
    margin-bottom: 24px;
}

.cd-icon-ring svg {
    color: var(--cd-primary);
}

.cd-card__title {
    font-family: var(--cd-font-display);
    font-weight: 600;
    font-size: 21px;
    margin: 0 0 10px;
    color: var(--cd-ink);
}

.cd-card__text {
    max-width: 40ch;
    margin: 0 auto;
    font-size: 14.5px;
    line-height: 1.6;
    color: var(--cd-muted);
}

.cd-status {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    margin-top: 26px;
    padding: 8px 16px;
    border-radius: 999px;
    background: var(--cd-primary-tint);
    color: var(--cd-primary-dark);
    font-size: 13px;
    font-weight: 600;
}

.cd-status__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--cd-primary);
    box-shadow: 0 0 0 0 rgba(31, 95, 82, 0.5);
    animation: cd-pulse 1.8s ease-out infinite;
}

@keyframes cd-pulse {
    0% { box-shadow: 0 0 0 0 rgba(31, 95, 82, 0.45); }
    70% { box-shadow: 0 0 0 9px rgba(31, 95, 82, 0); }
    100% { box-shadow: 0 0 0 0 rgba(31, 95, 82, 0); }
}

.cd-spinner {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    border: 2px solid rgba(31, 95, 82, 0.25);
    border-top-color: var(--cd-primary);
    animation: cd-spin 0.7s linear infinite;
}

@keyframes cd-spin {
    to { transform: rotate(360deg); }
}

/* ---------- Invitation modal ---------- */

.cd-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 29, 0.55);
    backdrop-filter: blur(2px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 1000;
}

.cd-modal {
    width: 100%;
    max-width: 460px;
    background: var(--cd-surface);
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.35);
    animation: cd-modal-in 0.18s ease-out;
}

@keyframes cd-modal-in {
    from { opacity: 0; transform: translateY(8px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}

.cd-modal__header {
    padding: 26px 28px 22px;
    background: linear-gradient(160deg, var(--cd-primary-dark) 0%, var(--cd-primary) 100%);
    color: #ffffff;
}

.cd-modal__eyebrow {
    display: block;
    font-size: 11.5px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #b7d6cb;
    margin-bottom: 8px;
}

.cd-modal__title {
    font-family: var(--cd-font-display);
    font-weight: 600;
    font-size: 21px;
    margin: 0;
}

.cd-modal__body {
    padding: 22px 28px 6px;
}

.cd-detail-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.cd-detail {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--cd-border);
}

.cd-detail:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.cd-detail__label {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.03em;
    color: var(--cd-muted);
    white-space: nowrap;
}

.cd-detail__value {
    font-size: 14px;
    font-weight: 500;
    color: var(--cd-ink);
    text-align: right;
    word-break: break-word;
}

.cd-detail__value--mono {
    font-family: var(--cd-font-mono);
    font-size: 13px;
}

.cd-modal__footer {
    display: flex;
    gap: 12px;
    padding: 24px 28px 28px;
}

.cd-modal__footer .cd-button {
    flex: 1;
    padding: 12px 18px;
}

/* ---------- Responsive ---------- */

@media (max-width: 560px) {
    .cd-header {
        flex-direction: column;
        align-items: stretch;
    }

    .cd-header__actions {
        display: flex;
        justify-content: flex-end;
    }

    .cd-card {
        padding: 40px 24px;
    }

    .cd-modal__footer {
        flex-direction: column-reverse;
    }
}

/* ---------- Accessibility ---------- */

.cd-button:focus-visible {
    outline: 2px solid var(--cd-primary);
    outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
    .cd-status__dot,
    .cd-spinner,
    .cd-modal {
        animation: none;
    }
}
`;

function CandidateDashboard() {

    const navigate = useNavigate();

    const { user, logout } = useAuth();

    const [interviewRequest, setInterviewRequest] = useState(null);

    const [candidateData, setCandidateData] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (!user?.email) {
            return;
        }

        let isMounted = true;

        const token = localStorage.getItem("token");

        // Load the candidate's profile so we can greet them by name
        // instead of their email address.
        const loadCandidateData = async () => {

            try {

                const response = await api.get("/candidate/home");

                if (isMounted) {
                    setCandidateData(response.data);
                }

            } catch (error) {

                console.error("Failed to load candidate details:", error);

            }

        };

        // Load once on mount so the UI isn't empty while the socket connects
        const loadInitial = async () => {

            try {

                const response = await api.get("/candidate/interviews");

                if (!isMounted) return;

                const pending = response.data.find(
                    interview => interview.status === "PENDING"
                );

                setInterviewRequest(pending || null);

            } catch (error) {

                console.error("Failed to load interview:", error);

            } finally {

                if (isMounted) {
                    setLoading(false);
                }

            }

        };

        loadCandidateData();
        loadInitial();

        // Real-time updates from the server instead of setInterval polling
        webrtcService.on("onInvitation", (invitation) => {
            if (isMounted) {
                setInterviewRequest(invitation);
            }
        });

        webrtcService.connect(token, user?.email);

        return () => {

            isMounted = false;

            webrtcService.disconnect();

        };

    }, [user?.email]);

    const handleLogout = () => {

        logout();

        navigate("/login");

    };

    const acceptInterview = async () => {

        try {

            await api.post(

                `/candidate/accept/${interviewRequest.sessionId}`

            );

            navigate("/candidate/interview", {

                state: {

                    sessionId: interviewRequest.sessionId

                }

            });

        } catch (error) {

            alert(

                error.response?.data?.message ||

                "Unable to accept interview."

            );

        }

    };

    const rejectInterview = async () => {

        try {

            await api.post(

                `/candidate/reject/${interviewRequest.sessionId}`

            );

            setInterviewRequest(null);

        } catch (error) {

            alert(

                error.response?.data?.message ||

                "Unable to reject interview."

            );

        }

    };

    // Additional interviewers are rendered from a small config array so the
    // numbering stays tied to real data rather than being hardcoded markup.
    const additionalInterviewers = interviewRequest
        ? [
            { label: "Interviewer 2", value: interviewRequest.interviewer2 },
            { label: "Interviewer 3", value: interviewRequest.interviewer3 },
            { label: "Interviewer 4", value: interviewRequest.interviewer4 }
        ].filter(interviewer => interviewer.value)
        : [];

    return (

        <div className="cd-page">

            <style>{styles}</style>

            <div className="cd-shell">

                <div className="cd-header">

                    <div>

                        <span className="cd-eyebrow">Candidate dashboard</span>

                        <h1 className="cd-welcome">
                            Welcome, {candidateData?.name || user?.email}
                            <span className="cd-welcome__wave" aria-hidden="true">👋</span>
                        </h1>

                        <p className="cd-subtitle">
                            Waiting for an interview invitation.
                        </p>

                    </div>

                    <div className="cd-header__actions">

                        <button
                            type="button"
                            className="cd-button cd-button--danger"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>

                    </div>

                </div>

                <div className="cd-card">

                    <div className="cd-icon-ring">

                        <svg
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                        >
                            <rect
                                x="2.5" y="5.5" width="14" height="13" rx="2.5"
                                stroke="currentColor" strokeWidth="1.6"
                            />
                            <path
                                d="M16.5 10.2 21 7.5v9l-4.5-2.7"
                                stroke="currentColor" strokeWidth="1.6"
                                strokeLinejoin="round"
                            />
                            <circle cx="9.5" cy="10.5" r="2" stroke="currentColor" strokeWidth="1.6" />
                            <path
                                d="M6 15.5c0-1.66 1.57-3 3.5-3s3.5 1.34 3.5 3"
                                stroke="currentColor" strokeWidth="1.6"
                                strokeLinecap="round"
                            />
                        </svg>

                    </div>

                    <h2 className="cd-card__title">Waiting for interview</h2>

                    <p className="cd-card__text">
                        Keep this page open. As soon as an interviewer sends an
                        invitation, it will appear here automatically.
                    </p>

                    {loading ? (

                        <div className="cd-status">
                            <span className="cd-spinner" aria-hidden="true" />
                            Checking for invitations…
                        </div>

                    ) : (

                        <div className="cd-status">
                            <span className="cd-status__dot" aria-hidden="true" />
                            Listening for invitations
                        </div>

                    )}

                </div>

            </div>

            {interviewRequest && (

                <div className="cd-modal-overlay" role="dialog" aria-modal="true">

                    <div className="cd-modal">

                        <div className="cd-modal__header">

                            <span className="cd-modal__eyebrow">New invitation</span>

                            <h2 className="cd-modal__title">Interview invitation</h2>

                        </div>

                        <div className="cd-modal__body">

                            <div className="cd-detail-list">

                                <div className="cd-detail">
                                    <span className="cd-detail__label">Session ID</span>
                                    <span className="cd-detail__value cd-detail__value--mono">
                                        {interviewRequest.sessionId}
                                    </span>
                                </div>

                                <div className="cd-detail">
                                    <span className="cd-detail__label">Interviewer</span>
                                    <span className="cd-detail__value">
                                        {interviewRequest.conductorEmail}
                                    </span>
                                </div>

                                <div className="cd-detail">
                                    <span className="cd-detail__label">Candidate</span>
                                    <span className="cd-detail__value">
                                        {interviewRequest.candidateEmail}
                                    </span>
                                </div>

                                {additionalInterviewers.map((interviewer) => (

                                    <div className="cd-detail" key={interviewer.label}>
                                        <span className="cd-detail__label">{interviewer.label}</span>
                                        <span className="cd-detail__value">{interviewer.value}</span>
                                    </div>

                                ))}

                            </div>

                        </div>

                        <div className="cd-modal__footer">

                            <button
                                type="button"
                                className="cd-button cd-button--ghost"
                                onClick={rejectInterview}
                            >
                                Reject
                            </button>

                            <button
                                type="button"
                                className="cd-button cd-button--success"
                                onClick={acceptInterview}
                            >
                                Accept
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}

export default CandidateDashboard;