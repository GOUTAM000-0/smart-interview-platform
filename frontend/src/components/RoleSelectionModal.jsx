import { useState } from "react";

// Scoped styles, kept in this file so the component is self-contained.
// Namespaced under .rs-overlay and built on the same design tokens used
// across the rest of the app (ConductInterview, CandidateDashboard,
// InterviewerDashboard, AIQuestionGenerator).
const styles = `
.rs-overlay {
    --rs-bg: #f3f5f6;
    --rs-surface: #ffffff;
    --rs-ink: #17222c;
    --rs-ink-soft: #3d4c58;
    --rs-muted: #6b7a86;
    --rs-border: #e2e7ea;
    --rs-primary: #1f5f52;
    --rs-primary-dark: #143f37;
    --rs-primary-tint: #e8f1ee;
    --rs-focus: rgba(31, 95, 82, 0.28);

    --rs-font-display: "Fraunces", Georgia, serif;
    --rs-font-body: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;

    box-sizing: border-box;
    position: fixed;
    inset: 0;
    z-index: 1050;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: rgba(15, 23, 29, 0.55);
    backdrop-filter: blur(2px);
    font-family: var(--rs-font-body);
    color: var(--rs-ink);
    animation: rs-fade-in 0.15s ease-out;
}

.rs-overlay *,
.rs-overlay *::before,
.rs-overlay *::after {
    box-sizing: border-box;
}

@keyframes rs-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
}

.rs-modal {
    width: 100%;
    max-width: 440px;
    background: var(--rs-surface);
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.35);
    animation: rs-modal-in 0.18s ease-out;
}

@keyframes rs-modal-in {
    from { opacity: 0; transform: translateY(10px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}

/* ---------- Header ---------- */

.rs-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding: 26px 28px 20px;
    background: linear-gradient(160deg, var(--rs-primary-dark) 0%, var(--rs-primary) 100%);
    color: #ffffff;
}

.rs-header__text {
    min-width: 0;
}

.rs-eyebrow {
    display: block;
    font-size: 11.5px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #b7d6cb;
    margin-bottom: 8px;
}

.rs-title {
    font-family: var(--rs-font-display);
    font-weight: 600;
    font-size: 21px;
    margin: 0;
}

.rs-close {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.14);
    color: #ffffff;
    cursor: pointer;
    transition: background 0.15s ease, transform 0.12s ease;
}

.rs-close:hover {
    background: rgba(255, 255, 255, 0.24);
}

.rs-close:active {
    transform: scale(0.92);
}

/* ---------- Body ---------- */

.rs-body {
    padding: 24px 28px 6px;
}

.rs-body__intro {
    margin: 0 0 18px;
    font-size: 13.5px;
    color: var(--rs-muted);
}

.rs-role-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.rs-role-input {
    position: absolute;
    opacity: 0;
    width: 1px;
    height: 1px;
}

.rs-role-card {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 15px 16px;
    border: 1.5px solid var(--rs-border);
    border-radius: 14px;
    cursor: pointer;
    transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
}

.rs-role-card:hover {
    border-color: #c7d0d5;
    background: #fafbfb;
}

.rs-role-input:checked + .rs-role-card {
    border-color: var(--rs-primary);
    background: var(--rs-primary-tint);
    box-shadow: 0 0 0 3px var(--rs-focus);
}

.rs-role-input:focus-visible + .rs-role-card {
    outline: 2px solid var(--rs-primary);
    outline-offset: 2px;
}

.rs-role-icon {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: var(--rs-primary-tint);
    color: var(--rs-primary);
    transition: background 0.15s ease, color 0.15s ease;
}

.rs-role-input:checked + .rs-role-card .rs-role-icon {
    background: var(--rs-primary);
    color: #ffffff;
}

.rs-role-text {
    flex: 1;
    min-width: 0;
}

.rs-role-name {
    font-size: 14.5px;
    font-weight: 600;
    color: var(--rs-ink);
}

.rs-role-desc {
    font-size: 12.5px;
    color: var(--rs-muted);
    margin-top: 2px;
}

.rs-role-check {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1.5px solid var(--rs-border);
    background: #ffffff;
    color: transparent;
    transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.rs-role-input:checked + .rs-role-card .rs-role-check {
    background: var(--rs-primary);
    border-color: var(--rs-primary);
    color: #ffffff;
}

/* ---------- Footer ---------- */

.rs-footer {
    display: flex;
    gap: 12px;
    padding: 24px 28px 28px;
}

.rs-btn {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 18px;
    font-family: var(--rs-font-body);
    font-size: 14px;
    font-weight: 600;
    border-radius: 10px;
    border: 1px solid transparent;
    cursor: pointer;
    transition: background 0.15s ease, border-color 0.15s ease, transform 0.05s ease, color 0.15s ease;
}

.rs-btn:active {
    transform: translateY(1px);
}

.rs-btn--ghost {
    color: var(--rs-ink-soft);
    background: var(--rs-surface);
    border-color: var(--rs-border);
}

.rs-btn--ghost:hover {
    border-color: #c7d0d5;
    background: #f7f8f9;
}

.rs-btn--primary {
    color: #ffffff;
    background: var(--rs-primary);
}

.rs-btn--primary:hover {
    background: var(--rs-primary-dark);
}

.rs-btn:focus-visible {
    outline: 2px solid var(--rs-primary);
    outline-offset: 2px;
}

/* ---------- Responsive ---------- */

@media (max-width: 480px) {
    .rs-footer {
        flex-direction: column-reverse;
    }
}

@media (prefers-reduced-motion: reduce) {
    .rs-overlay,
    .rs-modal {
        animation: none;
    }
}
`;

const ROLES = [
    {
        value: "CANDIDATE",
        name: "Candidate",
        description: "I'm here to take an interview",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.6" />
                <path
                    d="M5 20c0-3.6 3.13-6.2 7-6.2s7 2.6 7 6.2"
                    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
                />
            </svg>
        )
    },
    {
        value: "INTERVIEWER",
        name: "Interviewer",
        description: "I'm here to conduct interviews",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="2.5" y="5.5" width="14" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
                <path d="M16.5 10.2 21 7.5v9l-4.5-2.7" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
        )
    }
];

function RoleSelectionModal({

    show,
    onClose,
    onSelectRole,
    title = "Select role",
    buttonText = "Continue"

}) {

    const [selectedRole, setSelectedRole] = useState("CANDIDATE");

    if (!show) return null;

    const handleContinue = () => {

        onSelectRole(selectedRole);

    };

    return (

        <div className="rs-overlay" role="dialog" aria-modal="true" aria-labelledby="rs-title">

            <style>{styles}</style>

            <div className="rs-modal">

                <div className="rs-header">

                    <div className="rs-header__text">

                        <span className="rs-eyebrow">Account setup</span>

                        <h2 className="rs-title" id="rs-title">{title}</h2>

                    </div>

                    <button
                        type="button"
                        className="rs-close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path
                                d="M6 6l12 12M18 6 6 18"
                                stroke="currentColor" strokeWidth="1.8"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>

                </div>

                <div className="rs-body">

                    <p className="rs-body__intro">
                        Choose how you'll be using the platform.
                    </p>

                    <div className="rs-role-list" role="radiogroup" aria-label="Select role">

                        {ROLES.map((role) => (

                            <label key={role.value} style={{ position: "relative" }}>

                                <input
                                    className="rs-role-input"
                                    type="radio"
                                    name="role"
                                    value={role.value}
                                    checked={selectedRole === role.value}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                />

                                <span className="rs-role-card">

                                    <span className="rs-role-icon">{role.icon}</span>

                                    <span className="rs-role-text">
                                        <span className="rs-role-name">{role.name}</span>
                                        <span className="rs-role-desc">{role.description}</span>
                                    </span>

                                    <span className="rs-role-check" aria-hidden="true">
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                                            <path
                                                d="M5 13l4 4L19 7"
                                                stroke="currentColor" strokeWidth="2.5"
                                                strokeLinecap="round" strokeLinejoin="round"
                                            />
                                        </svg>
                                    </span>

                                </span>

                            </label>

                        ))}

                    </div>

                </div>

                <div className="rs-footer">

                    <button
                        type="button"
                        className="rs-btn rs-btn--ghost"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="rs-btn rs-btn--primary"
                        onClick={handleContinue}
                    >
                        {buttonText}
                    </button>

                </div>

            </div>

        </div>

    );

}

export default RoleSelectionModal;