import api from './axiosInstance';

export interface MiniApp {
    _id: string;
    title: string;
    url: string;
    thumbnail?: string;
    displayPosition: string;
}

const miniAppApi = {
    getAllActive: async () => {
        try {
            const response = await api.get('/miniapp');
            return response.data;
        } catch (error) {
            console.error('API Error in getAllActive:', error);
            return { success: false, data: [] };
        }
    }
};

export default miniAppApi;
