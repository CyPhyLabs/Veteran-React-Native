// import React, { createContext, useState, useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);

//     useEffect(() => {
//         checkAuth();
//     }, []);

//     const checkAuth = async () => {
//         const token = await AsyncStorage.getItem('access_token');
//         setIsAuthenticated(!!token);
//     };

//     const login = () => setIsAuthenticated(true);

//     const logout = async () => {
//         await AsyncStorage.removeItem('access_token');
//         await AsyncStorage.removeItem('refresh_token');
//         setIsAuthenticated(false);
//     };

//     return (
//         <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Buffer } from 'buffer';
import { refreshAccessToken } from '../services/refreshTokenAPI.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        console.log('AuthProvider mounted, checking authentication status...');
        checkAuth();

        const tokenCheckInterval = setInterval(() => {
            checkAuth();
        }, 60000);

        return () => {
            clearInterval(tokenCheckInterval);
        };
    }, []);

    // // Move the clearUserData function inside AuthContext
    // const clearUserData = async () => {
    //     try {
    //         const keysToRemove = [
    //             'profileData',
    //             'personalInfo',
    //             'phoneNumber',
    //             'username',
    //             // Add any other user-specific keys here
    //         ];

    //         await AsyncStorage.multiRemove(keysToRemove);
    //         return true;
    //     } catch (error) {
    //         console.error('Error clearing user data:', error);
    //         return false;
    //     }
    // };

    const isTokenExpired = (token) => {
        console.log('Checking if token is expired...');
        try {
            const parts = token.split('.');

            if (parts.length !== 3) {

                return true;
            }

            const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
            console.log('Token payload decoded:', JSON.stringify(payload));

            if (!payload.exp) {
                console.log('Token has no expiration date');
                return false;
            }

            const currentTime = Math.floor(Date.now() / 1000);
            const expiresIn = payload.exp - currentTime;


            return expiresIn <= 0;
        } catch (error) {
            console.error('Error checking token expiration:', error);
            return true; // Assume expired on error
        }
    };

    const checkAuth = async () => {
        console.log('Checking authentication status...');
        try {
            const token = await AsyncStorage.getItem('access_token');

            if (!token) {
                console.log('No access token found in storage');
                await logout();
                return;
            }

            console.log('Access token found, checking expiration...');

            if (isTokenExpired(token)) {
                console.log('Token is expired, attempting to refresh...');
                try {
                    const newToken = await refreshAccessToken();
                    if (newToken) {
                        console.log('Token refreshed successfully');
                        setIsAuthenticated(true);
                        return;
                    }
                } catch (error) {
                    console.error('Failed to refresh token:', error.message);
                    await logout();
                    return;
                }
            }

            console.log('Token is valid, user is authenticated');
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Error checking authentication:', error);
            await logout();
        }
    };

    const login = () => {
        console.log('User logged in');
        setIsAuthenticated(true);
    };

    const logout = async () => {
        console.log('Logging out user...');
        try {
            // await clearUserData();

            await AsyncStorage.removeItem('userToken');
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Error during logout:', error);
            setIsAuthenticated(false); // Force logout even on error
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};