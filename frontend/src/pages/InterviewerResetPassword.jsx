import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthBackground from "../components/AuthBackground";
import AlertMessage from "../components/AlertMessage";
import api from "../services/api";

function InterviewerResetPassword() {

    const navigate = useNavigate();

    const email = sessionStorage.getItem("interviewerResetEmail");

    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);

    const [alert, setAlert] = useState({
        show: false,
        variant: "",
        message: ""
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {

            setAlert({
                show: true,
                variant: "danger",
                message: "Password and Confirm Password do not match."
            });

            return;

        }

        setLoading(true);

        try {

            const response = await api.post(
                "/interviewers/reset-password",
                {
                    email,
                    newPassword: formData.newPassword,
                    confirmPassword: formData.confirmPassword
                }
            );

            setAlert({
                show: true,
                variant: "success",
                message: response.data.message
            });

            if (response.data.success) {

                sessionStorage.removeItem(
                    "interviewerResetEmail"
                );

                setTimeout(() => {

                    navigate("/login");

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

        <AuthBackground title="RESET PASSWORD">

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
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                    />

                </div>

                <div className="input-box">

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />

                </div>

                <button
                    type="submit"
                    disabled={loading}
                >

                    {
                        loading
                            ? "UPDATING..."
                            : "RESET PASSWORD"
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

export default InterviewerResetPassword;