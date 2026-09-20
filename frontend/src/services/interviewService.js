import api from "./api";

const interviewService = {

    // Send Interview Invitation
    sendInterviewRequest: async (requestData) => {
        const response = await api.post(
            "/interview/send-request",
            requestData
        );
        return response.data;
    },

    // Candidate Accept Interview
    acceptInterview: async (interviewId) => {
        const response = await api.post(
            `/interview/${interviewId}/accept`
        );
        return response.data;
    },

    // Candidate Reject Interview
    rejectInterview: async (interviewId) => {
        const response = await api.post(
            `/interview/${interviewId}/reject`
        );
        return response.data;
    },

    // Candidate Upload CV
    uploadCV: async (interviewId, file) => {

        const formData = new FormData();

        formData.append("cv", file);

        const response = await api.post(
            `/interview/${interviewId}/upload-cv`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );

        return response.data;
    },

    // Interviewer Download CV
    downloadCV: async (interviewId) => {

        const response = await api.get(
            `/interview/${interviewId}/download-cv`,
            {
                responseType: "blob"
            }
        );

        return response;
    },

    // Generate AI Questions
    generateQuestions: async (interviewId, jobRole) => {

        const response = await api.post(
            `/interview/${interviewId}/generate-questions`,
            {
                jobRole
            }
        );

        return response.data;
    },

    // Get Interview Details
    getInterview: async (interviewId) => {

        const response = await api.get(
            `/interview/${interviewId}`
        );

        return response.data;
    }

};

export default interviewService;