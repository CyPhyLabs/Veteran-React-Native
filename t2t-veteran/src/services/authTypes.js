export const AUTH_ENDPOINTS = {
    REFRESH_TOKEN: '/token/refresh/',
    LOGIN: '/login/',
    REGISTER: '/register/',
};

export const getBaseUrl = () => {
    return process.env.API_BASE_URL;
};

export const BASE_URL = getBaseUrl();