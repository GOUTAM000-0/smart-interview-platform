import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import useAuth from "../hooks/useAuth";
import webrtcService from "../services/webrtcService";

// Scoped styles, kept in this file so the component is self-contained.
// Namespaced under .id-page and built on the same design tokens as
// ConductInterview / CandidateDashboard, so all three screens read as
// one product rather than three different prototypes.
const styles = `
.id-page {
    --id-bg: #f3f5f6;
    --id-surface: #ffffff;
    --id-ink: #17222c;
    --id-ink-soft: #3d4c58;
    --id-muted: #6b7a86;
    --id-border: #e2e7ea;
    --id-primary: #1f5f52;
    --id-primary-dark: #143f37;
    --id-primary-tint: #e8f1ee;
    --id-success: #2f7d5c;
    --id-success-tint: #eaf6f0;
    --id-danger: #c0392b;
    --id-danger-tint: #fbeae8;
    --id-pending: #b45309;
    --id-pending-tint: #fdf3e2;
    --id-info: #2b5f8a;
    --id-info-tint: #e9f1f7;
    --id-focus: rgba(31, 95, 82, 0.28);

    --id-font-display: "Fraunces", Georgia, serif;
    --id-font-body: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
    --id-font-mono: "JetBrains Mono", "SFMono-Regular", Consolas, monospace;

    box-sizing: border-box;
    min-height: 100vh;
    padding: 48px 20px 64px;
    background:
        radial-gradient(circle at 90% 0%, #e9f0ee 0%, transparent 45%),
        var(--id-bg);
    font-family: var(--id-font-body);
    color: var(--id-ink);
}

.id-page *,
.id-page *::before,
.id-page *::after {
    box-sizing: border-box;
}

.id-shell {
    max-width: 980px;
    margin: 0 auto;
}

/* ---------- Header ---------- */

.id-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
    margin-bottom: 36px;
}

.id-eyebrow {
    display: inline-block;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--id-primary);
    margin-bottom: 8px;
}

.id-welcome {
    font-family: var(--id-font-display);
    font-weight: 600;
    font-size: 27px;
    line-height: 1.2;
    margin: 0 0 6px;
    color: var(--id-ink);
}

.id-welcome__wave {
    display: inline-block;
    margin-left: 4px;
}

.id-subtitle {
    margin: 0;
    max-width: 52ch;
    font-size: 14px;
    line-height: 1.5;
    color: var(--id-muted);
}

.id-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 18px;
    font-family: var(--id-font-body);
    font-size: 14px;
    font-weight: 600;
    border-radius: 10px;
    border: 1px solid transparent;
    cursor: pointer;
    transition: background 0.15s ease, border-color 0.15s ease, transform 0.05s ease, color 0.15s ease;
    white-space: nowrap;
}

.id-button:active {
    transform: translateY(1px);
}

.id-button--ghost {
    color: var(--id-ink-soft);
    background: var(--id-surface);
    border-color: var(--id-border);
}

.id-button--ghost:hover {
    border-color: #c7d0d5;
    background: #f7f8f9;
}

.id-button--danger-outline {
    color: var(--id-danger);
    background: var(--id-surface);
    border-color: var(--id-border);
}

.id-button--danger-outline:hover {
    background: var(--id-danger-tint);
    border-color: #f0c6c0;
}

/* ---------- Action cards ---------- */

.id-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 36px;
}

.id-action-card {
    background: var(--id-surface);
    border: 1px solid var(--id-border);
    border-radius: 18px;
    padding: 34px 30px;
    text-align: center;
    box-shadow: 0 1px 2px rgba(23, 34, 44, 0.04), 0 18px 40px -26px rgba(20, 63, 55, 0.28);
    transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.id-action-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 1px 2px rgba(23, 34, 44, 0.04), 0 24px 48px -24px rgba(20, 63, 55, 0.32);
}

.id-action-icon {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
}

.id-action-icon--primary {
    background: var(--id-primary-tint);
    color: var(--id-primary);
}

.id-action-icon--success {
    background: var(--id-success-tint);
    color: var(--id-success);
}

.id-action-card h3 {
    font-family: var(--id-font-display);
    font-weight: 600;
    font-size: 19px;
    margin: 0 0 8px;
    color: var(--id-ink);
}

.id-action-card p {
    margin: 0 0 22px;
    font-size: 13.5px;
    line-height: 1.5;
    color: var(--id-muted);
}

.id-button--wide {
    width: 100%;
    padding: 12px 18px;
}

.id-button--primary {
    color: #ffffff;
    background: var(--id-primary);
}

.id-button--primary:hover {
    background: var(--id-primary-dark);
}

.id-button--success {
    color: #ffffff;
    background: var(--id-success);
}

.id-button--success:hover {
    background: #245f45;
}

/* ---------- Panel ---------- */

.id-panel {
    background: var(--id-surface);
    border: 1px solid var(--id-border);
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 1px 2px rgba(23, 34, 44, 0.04), 0 18px 40px -26px rgba(20, 63, 55, 0.22);
}

.id-panel__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 22px 28px;
    background: linear-gradient(160deg, var(--id-primary-dark) 0%, var(--id-primary) 100%);
    color: #ffffff;
}

.id-panel__title {
    font-family: var(--id-font-display);
    font-weight: 600;
    font-size: 17px;
    margin: 0;
}

.id-panel__stats {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.id-stat-pill {
    font-size: 12px;
    font-weight: 600;
    padding: 5px 12px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.14);
    color: #ffffff;
    white-space: nowrap;
}

.id-panel__body {
    padding: 8px 8px 4px;
}

/* ---------- Table ---------- */

.id-table-wrap {
    overflow-x: auto;
}

.id-table {
    width: 100%;
    border-collapse: collapse;
}

.id-table th {
    text-align: left;
    font-size: 11.5px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--id-muted);
    padding: 16px 20px 10px;
    white-space: nowrap;
}

.id-table th.id-table__action-col {
    text-align: right;
}

.id-table td {
    padding: 14px 20px;
    font-size: 14px;
    border-top: 1px solid var(--id-border);
    vertical-align: middle;
}

.id-table tbody tr:hover {
    background: #fafbfb;
}

.id-table__session {
    font-family: var(--id-font-mono);
    font-size: 12.5px;
    color: var(--id-muted);
}

.id-table__candidate {
    font-weight: 600;
    color: var(--id-ink);
}

.id-table__action {
    display: flex;
    justify-content: flex-end;
}

/* ---------- Status badges ---------- */

.id-badge {
    display: inline-flex;
    align-items: center;
    font-size: 12px;
    font-weight: 600;
    padding: 5px 12px;
    border-radius: 999px;
    white-space: nowrap;
}

.id-badge--pending {
    background: var(--id-pending-tint);
    color: var(--id-pending);
}

.id-badge--accepted {
    background: var(--id-success-tint);
    color: var(--id-success);
}

.id-badge--rejected {
    background: var(--id-danger-tint);
    color: var(--id-danger);
}

.id-badge--completed {
    background: var(--id-info-tint);
    color: var(--id-info);
}

/* ---------- Row action buttons ---------- */

.id-row-btn {
    font-size: 13px;
    font-weight: 600;
    padding: 8px 16px;
    border-radius: 8px;
    border: 1px solid transparent;
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease;
    white-space: nowrap;
}

.id-row-btn--join {
    color: #ffffff;
    background: var(--id-success);
}

.id-row-btn--join:hover {
    background: #245f45;
}

.id-row-btn--disabled {
    color: var(--id-muted);
    background: #f1f2f4;
    cursor: not-allowed;
}

/* ---------- Empty state ---------- */

.id-empty {
    text-align: center;
    padding: 56px 20px;
    color: var(--id-muted);
}

.id-empty svg {
    color: #c3ccd1;
    margin-bottom: 12px;
}

.id-empty p {
    margin: 0;
    font-size: 14px;
}

/* ---------- Responsive ---------- */

@media (max-width: 760px) {
    .id-actions {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 560px) {
    .id-header {
        flex-direction: column;
        align-items: stretch;
    }

    .id-header__actions {
        display: flex;
        justify-content: flex-end;
    }

    .id-panel__header {
        flex-direction: column;
        align-items: flex-start;
    }
}

/* ---------- Accessibility ---------- */

.id-button:focus-visible,
.id-row-btn:focus-visible {
    outline: 2px solid var(--id-primary);
    outline-offset: 2px;
}
`;

function InterviewerDashboard() {

    const navigate = useNavigate();

    const { user, logout } = useAuth();

    const [interviews, setInterviews] = useState([]);

    const [interviewerData, setInterviewerData] = useState(null);

    useEffect(() => {

        if (!user?.email) {
            return;
        }

        let isMounted = true;

        const token = localStorage.getItem("token");

        // Load the interviewer's profile so we can greet them by name
        // instead of their email address.
        const loadInterviewerData = async () => {

            try {

                const response = await api.get("/interviewer/home");

                if (isMounted) {
                    setInterviewerData(response.data);
                }

            } catch (error) {

                console.error("Failed to load interviewer details:", error);

            }

        };

        const loadInitial = async () => {

            try {

                // "/interviewer/interviews" = sessions YOU conducted
                // "/interviewer/invitations" = sessions you were invited to
                //                               as interviewer2/3/4
                // A conductor's own sessions never show up in the second
                // call, which is why "Start Interview" left conductors
                // with nothing to join — merge both lists.
                const [mine, invited] = await Promise.all([
                    api.get("/interviewer/interviews"),
                    api.get("/interviewer/invitations")
                ]);

                const merged = [...mine.data, ...invited.data].reduce(
                    (acc, item) => {
                        acc[item.sessionId] = item;
                        return acc;
                    },
                    {}
                );

                if (isMounted) {
                    setInterviews(Object.values(merged));
                }

            } catch (error) {

                console.error(error);

            }

        };

        loadInterviewerData();
        loadInitial();

        // Real-time updates instead of setInterval polling
        webrtcService.on("onInvitationUpdate", (updatedInterviews) => {
            if (isMounted) {
                setInterviews(updatedInterviews);
            }
        });

        webrtcService.connect(token, user.email);

        return () => {

            isMounted = false;

            webrtcService.disconnect();

        };

    }, [user?.email]);

    const handleLogout = () => {

        logout();

        navigate("/login");

    };

    const joinInterview = (sessionId) => {

        navigate("/interviewer/interview", {

            state: {

                sessionId

            }

        });

    };

    const statusBadge = (status) => {

        const map = {
            PENDING: { className: "id-badge--pending", label: "Pending" },
            ACCEPTED: { className: "id-badge--accepted", label: "Accepted" },
            REJECTED: { className: "id-badge--rejected", label: "Declined" },
            COMPLETED: { className: "id-badge--completed", label: "Completed" }
        };

        const config = map[status] || { className: "id-badge--pending", label: status };

        return (
            <span className={`id-badge ${config.className}`}>
                {config.label}
            </span>
        );

    };

    const rowAction = (item) => {

        if (item.status === "ACCEPTED") {
            return (
                <button
                    type="button"
                    className="id-row-btn id-row-btn--join"
                    onClick={() => joinInterview(item.sessionId)}
                >
                    Join interview
                </button>
            );
        }

        if (item.status === "COMPLETED") {
            return (
                <button type="button" className="id-row-btn id-row-btn--disabled" disabled>
                    Interview completed
                </button>
            );
        }

        if (item.status === "REJECTED") {
            return (
                <button type="button" className="id-row-btn id-row-btn--disabled" disabled>
                    Candidate declined
                </button>
            );
        }

        return (
            <button type="button" className="id-row-btn id-row-btn--disabled" disabled>
                Waiting for candidate…
            </button>
        );

    };

    const pendingCount = interviews.filter((i) => i.status === "PENDING").length;
    const acceptedCount = interviews.filter((i) => i.status === "ACCEPTED").length;

    return (

        <div className="id-page">

            <style>{styles}</style>

            <div className="id-shell">

                <div className="id-header">

                    <div>

                        <span className="id-eyebrow">Interviewer console</span>

                        <h1 className="id-welcome">
                            Welcome, {interviewerData?.name || user?.email}
                            <span className="id-welcome__wave" aria-hidden="true">👋</span>
                        </h1>

                        <p className="id-subtitle">
                            Manage the interviews you run and the ones you've been invited to.
                        </p>

                    </div>

                    <div className="id-header__actions">

                        <button
                            type="button"
                            className="id-button id-button--danger-outline"
                            onClick={handleLogout}
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path
                                    d="M15 17.5V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v1.5"
                                    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
                                />
                                <path
                                    d="M9 12h12m0 0-3.5-3.5M21 12l-3.5 3.5"
                                    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
                                />
                            </svg>
                            Logout
                        </button>

                    </div>

                </div>

                <div className="id-actions">

                    <div className="id-action-card">

                        <div className="id-action-icon id-action-icon--primary">
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <rect x="2.5" y="5.5" width="14" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
                                <path d="M16.5 10.2 21 7.5v9l-4.5-2.7" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                            </svg>
                        </div>

                        <h3>Conduct interview</h3>

                        <p>Create an interview session and invite a candidate.</p>

                        <button
                            type="button"
                            className="id-button id-button--wide id-button--primary"
                            onClick={() => navigate("/interviewer/conduct")}
                        >
                            Start interview
                        </button>

                    </div>

                    <div className="id-action-card">

                        <div className="id-action-icon id-action-icon--success">
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <rect x="4" y="8" width="16" height="12" rx="3" stroke="currentColor" strokeWidth="1.6" />
                                <circle cx="9" cy="14" r="1.4" fill="currentColor" />
                                <circle cx="15" cy="14" r="1.4" fill="currentColor" />
                                <path d="M12 8V4.5m0 0h-2m2 0h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                                <circle cx="12" cy="4" r="1" fill="currentColor" />
                            </svg>
                        </div>

                        <h3>AI question generator</h3>

                        <p>Generate interview questions using AI.</p>

                        <button
                            type="button"
                            className="id-button id-button--wide id-button--success"
                            onClick={() => navigate("/interviewer/ai")}
                        >
                            Open AI
                        </button>

                    </div>

                </div>

                <div className="id-panel">

                    <div className="id-panel__header">

                        <h2 className="id-panel__title">Interview invitations</h2>

                        <div className="id-panel__stats">

                            <span className="id-stat-pill">{pendingCount} pending</span>

                            <span className="id-stat-pill">{acceptedCount} accepted</span>

                        </div>

                    </div>

                    <div className="id-panel__body">

                        {interviews.length === 0 ? (

                            <div className="id-empty">

                                <svg width="42" height="42" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <path
                                        d="M4 8.5 12 3l8 5.5M4 8.5V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.5M4 8.5l6.5 5a2.3 2.3 0 0 0 3 0l6.5-5"
                                        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
                                    />
                                </svg>

                                <p>No interview sessions found.</p>

                            </div>

                        ) : (

                            <div className="id-table-wrap">

                                <table className="id-table">

                                    <thead>
                                        <tr>
                                            <th>Session</th>
                                            <th>Candidate</th>
                                            <th>Status</th>
                                            <th className="id-table__action-col">Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {interviews.map((item) => (

                                            <tr key={item.sessionId}>

                                                <td className="id-table__session">{item.sessionId}</td>

                                                <td className="id-table__candidate">{item.candidateEmail}</td>

                                                <td>{statusBadge(item.status)}</td>

                                                <td>
                                                    <div className="id-table__action">
                                                        {rowAction(item)}
                                                    </div>
                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </div>

    );

}

export default InterviewerDashboard;