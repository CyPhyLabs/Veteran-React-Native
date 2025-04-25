import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services/auth.service';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);

    const handleLogin = async () => {
        try {
            const data = await authService.login(email, password, navigation);
            await AsyncStorage.setItem('access_token', data.access);
            await AsyncStorage.setItem('refresh_token', data.refresh);
            login();
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign in to your Account</Text>
            <Text style={styles.subtitle}>Welcome back! Please enter your details.</Text>

            <TextInput
                placeholder="Email"
                placeholderTextColor="#8E8E93"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                placeholder="Password"
                placeholderTextColor="#8E8E93"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
            />

            <TouchableOpacity onPress={() => console.log('Forgot Password pressed')}>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>


            <View style={styles.footer}>
                <Text style={styles.footerText}>Don’t have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.footerLink}>Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D7E3F1',
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#637D92',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#8E8E93',
        marginBottom: 30,
    },
    input: {
        backgroundColor: '#F9F9F9',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        color: 'black',
        marginBottom: 15,
    },
    forgotPassword: {
        color: '#885053',
        textAlign: 'right',
        marginBottom: 20,
    },
    loginButton: {
        backgroundColor: '#885053',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    footerText: {
        color: '#8E8E93',
        fontSize: 14,
    },
    footerLink: {
        color: '#885053',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default LoginScreen;