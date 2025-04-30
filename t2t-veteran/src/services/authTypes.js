export const AUTH_ENDPOINTS = {
    REFRESH_TOKEN: '/token/refresh/',
    LOGIN: '/login/',
    REGISTER: '/register/',
};

// Completely public endpoints (no tokens needed)
export const PUBLIC_ENDPOINTS = [
    AUTH_ENDPOINTS.LOGIN,
    AUTH_ENDPOINTS.REGISTER,
];

// Protected endpoints that require special handling
export const ENDPOINT_TYPES = {
    PUBLIC: 'public',        // No tokens needed (login, register)
    PROTECTED: 'protected',  // Requires valid access token
    REFRESH: 'refresh'       // Requires refresh token only
};

export const getEndpointType = (endpoint) => {
    if (PUBLIC_ENDPOINTS.includes(endpoint)) {
        return ENDPOINT_TYPES.PUBLIC;
    }
    if (endpoint === AUTH_ENDPOINTS.REFRESH_TOKEN) {
        return ENDPOINT_TYPES.REFRESH;
    }
    return ENDPOINT_TYPES.PROTECTED;
};

export const getBaseUrl = () => {
    return process.env.API_BASE_URL;
};

export const BASE_URL = getBaseUrl();