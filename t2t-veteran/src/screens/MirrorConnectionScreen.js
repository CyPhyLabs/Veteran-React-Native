import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import BLEManager from '../services/BleManager';

export default function MirrorConnectionScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { device, password } = route.params || {};

    const [ssid, setSsid] = useState('');
    const [wifiPassword, setWifiPassword] = useState('');
    const [sending, setSending] = useState(false);


    useEffect(() => {
        if (!device) {
            Alert.alert('Error', 'No device connected');
            navigation.goBack();
        }

        // Cleanup on unmount
        return () => {
            if (device) {
                BLEManager.disconnectFromDevice(device)
                    .catch(error => console.error('Disconnect error:', error));
            }
        };
    }, [device]);

    const handleDisconnect = async () => {
        try {
            if (device) {
                await BLEManager.disconnectFromDevice(device);
                navigation.goBack();
            }
        } catch (error) {
            console.error('Disconnect error:', error);
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
                                qrcode_password: password,
                                token: "1",
                            });

                            console.log('📦 Preparing data:', { ssid, qrcode_password: password, hasPassword: !!wifiPassword });

                            // Get the service UUID from device's serviceUUIDs
                            const serviceUUID = device.serviceUUIDs?.[0];
                            if (!serviceUUID) {
                                throw new Error('No service UUID found');
                            }

                            // Get all services
                            const services = await device.services();
                            const service = services.find(s => s.uuid.toLowerCase() === serviceUUID.toLowerCase());
                            if (!service) {
                                throw new Error(`Service ${serviceUUID} not found`);
                            }

                            // Get all characteristics
                            const characteristics = await service.characteristics();
                            const characteristic = characteristics[0]; // Use the first characteristic
                            if (!characteristic) {
                                throw new Error('No characteristic found');
                            }

                            console.log('Service UUID:', serviceUUID);
                            console.log('Characteristic UUID:', characteristic.uuid);

                            await BLEManager.sendData(
                                device,
                                serviceUUID,
                                characteristic.uuid,
                                data
                            );

                            Alert.alert('Success', 'Wi-Fi credentials sent successfully.');
                        } catch (error) {
                            console.error('❌ Send error:', error);
                            Alert.alert('Error', `Failed to send Wi-Fi credentials: ${error.message}`);
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
    subtitle: {
        fontSize: 16,
        color: '#FFFFFF',
        marginBottom: 30,
        opacity: 0.8,
    },
    disabledButton: {
        opacity: 0.6,
    },
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
