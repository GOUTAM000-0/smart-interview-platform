import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import webrtcService from "../services/webrtcService";
import api from "../services/api";
import useAuth from "../hooks/useAuth";

// Order + display metadata for each question category returned by the
// backend. Keeping this as a single source of truth makes it easy to
// add/remove/reorder categories later without touching render logic.
const CATEGORY_META = {
    technical: { label: "Technical", color: "#4C6FFF" },
    coding: { label: "Coding", color: "#8B5CF6" },
    hr: { label: "HR", color: "#14B8A6" },
    resume: { label: "Resume", color: "#F59E0B" },
    project: { label: "Project", color: "#F43F5E" },
};

const CATEGORY_ORDER = ["technical", "coding", "hr", "resume", "project"];

function InterviewerInterviewRoom() {

    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const sessionId = location.state?.sessionId;

    // Optional but recommended: pass this in when navigating here, e.g.
    //   navigate("/interviewer/interview-room", { state: { sessionId, candidateEmail } })
    // so the candidate's tile can be identified reliably even when more
    // than one interviewer is in the room. If it's not provided, we fall
    // back to treating the first remote stream as the candidate.
    const candidateEmail = location.state?.candidateEmail;

    const localVideoRef = useRef(null);

    const [cameraOn, setCameraOn] = useState(true);
    const [micOn, setMicOn] = useState(true);
    const [screenSharing, setScreenSharing] = useState(false);

    const [remoteStreams, setRemoteStreams] = useState({});

    const [jobRole, setJobRole] = useState("");

    // Questions grouped by category, exactly as returned by the backend,
    // e.g. { technical: [{question, answer}], coding: [...], ... }
    const [questionsByCategory, setQuestionsByCategory] = useState(null);
    const [activeCategory, setActiveCategory] = useState(null);
    const [generatingQuestions, setGeneratingQuestions] = useState(false);
    const [questionsError, setQuestionsError] = useState("");
    const [expandedKeys, setExpandedKeys] = useState(() => new Set());

    const [downloadingCV, setDownloadingCV] = useState(false);

    useEffect(() => {

        if (!sessionId || !user?.email) {
            if (!sessionId) navigate("/interviewer/dashboard");
            return;
        }

        let isMounted = true;

        const token = localStorage.getItem("token");

        const setup = async () => {

            const stream = await webrtcService.startLocalStream(localVideoRef.current);

            if (!isMounted) {
                stream.getTracks().forEach(track => track.stop());
                return;
            }

            webrtcService.on("onRemoteStream", (participantId, remoteStream) => {
                if (isMounted) {
                    setRemoteStreams(prev => ({
                        ...prev,
                        [participantId]: remoteStream
                    }));
                }
            });

            webrtcService.on("onUserLeft", (participantId) => {
                if (isMounted) {
                    setRemoteStreams(prev => {
                        const updated = { ...prev };
                        delete updated[participantId];
                        return updated;
                    });
                }
            });

            webrtcService.connect(token, user.email, () => {
                if (isMounted) {
                    webrtcService.joinRoom(sessionId);
                }
            });

        };

        setup();

        return () => {
            isMounted = false;
            webrtcService.leaveRoom();
            webrtcService.disconnect();
        };

    }, [sessionId, navigate, user?.email]);

    const toggleMic = () => {
        const next = !micOn;
        setMicOn(next);
        webrtcService.toggleMicrophone(next);
    };

    const toggleCamera = () => {
        const next = !cameraOn;
        setCameraOn(next);
        webrtcService.toggleCamera(next);
    };

    const handleToggleScreenShare = async () => {

        try {

            const stream = await webrtcService.toggleScreenShare();

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }

            setScreenSharing(webrtcService.isScreenSharing);

        } catch (error) {

            console.error("Screen share failed", error);

        }

    };

    const leaveInterview = async () => {

        const confirmLeave = window.confirm(
            "Are you sure you want to end this interview?"
        );

        if (!confirmLeave) {
            return;
        }

        try {

            // Tell backend interview is completed
            await api.put(`/interviewer/complete/${sessionId}`);

        } catch (error) {

            console.error("Unable to update interview status.", error);

        }

        // Leave WebRTC room
        webrtcService.leaveRoom();

        webrtcService.disconnect();

        navigate("/interviewer/dashboard");

    };

    // Backend contract:
    // POST http://localhost:8080/api/interviewer/generate-questions
    // Authorization: Bearer <interviewer JWT>
    // Body: { sessionId, jobRole }
    // -> { success, message, questions: { hr: [...], resume: [...], technical: [...], coding: [...], project: [...] } }
    const generateQuestions = async () => {

        if (!sessionId) {
            alert("Missing interview session.");
            return;
        }

        if (!jobRole.trim()) {
            alert("Please enter a job role first.");
            return;
        }

        try {

            setGeneratingQuestions(true);
            setQuestionsError("");

            const response = await api.post("/interviewer/generate-questions", {
                sessionId,
                jobRole: jobRole.trim(),
            });

            const categories = response.data?.questions || {};

            setQuestionsByCategory(categories);
            setExpandedKeys(new Set());

            const firstAvailable = CATEGORY_ORDER.find(
                (key) => Array.isArray(categories[key]) && categories[key].length > 0
            );

            setActiveCategory(firstAvailable || Object.keys(categories)[0] || null);

        } catch (error) {

            setQuestionsError(
                error.response?.data?.message ||
                "Failed to generate questions. Please try again."
            );

        } finally {

            setGeneratingQuestions(false);

        }

    };

    const toggleExpanded = (key) => {
        setExpandedKeys(prev => {
            const next = new Set(prev);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    };

    // Backend contract:
    // GET http://localhost:8080/api/interview/download-cv/{sessionId}
    // Authorization: Bearer <interviewer JWT>
    // -> binary file stream (e.g. INT-ABCD1234_Resume.pdf)
    const downloadCV = async () => {

        if (!sessionId) {

            alert("Missing interview session.");

            return;

        }

        try {

            setDownloadingCV(true);

            const response = await api.get(
                `/interview/download-cv/${sessionId}`,
                { responseType: "blob" }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));

            const link = document.createElement("a");

            link.href = url;

            const disposition = response.headers?.["content-disposition"];
            const filenameMatch = disposition && disposition.match(/filename="?([^"]+)"?/);
            const filename = filenameMatch ? filenameMatch[1] : `${sessionId}_Resume.pdf`;

            link.setAttribute("download", filename);

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {

            alert(

                error.response?.data?.message ||

                "Failed to download CV. It may not have been uploaded yet."

            );

        } finally {

            setDownloadingCV(false);

        }

    };

    const remoteEntries = Object.entries(remoteStreams);

    // Pick out the candidate's stream for the main stage. Prefer an exact
    // match on candidateEmail if it was passed in; otherwise assume the
    // first remote participant is the candidate.
    const candidateEntryIndex = candidateEmail
        ? remoteEntries.findIndex(([id]) => id === candidateEmail)
        : 0;

    const candidateEntry = candidateEntryIndex !== -1 ? remoteEntries[candidateEntryIndex] : null;

    // Everyone else on the call besides the candidate (other interviewers
    // who joined) gets a thumbnail, alongside your own camera.
    const otherEntries = remoteEntries.filter((_, index) => index !== candidateEntryIndex);

    const totalParticipants = remoteEntries.length + 1;

    const availableCategories = questionsByCategory
        ? CATEGORY_ORDER.filter(
            (key) => Array.isArray(questionsByCategory[key]) && questionsByCategory[key].length > 0
        )
        : [];

    const activeQuestions = activeCategory && questionsByCategory
        ? questionsByCategory[activeCategory] || []
        : [];

    return (

        <div className="interview-page">

            <div className="interview-header">

                <h2 className="interview-title">
                    Interview Room
                    <span className="participant-badge">
                        {totalParticipants} Participant{totalParticipants !== 1 ? "s" : ""}
                    </span>
                </h2>

                <button className="leave-btn" onClick={leaveInterview}>
                    Leave Interview
                </button>

            </div>

            <div className="interview-body">

                {/* Video */}

                <div className="video-stack">

                    {/* Main stage — the candidate */}
                    <div className="stage">

                        {candidateEntry ? (
                            <>
                                <video
                                    autoPlay
                                    playsInline
                                    ref={(el) => { if (el) el.srcObject = candidateEntry[1]; }}
                                />
                                <span className="tile-label">
                                    <span className="dot" />
                                    Candidate
                                </span>
                            </>
                        ) : (
                            <div className="stage-empty">
                                Waiting for candidate to join…
                            </div>
                        )}

                    </div>

                    {/* Yourself + any other interviewers — smaller tiles */}
                    <div className="thumb-row">

                        <div className="thumb-tile">

                            <video
                                ref={localVideoRef}
                                autoPlay
                                muted
                                playsInline
                            />

                            <span className="tile-label">
                                You {screenSharing ? "(Sharing Screen)" : ""}
                            </span>

                        </div>

                        {otherEntries.map(([participantId, stream]) => (

                            <div className="thumb-tile" key={participantId}>

                                <video
                                    autoPlay
                                    playsInline
                                    ref={(el) => { if (el) el.srcObject = stream; }}
                                />

                                <span className="tile-label">{participantId}</span>

                            </div>

                        ))}

                    </div>

                    <div className="controls-bar">

                        <button
                            className={`control-btn ${micOn ? "is-on" : ""}`}
                            onClick={toggleMic}
                        >
                            {micOn ? "Mute" : "Unmute"}
                        </button>

                        <button
                            className={`control-btn ${cameraOn ? "is-on" : ""}`}
                            onClick={toggleCamera}
                            disabled={screenSharing}
                        >
                            {cameraOn ? "Camera Off" : "Camera On"}
                        </button>

                        <button
                            className={`control-btn ${screenSharing ? "is-share" : ""}`}
                            onClick={handleToggleScreenShare}
                        >
                            {screenSharing ? "Stop Sharing" : "Share Screen"}
                        </button>

                    </div>

                </div>

                {/* AI */}

                <div className="side-panel">

                    <div className="side-panel-header">Candidate Resume</div>

                    <button className="panel-btn secondary" onClick={downloadCV} disabled={downloadingCV}>
                        {downloadingCV ? "Downloading…" : "Download CV"}
                    </button>

                    <div className="side-panel-header ai-section-header">AI Interview Questions</div>

                    <label>Job Role</label>

                    <input
                        type="text"
                        value={jobRole}
                        onChange={(e) => setJobRole(e.target.value)}
                        placeholder="Java Full Stack Developer"
                        disabled={generatingQuestions}
                    />

                    <button
                        className="panel-btn"
                        onClick={generateQuestions}
                        disabled={generatingQuestions}
                    >
                        {generatingQuestions ? (
                            <>
                                <span className="btn-spinner" />
                                Generating…
                            </>
                        ) : (
                            "Generate AI Questions"
                        )}
                    </button>

                    {questionsError && (
                        <div className="qa-error">{questionsError}</div>
                    )}

                    {/*
                        Tabs + list live inside ONE scroll container so the
                        tabs can actually stick to the top while the list
                        scrolls beneath them. (Sticky positioning only works
                        relative to the nearest scrolling ancestor, so the
                        tabs must be inside — not next to — the scroller.)
                    */}
                    <div className="qa-scroll-area">

                        {availableCategories.length > 0 && (

                            <div className="qa-tabs">

                                {availableCategories.map((key) => {
                                    const meta = CATEGORY_META[key] || { label: key, color: "#666" };
                                    const count = questionsByCategory[key].length;
                                    const isActive = activeCategory === key;

                                    return (
                                        <button
                                            key={key}
                                            className={`qa-tab ${isActive ? "is-active" : ""}`}
                                            style={{ "--tab-color": meta.color }}
                                            onClick={() => setActiveCategory(key)}
                                        >
                                            {meta.label}
                                            <span className="qa-tab-count">{count}</span>
                                        </button>
                                    );
                                })}

                            </div>

                        )}

                        <div className="qa-list">

                            {activeQuestions.map((q, index) => {

                                const key = `${activeCategory}-${index}`;
                                const isOpen = expandedKeys.has(key);
                                const isCode = activeCategory === "coding";
                                const meta = CATEGORY_META[activeCategory] || { color: "#666" };

                                return (

                                    <div
                                        className={`qa-item ${isOpen ? "is-open" : ""}`}
                                        key={key}
                                        style={{ "--qa-color": meta.color }}
                                    >

                                        <button
                                            className="qa-question"
                                            onClick={() => toggleExpanded(key)}
                                        >
                                            <span className="qa-index">Q{index + 1}</span>
                                            <span className="qa-question-text">{q.question}</span>
                                            <span className="qa-chevron">{isOpen ? "−" : "+"}</span>
                                        </button>

                                        {isOpen && (
                                            isCode ? (
                                                <pre className="qa-answer qa-answer-code">
                                                    <code>{q.answer}</code>
                                                </pre>
                                            ) : (
                                                <p className="qa-answer">{q.answer}</p>
                                            )
                                        )}

                                    </div>

                                );

                            })}

                            {questionsByCategory && availableCategories.length === 0 && (
                                <div className="qa-empty">No questions were returned. Try again.</div>
                            )}

                            {!questionsByCategory && !generatingQuestions && (
                                <div className="qa-empty">
                                    Enter a job role and generate questions to see them here.
                                </div>
                            )}

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default InterviewerInterviewRoom;