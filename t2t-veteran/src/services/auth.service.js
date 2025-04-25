import { apiCall, ENDPOINTS } from './api';

export const authService = {
    login: async (email, password, navigation) => {
        return apiCall(ENDPOINTS.LOGIN, 'POST', { email, password }, {}, navigation);
    },

    register: async (username, email, password, userType, navigation) => {
        return apiCall(ENDPOINTS.REGISTER, 'POST', {
            username,
            email,
            password,
            user_type: userType
        }, {}, navigation);
    }
};
