import { useState } from "react";
import { useNavigate } from "react-router-dom";
import aiService from "../services/aiService";

// Scoped styles, kept in this file so the component is self-contained.
// Namespaced under .aq-page and built on the same design tokens as
// ConductInterview / CandidateDashboard / InterviewerDashboard, so this
// screen reads as part of the same product rather than a bolted-on tool.
const styles = `
.aq-page {
    --aq-bg: #f3f5f6;
    --aq-surface: #ffffff;
    --aq-ink: #17222c;
    --aq-ink-soft: #3d4c58;
    --aq-muted: #6b7a86;
    --aq-border: #e2e7ea;
    --aq-primary: #1f5f52;
    --aq-primary-dark: #143f37;
    --aq-primary-tint: #e8f1ee;
    --aq-success: #2f7d5c;
    --aq-danger: #c0392b;
    --aq-danger-tint: #fbeae8;
    --aq-focus: rgba(31, 95, 82, 0.28);

    --aq-font-display: "Fraunces", Georgia, serif;
    --aq-font-body: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
    --aq-font-mono: "JetBrains Mono", "SFMono-Regular", Consolas, monospace;

    box-sizing: border-box;
    min-height: 100vh;
    padding: 48px 20px 64px;
    background:
        radial-gradient(circle at 12% 0%, #e9f0ee 0%, transparent 45%),
        var(--aq-bg);
    font-family: var(--aq-font-body);
    color: var(--aq-ink);
}

.aq-page *,
.aq-page *::before,
.aq-page *::after {
    box-sizing: border-box;
}

.aq-shell {
    max-width: 720px;
    margin: 0 auto;
    position: relative;
}

/* ---------- Header ---------- */

.aq-back {
    position: absolute;
    top: -6px;
    right: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: var(--aq-surface);
    border: 1px solid var(--aq-border);
    border-radius: 50%;
    color: var(--aq-ink-soft);
    cursor: pointer;
    box-shadow: 0 1px 2px rgba(23, 34, 44, 0.04);
    transition: color 0.15s ease, border-color 0.15s ease, background 0.15s ease, transform 0.12s ease;
}

.aq-back:hover {
    color: var(--aq-primary);
    border-color: var(--aq-primary);
    background: var(--aq-primary-tint);
}

.aq-back:active {
    transform: scale(0.94);
}

.aq-header {
    margin-bottom: 30px;
    padding-right: 44px;
    text-align: center;
}

.aq-eyebrow {
    display: inline-block;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--aq-primary);
    margin-bottom: 8px;
}

.aq-title {
    font-family: var(--aq-font-display);
    font-weight: 600;
    font-size: 27px;
    line-height: 1.2;
    margin: 0 0 8px;
    color: var(--aq-ink);
}

.aq-subtitle {
    margin: 0 auto;
    max-width: 46ch;
    font-size: 14px;
    line-height: 1.5;
    color: var(--aq-muted);
}

/* ---------- Results card ---------- */

.aq-results-card {
    background: var(--aq-surface);
    border: 1px solid var(--aq-border);
    border-radius: 18px;
    padding: 28px;
    margin-bottom: 24px;
    box-shadow: 0 1px 2px rgba(23, 34, 44, 0.04), 0 18px 40px -26px rgba(20, 63, 55, 0.25);
    min-height: 140px;
}

.aq-empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: var(--aq-muted);
    padding: 36px 12px;
    gap: 12px;
}

.aq-empty-state svg {
    color: #c3ccd1;
}

.aq-empty-state span {
    font-size: 14px;
    max-width: 36ch;
    line-height: 1.5;
}

.aq-spinner {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2.5px solid var(--aq-primary-tint);
    border-top-color: var(--aq-primary);
    animation: aq-spin 0.7s linear infinite;
}

@keyframes aq-spin {
    to { transform: rotate(360deg); }
}

/* ---------- Category / Q&A ---------- */

.aq-category-block {
    margin-bottom: 26px;
}

.aq-category-block:last-child {
    margin-bottom: 0;
}

.aq-category-title {
    font-size: 12.5px;
    font-weight: 700;
    letter-spacing: 0.03em;
    color: var(--aq-primary-dark);
    margin-bottom: 14px;
    display: inline-block;
    padding: 5px 13px;
    background: var(--aq-primary-tint);
    border-radius: 999px;
}

.aq-qa-item {
    border-left: 3px solid var(--aq-primary);
    padding-left: 16px;
    margin-bottom: 18px;
}

.aq-qa-item:last-child {
    margin-bottom: 0;
}

.aq-question {
    font-weight: 600;
    font-size: 14.5px;
    margin-bottom: 5px;
    color: var(--aq-ink);
}

.aq-answer {
    font-size: 14px;
    color: var(--aq-ink-soft);
    line-height: 1.6;
    white-space: pre-wrap;
}

/* ---------- Form card ---------- */

.aq-form-card {
    background: var(--aq-surface);
    border: 1px solid var(--aq-border);
    border-radius: 18px;
    padding: 28px;
    box-shadow: 0 1px 2px rgba(23, 34, 44, 0.04), 0 18px 40px -26px rgba(20, 63, 55, 0.25);
}

.aq-form-title {
    font-family: var(--aq-font-display);
    font-weight: 600;
    font-size: 17px;
    margin-bottom: 20px;
    color: var(--aq-ink);
}

.aq-field-group {
    margin-bottom: 18px;
}

.aq-label {
    display: block;
    font-size: 12.5px;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: var(--aq-ink-soft);
    margin-bottom: 8px;
}

.aq-file-drop {
    display: block;
    border: 1.5px dashed #c7d0d5;
    border-radius: 12px;
    padding: 22px 16px;
    text-align: center;
    background: #fbfcfc;
    cursor: pointer;
    transition: border-color 0.15s ease, background 0.15s ease;
}

.aq-file-drop:hover {
    border-color: var(--aq-primary);
    background: var(--aq-primary-tint);
}

.aq-file-drop__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--aq-primary-tint);
    color: var(--aq-primary);
    margin-bottom: 10px;
}

.aq-file-drop__label {
    font-size: 13.5px;
    font-weight: 600;
    color: var(--aq-ink-soft);
}

.aq-file-drop__hint {
    font-size: 12px;
    color: var(--aq-muted);
    margin-top: 4px;
}

.aq-file-name {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--aq-font-mono);
    font-size: 12.5px;
    color: var(--aq-primary-dark);
    margin-top: 10px;
    padding: 4px 10px;
    background: var(--aq-primary-tint);
    border-radius: 999px;
}

.aq-text-input {
    width: 100%;
    padding: 11px 14px;
    font-family: var(--aq-font-body);
    font-size: 14px;
    color: var(--aq-ink);
    background: #fbfcfc;
    border: 1px solid var(--aq-border);
    border-radius: 10px;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
}

.aq-text-input::placeholder {
    color: #a5b1ba;
}

.aq-text-input:hover {
    border-color: #c7d0d5;
}

.aq-text-input:focus {
    background: #ffffff;
    border-color: var(--aq-primary);
    box-shadow: 0 0 0 4px var(--aq-focus);
}

.aq-submit {
    width: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 13px 18px;
    margin-top: 6px;
    font-family: var(--aq-font-body);
    font-size: 14.5px;
    font-weight: 600;
    color: #ffffff;
    background: var(--aq-primary);
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.15s ease, transform 0.05s ease;
}

.aq-submit:hover:not(:disabled) {
    background: var(--aq-primary-dark);
}

.aq-submit:active:not(:disabled) {
    transform: translateY(1px);
}

.aq-submit:disabled {
    background: #8fada4;
    cursor: not-allowed;
}

.aq-submit__spinner {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.45);
    border-top-color: #ffffff;
    animation: aq-spin 0.7s linear infinite;
}

.aq-error {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    background: var(--aq-danger-tint);
    color: var(--aq-danger);
    border: 1px solid #f0c6c0;
    border-radius: 10px;
    padding: 11px 14px;
    font-size: 13.5px;
    line-height: 1.4;
    margin-top: 16px;
}

/* ---------- Responsive ---------- */

@media (max-width: 560px) {
    .aq-results-card,
    .aq-form-card {
        padding: 22px;
    }

    .aq-title {
        font-size: 23px;
    }

    .aq-back {
        top: -10px;
    }

    .aq-header {
        padding-right: 40px;
    }
}

/* ---------- Accessibility ---------- */

.aq-text-input:focus-visible,
.aq-submit:focus-visible,
.aq-back:focus-visible,
.aq-file-drop:focus-within {
    outline: 2px solid var(--aq-primary);
    outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
    .aq-spinner,
    .aq-submit__spinner {
        animation: none;
    }
}
`;

function AIQuestionGenerator() {

    const navigate = useNavigate();

    const [resumeFile, setResumeFile] = useState(null);
    const [jobRole, setJobRole] = useState("Java Full Stack Developer");
    const [questions, setQuestions] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = (e) => {
        setResumeFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!resumeFile) {
            setError("Please select a resume PDF.");
            return;
        }
        if (!jobRole.trim()) {
            setError("Please enter a job role.");
            return;
        }

        setLoading(true);
        setQuestions(null);

        try {
            const result = await aiService.generateQuestionsFromResume(resumeFile, jobRole);
            if (result.success) {
                setQuestions(result.questions);
            } else {
                setError(result.message || "Failed to generate questions.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const renderCategory = (title, items) => {
        if (!items || items.length === 0) return null;
        return (
            <div className="aq-category-block">
                <span className="aq-category-title">{title}</span>
                {items.map((item, idx) => (
                    <div key={idx} className="aq-qa-item">
                        <div className="aq-question">Q{idx + 1}. {item.question}</div>
                        <div className="aq-answer">{item.answer}</div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="aq-page">

            <style>{styles}</style>

            <div className="aq-shell">

                <button
                    type="button"
                    className="aq-back"
                    onClick={() => navigate(-1)}
                    aria-label="Go back"
                    title="Go back"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                            d="M15 5 8 12l7 7"
                            stroke="currentColor" strokeWidth="1.8"
                            strokeLinecap="round" strokeLinejoin="round"
                        />
                    </svg>
                </button>

                <div className="aq-header">

                    <span className="aq-eyebrow">AI tools</span>

                    <h1 className="aq-title">AI interview question generator</h1>

                    <p className="aq-subtitle">
                        Upload a resume and get role-specific interview questions instantly.
                    </p>

                </div>

                {/* Results section - upper */}
                <div className="aq-results-card">

                    {loading && (
                        <div className="aq-empty-state">
                            <span className="aq-spinner" aria-hidden="true" />
                            <span>Generating questions from resume…</span>
                        </div>
                    )}

                    {!loading && !questions && (
                        <div className="aq-empty-state">
                            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <rect x="5" y="3" width="14" height="18" rx="2.2" stroke="currentColor" strokeWidth="1.6" />
                                <path d="M8.5 8h7M8.5 11.5h7M8.5 15h4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                            </svg>
                            <span>No questions generated yet. Upload a resume below to get started.</span>
                        </div>
                    )}

                    {!loading && questions && (
                        <div>
                            {renderCategory("HR questions", questions.hr)}
                            {renderCategory("Resume questions", questions.resume)}
                            {renderCategory("Technical questions", questions.technical)}
                            {renderCategory("Coding questions", questions.coding)}
                            {renderCategory("Project questions", questions.project)}
                        </div>
                    )}

                </div>

                {/* Upload form - lower */}
                <div className="aq-form-card">

                    <div className="aq-form-title">Generate questions</div>

                    <form onSubmit={handleSubmit} noValidate>

                        <div className="aq-field-group">

                            <label className="aq-label">Resume (PDF)</label>

                            <label className="aq-file-drop">

                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                    style={{ display: "none" }}
                                />

                                <span className="aq-file-drop__icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                        <path
                                            d="M12 4v11m0-11 4 4m-4-4-4 4M5 16v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2"
                                            stroke="currentColor" strokeWidth="1.6"
                                            strokeLinecap="round" strokeLinejoin="round"
                                        />
                                    </svg>
                                </span>

                                <div className="aq-file-drop__label">
                                    {resumeFile ? "Change file" : "Click to select a PDF resume"}
                                </div>

                                <div className="aq-file-drop__hint">PDF only</div>

                                {resumeFile && (
                                    <div className="aq-file-name">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                            <path
                                                d="M5 13l4 4L19 7"
                                                stroke="currentColor" strokeWidth="2"
                                                strokeLinecap="round" strokeLinejoin="round"
                                            />
                                        </svg>
                                        {resumeFile.name}
                                    </div>
                                )}

                            </label>

                        </div>

                        <div className="aq-field-group">

                            <label className="aq-label" htmlFor="jobRole">Job role</label>

                            <input
                                id="jobRole"
                                type="text"
                                className="aq-text-input"
                                value={jobRole}
                                onChange={(e) => setJobRole(e.target.value)}
                                placeholder="e.g. Java Full Stack Developer"
                            />

                        </div>

                        <button
                            type="submit"
                            className="aq-submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="aq-submit__spinner" aria-hidden="true" />
                                    Generating…
                                </>
                            ) : (
                                "Generate questions"
                            )}
                        </button>

                        {error && (
                            <div className="aq-error" role="alert">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0, marginTop: "1px" }}>
                                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                                    <path d="M12 8v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                                    <circle cx="12" cy="16" r="1" fill="currentColor" />
                                </svg>
                                {error}
                            </div>
                        )}

                    </form>

                </div>

            </div>

        </div>
    );
}

export default AIQuestionGenerator;