import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import AuthBackground from "../components/AuthBackground";
import AlertMessage from "../components/AlertMessage";
import api from "../services/api";

function VerifyRegistration() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: sessionStorage.getItem("registerEmail") || "",
        otp: ""
    });

    const [loading, setLoading] = useState(false);

    const [alert, setAlert] = useState({
        show: false,
        variant: "",
        message: ""
    });

    useEffect(() => {

        if (!sessionStorage.getItem("registerEmail")) {

            navigate("/register");

        }

    }, [navigate]);

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
                "/users/verify-registration",
                formData
            );

            setAlert({
                show: true,
                variant: "success",
                message: response.data.message
            });

            if (response.data.success) {

                sessionStorage.removeItem("registerEmail");

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
                        name="email"
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

export default VerifyRegistration;