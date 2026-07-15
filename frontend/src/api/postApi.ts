import api from './axiosInstance';

export interface Post {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
    };
    content: string;
    link?: string;
    likes: string[];
    createdAt: string;
}

const postApi = {
    createPost: async (content: string, link?: string) => {
        try {
            const response = await api.post('/posts', { content, link });
            return response.data;
        } catch (error: any) {
            console.error('API Error in createPost:', error);
            return { success: false, message: error.response?.data?.message || 'Failed to create post' };
        }
    },
    getFeed: async () => {
        try {
            const response = await api.get('/posts');
            return response.data;
        } catch (error) {
            console.error('API Error in getFeed:', error);
            return { success: false, data: [] };
        }
    },
    likePost: async (id: string) => {
        try {
            const response = await api.post(`/posts/${id}/like`);
            return response.data;
        } catch (error) {
            console.error('API Error in likePost:', error);
            return { success: false };
        }
    },
    updatePost: async (id: string, content: string, link?: string) => {
        try {
            const response = await api.put(`/posts/${id}`, { content, link });
            return response.data;
        } catch (error: any) {
            console.error('API Error in updatePost:', error);
            return { success: false, message: error.response?.data?.message || 'Failed to update post' };
        }
    },
    deletePost: async (id: string) => {
        try {
            const response = await api.delete(`/posts/${id}`);
            return response.data;
        } catch (error: any) {
            console.error('API Error in deletePost:', error);
            return { success: false, message: error.response?.data?.message || 'Failed to delete post' };
        }
    }
};

export default postApi;
