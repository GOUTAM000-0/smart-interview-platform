import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthBackground from "../components/AuthBackground";
import AlertMessage from "../components/AlertMessage";
import api from "../services/api";

function InterviewerRegister() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [alert, setAlert] = useState({
        show: false,
        variant: "",
        message: ""
    });

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        companyName: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {

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
                "/interviewers/register",
                formData
            );

            setAlert({
                show: true,
                variant: "success",
                message: response.data.message
            });

            if (response.data.success) {

                sessionStorage.setItem(
                    "interviewerRegisterEmail",
                    formData.email
                );

                setTimeout(() => {

                    navigate("/interviewer/verify-registration");

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

        <AuthBackground title="INTERVIEWER REGISTER">

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
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="input-box">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="input-box">
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="input-box">
                    <input
                        type="text"
                        name="companyName"
                        placeholder="Company Name"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="input-box">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
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
                            ? "REGISTERING..."
                            : "REGISTER"
                    }

                </button>

                <p>

                    Already have an account?

                    <Link to="/login">

                        {" "}Login

                    </Link>

                </p>

            </form>

        </AuthBackground>

    );

}

export default InterviewerRegister;