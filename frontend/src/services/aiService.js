import api from "./api";

const aiService = {

    generateQuestions: async (interviewId, jobRole) => {

        const response = await api.post(

            `/ai/generate-questions/${interviewId}`,

            {

                jobRole

            }

        );

        return response.data;

    },

    generateQuestionsFromResume: async (resumeFile, jobRole) => {

        const formData = new FormData();
        formData.append("resume", resumeFile);
        formData.append("jobRole", jobRole);

        const response = await api.post(

            "/ai/generate-from-resume",

            formData,

            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }

        );

        return response.data;

    },

    summarizeCV: async (interviewId) => {

        const response = await api.get(

            `/ai/cv-summary/${interviewId}`

        );

        return response.data;

    },

    evaluateCandidate: async (interviewId, answers) => {

        const response = await api.post(

            `/ai/evaluate/${interviewId}`,

            answers

        );

        return response.data;

    }

};

export default aiService;