// services/auth.utils.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshAccessToken } from './refreshTokenAPI';
import { Alert } from 'react-native';

export const autoReauthenticateIfNeeded = async (navigation = null) => {
    try {
        let access = await AsyncStorage.getItem('access_token');

        if (!access) {
            access = await refreshAccessToken();
            if (!access && navigation) {
                navigation.reset({
                    index: 0,
                    routes: [{
                        name: 'Login',
                        params: {
                            message: 'Please sign in to continue'
                        }
                    }],
                });
                return null;
            }
        }

        return access;
    } catch (error) {
        console.error('Auth check failed:', error);
        if (navigation) {
            navigation.reset({
                index: 0,
                routes: [{
                    name: 'Login',
                    params: {
                        message: 'Your session has expired. Please sign in again.'
                    }
                }],
            });
        }
        return null;
    }
};
