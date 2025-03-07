import { Platform } from 'react-native';
import { API_BASE_URL, ANDROID_API_BASE_URL, IOS_API_BASE_URL, PHYSICAL_DEVICE_URL } from '@env';
import Constants from 'expo-constants';

// const getBaseUrl = () => {
//     const platform = Platform.OS;
//     const isDevice = Constants.isDevice;

//     console.log('Device info:', {
//         platform,
//         isDevice,
//         deviceName: Constants.deviceName,
//     });

//     // Handle physical devices
//     if (isDevice) {
//         console.log('Physical device detected, using:', PHYSICAL_DEVICE_URL);
//         return PHYSICAL_DEVICE_URL;
//     }

//     // Handle simulators/emulators
//     if (platform === 'ios') {
//         console.log('iOS simulator detected, using:', IOS_API_BASE_URL);
//         return IOS_API_BASE_URL;
//     }

//     if (platform === 'android') {
//         console.log('Android emulator detected, using:', ANDROID_API_BASE_URL);
//         return ANDROID_API_BASE_URL;
//     }

//     return API_BASE_URL;
// };

const getBaseUrl = () => {
    const platform = Platform.OS;
    const deviceName = Constants.deviceName || '';
    const modelName = Constants.platform?.ios?.model;

    // More accurate simulator detection for iOS and Android
    const isSimulator = platform === 'ios'
        ? (deviceName === 'iPhone Simulator' || !modelName)
        : deviceName.toLowerCase().includes('sdk_gphone');

    console.log('Device info:', {
        platform,
        deviceName,
        modelName,
        isSimulator
    });

    // Handle different environments
    if (platform === 'ios') {
        if (isSimulator) {
            console.log('iOS simulator detected, using:', IOS_API_BASE_URL);
            return IOS_API_BASE_URL;
        }
        console.log('iOS physical device detected, using:', PHYSICAL_DEVICE_URL);
        return PHYSICAL_DEVICE_URL;
    }

    if (platform === 'android') {
        if (isSimulator) {
            console.log('Android emulator detected, using:', ANDROID_API_BASE_URL);
            return ANDROID_API_BASE_URL;
        }
        console.log('Android physical device detected, using:', PHYSICAL_DEVICE_URL);
        return PHYSICAL_DEVICE_URL;
    }

    return API_BASE_URL;
};

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

export const BASE_URL = getBaseUrl();

export const ENDPOINTS = {
    LOGIN: '/login/',
    REGISTER: '/register/',
};