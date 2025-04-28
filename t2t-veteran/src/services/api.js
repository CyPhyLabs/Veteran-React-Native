import { Platform } from 'react-native';
import { API_BASE_URL, ANDROID_API_BASE_URL, IOS_API_BASE_URL, PHYSICAL_DEVICE_URL } from '@env';
import Constants from 'expo-constants';

const getBaseUrl = () => {
    return API_BASE_URL;
};

export const BASE_URL = getBaseUrl();

export const apiCall = async (endpoint, method = 'GET', body = null) => {
    const url = `${BASE_URL}${endpoint}`;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        ...(body && { body: JSON.stringify(body) }),
    };

    console.log(`Making ${method} request to:`, url, 'with options:', options);

    try {
        const response = await fetch(url, options);
        const contentType = response.headers.get('content-type');
        const text = await response.text();

        console.log('Response:', {
            status: response.status,
            contentType,
            text: text.substring(0, 200) // Log first 200 chars
        });

        if (!response.ok) {
            // Handle non-200 responses
            const error = new Error(`HTTP error! status: ${response.status}`);
            error.status = response.status;
            error.response = text;
            throw error;
        }

        // Only try to parse JSON if the content-type is JSON
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
            response: error.response
        });
        throw error;
    }
};



export const ENDPOINTS = {
    LOGIN: '/login/',
    REGISTER: '/register/',
    MESSAGES: '/messages/',
};

// Function to fetch messages
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