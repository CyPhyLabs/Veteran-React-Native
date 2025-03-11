import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import BLEManager from '../services/BleManager';

export default function MirrorConnectionScreen({ device, password, onDisconnect }) {
    const [ssid, setSsid] = useState('');
    const [wifiPassword, setWifiPassword] = useState('');
    const [sending, setSending] = useState(false);

    const handleDisconnect = async () => {
        try {
            await BLEManager.disconnectFromDevice(device);
            onDisconnect();
        } catch (error) {
            Alert.alert('Error', 'Failed to disconnect.');
        }
    };

    const handleSendWifiCredentials = async () => {
        if (!ssid || !wifiPassword) {
            Alert.alert('Error', 'Please enter both SSID and password.');
            return;
        }

        Alert.alert(
            'Send Wi-Fi Info',
            'Do you want to send Wi-Fi credentials to the mirror?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Send',
                    onPress: async () => {
                        setSending(true);
                        try {
                            const data = JSON.stringify({
                                ssid,
                                password: wifiPassword,
                                qrcode_password: password, // This ensures the mirror authenticates the request
                                token: "YOUR_AUTH_TOKEN_HERE", // Replace this with the actual authentication token
                            });

                            await BLEManager.sendData(
                                device,
                                'your-service-uuid-here', // Replace with actual service UUID
                                'your-characteristic-uuid-here', // Replace with actual characteristic UUID
                                data
                            );

                            Alert.alert('Success', 'Wi-Fi credentials sent successfully.');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to send Wi-Fi credentials.');
                        } finally {
                            setSending(false);
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Connected to Mirror</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter Wi-Fi SSID"
                value={ssid}
                onChangeText={setSsid}
            />
            <TextInput
                style={styles.input}
                placeholder="Enter Wi-Fi Password"
                value={wifiPassword}
                onChangeText={setWifiPassword}
                secureTextEntry
            />

            <TouchableOpacity style={styles.sendButton} onPress={handleSendWifiCredentials} disabled={sending}>
                <Text style={styles.buttonText}>{sending ? 'Sending...' : 'Send Wi-Fi Info'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.disconnectButton} onPress={handleDisconnect}>
                <Text style={styles.buttonText}>Disconnect</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 20,
    },
    input: {
        width: '90%',
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
        fontSize: 16,
    },
    sendButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        width: '90%',
        alignItems: 'center',
    },
    disconnectButton: {
        backgroundColor: '#FF3B30',
        padding: 15,
        borderRadius: 10,
        width: '90%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
