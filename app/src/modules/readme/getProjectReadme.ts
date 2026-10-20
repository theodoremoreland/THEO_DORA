// Third party
import axios, { AxiosError, AxiosResponse } from 'axios';

interface ErrorResponse {
    message: string;
}

const getProjectReadme = async (projectName: string): Promise<string> => {
    try {
        const response: AxiosResponse<string> = await axios.get(
            `https://raw.githubusercontent.com/theodoremoreland/${projectName}/master/README.md`
        );

        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const axiosError: AxiosError<ErrorResponse> = error;

            throw axiosError.response?.data.message;
        }

        throw error instanceof Error ? error.message : String(error);
    }
};

export default getProjectReadme;
