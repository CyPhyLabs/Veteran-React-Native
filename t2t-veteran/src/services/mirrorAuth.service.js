import { apiCall, ENDPOINTS } from './api';

export const requestMirrorRefreshToken = async () => {
    try {
        const response = await apiCall(
            ENDPOINTS.MIRROR_AUTH.REFRESH,
            'POST'
        );
        return response.mirror_refresh_token;
    } catch (error) {
        console.error('Error fetching mirror refresh token:', error.message);
        throw error;
    }
};