import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, AUTH_ENDPOINTS } from './authTypes';

export const refreshAccessToken = async () => {
    try {
        const refresh = await AsyncStorage.getItem('refresh_token');
        const access = await AsyncStorage.getItem('access_token');

        if (!refresh) {
            console.log('No refresh token found');
            return null;
        }

        const response = await fetch(`${BASE_URL}${AUTH_ENDPOINTS.REFRESH_TOKEN}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${access}`,
            },
            body: JSON.stringify({ refresh }),
        });

        if (!response.ok) {
            console.log('Token refresh failed');
            return null;
        }

        const data = await response.json();
        await AsyncStorage.setItem('access_token', data.access);
        return data.access;
    } catch (error) {
        console.error('Error during token refresh:', error);
        return null;
    }
};