import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthBackground from "../components/AuthBackground";
import AlertMessage from "../components/AlertMessage";
import api from "../services/api";

function InterviewerVerifyOtp() {

    const navigate = useNavigate();

    const email = sessionStorage.getItem("interviewerResetEmail");

    const [otp, setOtp] = useState("");

    const [loading, setLoading] = useState(false);

    const [alert, setAlert] = useState({
        show: false,
        variant: "",
        message: ""
    });

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const response = await api.post(
                "/interviewers/verify-otp",
                {
                    email,
                    otp
                }
            );

            setAlert({
                show: true,
                variant: "success",
                message: response.data.message
            });

            if (response.data.success) {

                setTimeout(() => {

                    navigate("/interviewer/reset-password");

                }, 1500);

            }

        }
        catch (error) {

            setAlert({

                show: true,

                variant: "danger",

                message:
                    error.response?.data?.message ||
                    "Unable to connect to Spring Boot Server."

            });

        }
        finally {

            setLoading(false);

        }

    };

    return (

        <AuthBackground title="VERIFY OTP">

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

            <form onSubmit={handleSubmit}>

                <div className="input-box">

                    <input
                        type="email"
                        value={email || ""}
                        readOnly
                    />

                </div>

                <div className="input-box">

                    <input
                        type="text"
                        placeholder="Enter 6 Digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        required
                    />

                </div>

                <button
                    type="submit"
                    disabled={loading}
                >

                    {
                        loading
                            ? "VERIFYING..."
                            : "VERIFY OTP"
                    }

                </button>

                <p>

                    Back to

                    <Link to="/login">

                        {" "}Login

                    </Link>

                </p>

            </form>

        </AuthBackground>

    );

}

export default InterviewerVerifyOtp;