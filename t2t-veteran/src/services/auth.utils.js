// services/auth.utils.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshAccessToken } from './refreshTokenAPI';
import { Alert } from 'react-native';

export const autoReauthenticateIfNeeded = async (navigation = null) => {
    try {
        let access = await AsyncStorage.getItem('access_token');

        if (!access) {
            console.log('Access token missing, attempting refresh...');
            access = await refreshAccessToken();
        }

        return access;
    } catch (error) {
        console.error('Reauthentication failed:', error.message);

        Alert.alert(
            'Session Expired',
            'Please log in again to continue.',
            [
                {
                    text: 'OK',
                    onPress: () => {
                        if (navigation) {
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Login' }],
                            });
                        }
                    }
                }
            ],
            { cancelable: false }
        );

        throw new Error('Session expired. Redirecting to login.');
    }
};
