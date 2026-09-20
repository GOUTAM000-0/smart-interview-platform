import axios from "axios";

const api = axios.create({
    baseURL: "https://smartinterviewsystem-backend.onrender.com/api",
    headers: {
        "Content-Type": "application/json"
    }
});

// Attach JWT only to protected APIs
api.interceptors.request.use(
    (config) => {

        const publicUrls = [
            "/users/register",
            "/users/login",
            "/users/forgot-password",
            "/users/reset-password",
            "/users/verify-otp",
            "/users/verify-registration",

            "/interviewers/register",
            "/interviewers/login",
            "/interviewers/forgot-password",
            "/interviewers/reset-password",
            "/interviewers/verify-otp",
            "/interviewers/verify-registration",

            "/ai/generate-questions",
            "/ai/generate-from-resume"
        ];

        const isPublic = publicUrls.some((url) =>
            config.url?.includes(url)
        );

        if (!isPublic) {
            const token = localStorage.getItem("token");

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;