import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthBackground from "../components/AuthBackground";
import AlertMessage from "../components/AlertMessage";
import api from "../services/api";

function ForgotPassword() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

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
                "/users/forgot-password",
                {
                    email
                }
            );

            setAlert({
                show: true,
                variant: "success",
                message: response.data.message
            });

            if (response.data.success) {

                sessionStorage.setItem("resetEmail", email);

                setTimeout(() => {

                    navigate("/verify-otp");

                }, 1500);

            }

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

        <AuthBackground title="FORGOT PASSWORD">

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
                        placeholder="Enter Registered Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                </div>

                <button
                    type="submit"
                    disabled={loading}
                >

                    {
                        loading
                            ? "SENDING OTP..."
                            : "SEND OTP"
                    }

                </button>

                <p>

                    Remember your password?

                    <Link to="/login">

                        {" "}Login

                    </Link>

                </p>

            </form>

        </AuthBackground>

    );

}

export default ForgotPassword;