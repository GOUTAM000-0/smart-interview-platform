import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthBackground from "../components/AuthBackground";
import AlertMessage from "../components/AlertMessage";
import api from "../services/api";

function InterviewerVerifyRegistration() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [alert, setAlert] = useState({
        show: false,
        variant: "",
        message: ""
    });

    const [formData, setFormData] = useState({
        email:
            sessionStorage.getItem(
                "interviewerRegisterEmail"
            ) || "",
        otp: ""
    });

    useEffect(() => {

        if (!formData.email) {

            navigate("/interviewer/register");

        }

    }, [formData.email, navigate]);

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

            const response = await api.post(
                "/interviewers/verify-registration",
                formData
            );

            setAlert({
                show: true,
                variant: "success",
                message: response.data.message
            });

            if (response.data.success) {

                sessionStorage.removeItem(
                    "interviewerRegisterEmail"
                );

                setTimeout(() => {

                    navigate("/login");

                }, 1200);

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

        <AuthBackground title="VERIFY EMAIL">

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
                        value={formData.email}
                        readOnly
                    />

                </div>

                <div className="input-box">

                    <input
                        type="text"
                        name="otp"
                        placeholder="Enter OTP"
                        value={formData.otp}
                        onChange={handleChange}
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
                            : "VERIFY EMAIL"
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

export default InterviewerVerifyRegistration;