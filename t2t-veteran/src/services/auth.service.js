import { apiCall, ENDPOINTS } from './api';

export const authService = {
    login: async (email, password) => {
        return apiCall(ENDPOINTS.LOGIN, 'POST', { email, password });
    },

    register: async (username, email, password, userType) => {
        return apiCall(ENDPOINTS.REGISTER, 'POST', {
            username,
            email,
            password,
            user_type: userType
        });
    }
};