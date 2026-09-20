import api from "./api";

const authService = {

    // ================= LOGIN =================

    login: async (role, credentials) => {

        const url =
            role === "CANDIDATE"
                ? "/users/login"
                : "/interviewers/login";

        const response = await api.post(
            url,
            credentials
        );

        return response.data;

    },

    // ================= REGISTER =================

    registerCandidate: async (data) => {

        const response = await api.post(
            "/users/register",
            data
        );

        return response.data;

    },

    registerInterviewer: async (data) => {

        const response = await api.post(
            "/interviewers/register",
            data
        );

        return response.data;

    },

    // ============ VERIFY REGISTRATION ============

    verifyCandidateRegistration: async (data) => {

        const response = await api.post(
            "/users/verify-registration",
            data
        );

        return response.data;

    },

    verifyInterviewerRegistration: async (data) => {

        const response = await api.post(
            "/interviewers/verify-registration",
            data
        );

        return response.data;

    },

    // ============== FORGOT PASSWORD ==============

    forgotCandidatePassword: async (data) => {

        const response = await api.post(
            "/users/forgot-password",
            data
        );

        return response.data;

    },

    forgotInterviewerPassword: async (data) => {

        const response = await api.post(
            "/interviewers/forgot-password",
            data
        );

        return response.data;

    },

    // ================= VERIFY OTP =================

    verifyCandidateOtp: async (data) => {

        const response = await api.post(
            "/users/verify-otp",
            data
        );

        return response.data;

    },

    verifyInterviewerOtp: async (data) => {

        const response = await api.post(
            "/interviewers/verify-otp",
            data
        );

        return response.data;

    },

    // ============== RESET PASSWORD ==============

    resetCandidatePassword: async (data) => {

        const response = await api.post(
            "/users/reset-password",
            data
        );

        return response.data;

    },

    resetInterviewerPassword: async (data) => {

        const response = await api.post(
            "/interviewers/reset-password",
            data
        );

        return response.data;

    }

};

export default authService;