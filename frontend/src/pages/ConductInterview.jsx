import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import AlertMessage from "../components/AlertMessage";
import LoadingSpinner from "../components/LoadingSpinner";

// Scoped styles for this page, kept in the same file so the component is
// self-contained. Everything is namespaced under .ci-page so it can't leak
// into the rest of the app.
const styles = `
.ci-page {
    --ci-bg: #f3f5f6;
    --ci-surface: #ffffff;
    --ci-ink: #17222c;
    --ci-ink-soft: #3d4c58;
    --ci-muted: #6b7a86;
    --ci-border: #e2e7ea;
    --ci-primary: #1f5f52;
    --ci-primary-dark: #143f37;
    --ci-primary-tint: #e8f1ee;
    --ci-success: #2f7d5c;
    --ci-success-bg: #eaf6f0;
    --ci-danger: #c0392b;
    --ci-focus: rgba(31, 95, 82, 0.28);

    --ci-font-display: "Fraunces", Georgia, serif;
    --ci-font-body: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
    --ci-font-mono: "JetBrains Mono", "SFMono-Regular", Consolas, monospace;

    box-sizing: border-box;
    min-height: 100vh;
    padding: 56px 20px;
    background:
        radial-gradient(circle at 12% 0%, #e9f0ee 0%, transparent 45%),
        var(--ci-bg);
    font-family: var(--ci-font-body);
    color: var(--ci-ink);
}

.ci-page *,
.ci-page *::before,
.ci-page *::after {
    box-sizing: border-box;
}

.ci-shell {
    max-width: 620px;
    margin: 0 auto;
}

/* ---------- Card ---------- */

.ci-card {
    background: var(--ci-surface);
    border: 1px solid var(--ci-border);
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 1px 2px rgba(23, 34, 44, 0.04), 0 18px 40px -22px rgba(20, 63, 55, 0.35);
}

.ci-card__header {
    padding: 36px 40px 30px;
    background: linear-gradient(160deg, var(--ci-primary-dark) 0%, var(--ci-primary) 100%);
    color: #f4f8f6;
}

.ci-eyebrow {
    display: inline-block;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: #b7d6cb;
    margin-bottom: 12px;
}

.ci-title {
    font-family: var(--ci-font-display);
    font-weight: 600;
    font-size: 30px;
    line-height: 1.15;
    margin: 0 0 10px;
    color: #ffffff;
}

.ci-subtitle {
    margin: 0;
    max-width: 46ch;
    font-size: 14.5px;
    line-height: 1.55;
    color: #cfe3db;
}

.ci-card__body {
    padding: 32px 40px 36px;
}

/* ---------- Session ticket ---------- */

.ci-ticket {
    position: relative;
    margin-bottom: 28px;
    padding: 20px 22px 18px;
    border: 1px dashed #b7d2c9;
    border-radius: 14px;
    background: var(--ci-success-bg);
}

.ci-ticket__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
}

.ci-ticket__status {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 12.5px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--ci-success);
}

.ci-ticket__pulse {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--ci-success);
    box-shadow: 0 0 0 0 rgba(47, 125, 92, 0.55);
    animation: ci-pulse 1.8s ease-out infinite;
}

@keyframes ci-pulse {
    0% { box-shadow: 0 0 0 0 rgba(47, 125, 92, 0.5); }
    70% { box-shadow: 0 0 0 8px rgba(47, 125, 92, 0); }
    100% { box-shadow: 0 0 0 0 rgba(47, 125, 92, 0); }
}

.ci-ticket__id-block {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.ci-ticket__id-label {
    font-size: 11.5px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ci-muted);
}

.ci-ticket__id {
    font-family: var(--ci-font-mono);
    font-size: 19px;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: var(--ci-ink);
    word-break: break-all;
}

.ci-ticket__divider {
    height: 1px;
    margin: 16px 0 12px;
    background-image: linear-gradient(to right, #b7d2c9 50%, transparent 50%);
    background-size: 10px 1px;
    background-repeat: repeat-x;
}

.ci-ticket__note {
    margin: 0;
    font-size: 13.5px;
    line-height: 1.5;
    color: var(--ci-ink-soft);
}

/* ---------- Form ---------- */

.ci-form {
    display: flex;
    flex-direction: column;
    gap: 26px;
}

.ci-field {
    display: flex;
    flex-direction: column;
    gap: 7px;
}

.ci-field__label {
    font-size: 12.5px;
    font-weight: 600;
    letter-spacing: 0.03em;
    color: var(--ci-ink-soft);
}

.ci-field__label--sr {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
}

.ci-field__input {
    width: 100%;
    padding: 12px 14px;
    font-family: var(--ci-font-body);
    font-size: 14.5px;
    color: var(--ci-ink);
    background: #fbfcfc;
    border: 1px solid var(--ci-border);
    border-radius: 10px;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
}

.ci-field__input::placeholder {
    color: #a5b1ba;
}

.ci-field__input:hover {
    border-color: #c7d0d5;
}

.ci-field__input:focus {
    background: #ffffff;
    border-color: var(--ci-primary);
    box-shadow: 0 0 0 4px var(--ci-focus);
}

/* Additional interviewers */

.ci-section__heading {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 16px;
}

.ci-section__title {
    font-family: var(--ci-font-display);
    font-size: 16.5px;
    font-weight: 600;
    margin: 0;
    color: var(--ci-ink);
}

.ci-badge {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--ci-primary);
    background: var(--ci-primary-tint);
    padding: 3px 9px;
    border-radius: 999px;
}

.ci-interviewer-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.ci-field--inline {
    flex-direction: row;
    align-items: center;
    gap: 12px;
}

.ci-field__grow {
    flex: 1;
    position: relative;
}

.ci-avatar {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--ci-primary-tint);
    color: var(--ci-primary-dark);
    font-family: var(--ci-font-mono);
    font-size: 13px;
    font-weight: 600;
}

/* ---------- Actions ---------- */

.ci-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 6px;
}

.ci-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 22px;
    font-family: var(--ci-font-body);
    font-size: 14.5px;
    font-weight: 600;
    border-radius: 10px;
    border: 1px solid transparent;
    cursor: pointer;
    transition: background 0.15s ease, border-color 0.15s ease, transform 0.05s ease;
}

.ci-button:active {
    transform: translateY(1px);
}

.ci-button--primary {
    color: #ffffff;
    background: var(--ci-primary);
}

.ci-button--primary:hover:not(:disabled) {
    background: var(--ci-primary-dark);
}

.ci-button--primary:disabled {
    background: #8fada4;
    cursor: not-allowed;
}

.ci-button__icon {
    transition: transform 0.15s ease;
}

.ci-button--primary:hover:not(:disabled) .ci-button__icon {
    transform: translateX(2px);
}

.ci-button--ghost {
    color: var(--ci-ink-soft);
    background: transparent;
    border-color: var(--ci-border);
}

.ci-button--ghost:hover {
    border-color: #c7d0d5;
    background: #f7f8f9;
}

.ci-spinner {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.45);
    border-top-color: #ffffff;
    animation: ci-spin 0.7s linear infinite;
}

@keyframes ci-spin {
    to { transform: rotate(360deg); }
}

.ci-footnote {
    margin: 18px 4px 0;
    font-size: 12.5px;
    color: var(--ci-muted);
    text-align: center;
}

/* ---------- Responsive ---------- */

@media (max-width: 560px) {
    .ci-card__header {
        padding: 28px 24px 24px;
    }

    .ci-card__body {
        padding: 26px 24px 30px;
    }

    .ci-title {
        font-size: 25px;
    }

    .ci-actions {
        flex-direction: column-reverse;
        align-items: stretch;
    }

    .ci-button {
        width: 100%;
    }
}

/* ---------- Accessibility ---------- */

.ci-field__input:focus-visible,
.ci-button:focus-visible {
    outline: 2px solid var(--ci-primary);
    outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
    .ci-ticket__pulse,
    .ci-spinner,
    .ci-button__icon {
        animation: none;
        transition: none;
    }
}
`;

function ConductInterview() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [sessionId, setSessionId] = useState("");

    const [alert, setAlert] = useState({
        show: false,
        variant: "",
        message: ""
    });

    const [formData, setFormData] = useState({
        candidateEmail: "",
        interviewer2: "",
        interviewer3: "",
        interviewer4: ""
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

            const requestBody = {

                candidateEmail: formData.candidateEmail,

                interviewer2:
                    formData.interviewer2.trim() === ""
                        ? null
                        : formData.interviewer2,

                interviewer3:
                    formData.interviewer3.trim() === ""
                        ? null
                        : formData.interviewer3,

                interviewer4:
                    formData.interviewer4.trim() === ""
                        ? null
                        : formData.interviewer4

            };

            const response = await api.post(
                "/interviewer/start-interview",
                requestBody
            );

            setSessionId(response.data.sessionId);

            setAlert({
                show: true,
                variant: "success",
                message: response.data.message
            });

            setTimeout(() => {

                navigate("/interviewer/dashboard");

            }, 3000);

        }
        catch (error) {

            setAlert({
                show: true,
                variant: "danger",
                message:
                    error.response?.data?.message ||
                    "Unable to create interview session."
            });

        }
        finally {

            setLoading(false);

        }

    };

    // Optional interviewer slots are rendered from a small config array so the
    // numbering (2nd, 3rd, 4th panelist) stays tied to real, meaningful data
    // rather than being a decorative index.
    const additionalInterviewers = [
        { key: "interviewer2", label: "Second interviewer", value: formData.interviewer2 },
        { key: "interviewer3", label: "Third interviewer", value: formData.interviewer3 },
        { key: "interviewer4", label: "Fourth interviewer", value: formData.interviewer4 }
    ];

    return (

        <div className="ci-page">

            <style>{styles}</style>

            <div className="ci-shell">

                <div className="ci-card">

                    <div className="ci-card__header">

                        <span className="ci-eyebrow">New interview session</span>

                        <h1 className="ci-title">Conduct an interview</h1>

                        <p className="ci-subtitle">
                            Invite a candidate and, if you like, bring in extra
                            panelists. They&apos;ll get access as soon as the
                            candidate accepts.
                        </p>

                    </div>

                    <div className="ci-card__body">

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

                        {sessionId && (

                            <div className="ci-ticket" role="status">

                                <div className="ci-ticket__row">

                                    <div className="ci-ticket__status">

                                        <span className="ci-ticket__pulse" aria-hidden="true" />

                                        Session created

                                    </div>

                                </div>

                                <div className="ci-ticket__id-block">

                                    <span className="ci-ticket__id-label">Session ID</span>

                                    <span className="ci-ticket__id">{sessionId}</span>

                                </div>

                                <div className="ci-ticket__divider" aria-hidden="true" />

                                <p className="ci-ticket__note">
                                    Waiting for the candidate to accept the invitation.
                                    You&apos;ll be redirected to your dashboard shortly.
                                </p>

                            </div>

                        )}

                        <form className="ci-form" onSubmit={handleSubmit} noValidate>

                            <div className="ci-field">

                                <label className="ci-field__label" htmlFor="candidateEmail">
                                    Candidate email
                                </label>

                                <input
                                    id="candidateEmail"
                                    type="email"
                                    className="ci-field__input"
                                    name="candidateEmail"
                                    placeholder="candidate@company.com"
                                    value={formData.candidateEmail}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="ci-section">

                                <div className="ci-section__heading">

                                    <h2 className="ci-section__title">
                                        Additional interviewers
                                    </h2>

                                    <span className="ci-badge">Optional</span>

                                </div>

                                <div className="ci-interviewer-list">

                                    {additionalInterviewers.map((interviewer, index) => (

                                        <div className="ci-field ci-field--inline" key={interviewer.key}>

                                            <span className="ci-avatar" aria-hidden="true">
                                                {index + 2}
                                            </span>

                                            <div className="ci-field__grow">

                                                <label
                                                    className="ci-field__label ci-field__label--sr"
                                                    htmlFor={interviewer.key}
                                                >
                                                    {interviewer.label}
                                                </label>

                                                <input
                                                    id={interviewer.key}
                                                    type="email"
                                                    className="ci-field__input"
                                                    name={interviewer.key}
                                                    placeholder={`${interviewer.label} email`}
                                                    value={interviewer.value}
                                                    onChange={handleChange}
                                                />

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            </div>

                            <div className="ci-actions">

                                <button
                                    type="submit"
                                    className="ci-button ci-button--primary"
                                    disabled={loading}
                                >

                                    {loading ? (

                                        <>
                                            <span className="ci-spinner" aria-hidden="true" />
                                            Creating session…
                                        </>

                                    ) : (

                                        <>
                                            Start interview
                                            <svg
                                                className="ci-button__icon"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 16 16"
                                                fill="none"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    d="M3.5 8h9m0 0-3.5-3.5M12.5 8 9 11.5"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </>

                                    )}

                                </button>

                                <button
                                    type="button"
                                    className="ci-button ci-button--ghost"
                                    onClick={() => navigate("/interviewer/dashboard")}
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

                <p className="ci-footnote">
                    Panelists receive their own scoring view once the session begins.
                </p>

            </div>

            {loading && <LoadingSpinner />}

        </div>

    );

}

export default ConductInterview;