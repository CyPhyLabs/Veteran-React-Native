// services/api.js
import { Platform } from 'react-native';
import { BASE_URL, getEndpointType, ENDPOINT_TYPES, AUTH_ENDPOINTS } from './authTypes';
// import { API_BASE_URL, ANDROID_API_BASE_URL, IOS_API_BASE_URL, PHYSICAL_DEVICE_URL } from '@env';
import Constants from 'expo-constants';
import { autoReauthenticateIfNeeded } from './auth.utils'; // <-- Import our helper
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Universal API Caller
 * Automatically refreshes access tokens if expired.
 * Navigates to login screen if refresh token fails.
 */
export const apiCall = async (endpoint, method = 'GET', body = null, customHeaders = {}, navigation = null) => {
    const url = `${BASE_URL}${endpoint}`;
    const endpointType = getEndpointType(endpoint);

    try {
        let headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...customHeaders,
        };

        switch (endpointType) {
            case ENDPOINT_TYPES.PUBLIC:
                // No authentication needed
                break;

            case ENDPOINT_TYPES.REFRESH:
                // Only check for refresh token
                const refreshToken = await AsyncStorage.getItem('refresh_token');
                if (!refreshToken) {
                    await autoReauthenticateIfNeeded(navigation);
                }
                break;

            case ENDPOINT_TYPES.PROTECTED:
                // Full authentication check
                const access = await autoReauthenticateIfNeeded(navigation);
                headers.Authorization = `Bearer ${access}`;
                break;
        }

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

export const fetchMessages = async () => {
    try {
        const messages = await apiCall(ENDPOINTS.MESSAGES);
        console.log('Fetched messages:', messages);
        return messages;
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
};