import axiosInstance from './axiosInstance';

export const getWorkspaceOverview = async () => {
    try {
        const response = await axiosInstance.get('/workspace/overview');
        return response.data;
    } catch (error) {
        throw error;
    }
};
