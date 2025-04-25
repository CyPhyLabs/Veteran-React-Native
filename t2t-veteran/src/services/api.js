// services/api.js
import { Platform } from 'react-native';
import { BASE_URL, AUTH_ENDPOINTS } from './authTypes';
// import { API_BASE_URL, ANDROID_API_BASE_URL, IOS_API_BASE_URL, PHYSICAL_DEVICE_URL } from '@env';
import Constants from 'expo-constants';
import { autoReauthenticateIfNeeded } from './auth.utils'; // <-- Import our helper



/**
 * Universal API Caller
 * Automatically refreshes access tokens if expired.
 * Navigates to login screen if refresh token fails.
 */
export const apiCall = async (endpoint, method = 'GET', body = null, customHeaders = {}, navigation = null) => {
    const url = `${BASE_URL}${endpoint}`;

    try {
        const access = await autoReauthenticateIfNeeded(navigation);  // <-- Key here!

        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${access}`,
            ...customHeaders,
        };

        const options = {
            method,
            headers,
            ...(body && { body: JSON.stringify(body) }),
        };

        console.log(`Making ${method} request to:`, url, 'with options:', options);

        const response = await fetch(url, options);
        const contentType = response.headers.get('content-type');
        const text = await response.text();

        console.log('Response:', {
            status: response.status,
            contentType,
            text: text.substring(0, 200),
        });

        if (!response.ok) {
            const error = new Error(`HTTP error! status: ${response.status}`);
            error.status = response.status;
            error.response = text;
            throw error;
        }

        if (contentType?.includes('application/json')) {
            return JSON.parse(text);
        }

        throw new Error(`Expected JSON response but got ${contentType}`);
    } catch (error) {
        console.error('API call failed:', {
            url,
            method,
            status: error.status,
            message: error.message,
            response: error.response,
        });
        throw error;
    }
};

export const ENDPOINTS = {
    ...AUTH_ENDPOINTS,
    MESSAGES: '/notifications/',
    SEND_MESSAGE: '/messages/create/',
    MIRROR_AUTH: {
        REFRESH: '/mirror-auth/refresh/'
    },

};
