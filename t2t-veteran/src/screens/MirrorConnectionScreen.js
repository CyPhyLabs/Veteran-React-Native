import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import BLEManager from '../services/BleManager';
import WifiManager from '../services/WifiManager';
import { requestMirrorRefreshToken } from '../services/mirrorAuth.service';

export default function MirrorConnectionScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { device, password } = route.params || {};

    const [ssid, setSsid] = useState('');
    const [wifiPassword, setWifiPassword] = useState('');
    const [sending, setSending] = useState(false);

    const [currentSSID, setCurrentSSID] = useState(null);
    const [manualEntry, setManualEntry] = useState(false);



    useEffect(() => {
        async function fetchWifi() {
            const ssid = await WifiManager.getCurrentSSID();
            setCurrentSSID(ssid);
        }

        fetchWifi();

        if (!device) {
            Alert.alert('Error', 'No device connected');
            navigation.goBack();
            return;
        }

        // Cleanup on unmount
        return () => {
            if (device) {
                // Wrap disconnect in try-catch to prevent unhandled rejection
                BLEManager.disconnectFromDevice(device)
                    .catch(error => {
                        // Only log critical errors, ignore cancellation
                        if (!error.message.includes('cancelled')) {
                            console.error('Disconnect error:', error);
                        }
                    });
            }
        };
    }, [device]);


    const handleDisconnect = async () => {
        try {
            if (device) {
                await BLEManager.disconnectFromDevice(device);
            }
            navigation.goBack();
        } catch (error) {
            // Only show alert for critical errors
            if (!error.message.includes('cancelled')) {
                console.error('Disconnect error:', error);
                Alert.alert('Error', 'Failed to disconnect properly, but proceeding to previous screen.');
            }
            // Navigate back anyway since we want to leave this screen
            navigation.goBack();
        }
    };

    const sendCredentials = async (wifiSSID, wifiPassword) => {
        setSending(true);
        try {
            const mirrorToken = await requestMirrorRefreshToken();

            const credentialsPayload = {
                wifi_ssid: wifiSSID,
                wifi_password: wifiPassword,
                qrcode_password: password, // from screen param
                mirror_refresh_token: mirrorToken,
            };

            const data = JSON.stringify(credentialsPayload);

            const serviceUUID = device.serviceUUIDs?.[0];
            const services = await device.services();
            const service = services.find(s => s.uuid.toLowerCase() === serviceUUID.toLowerCase());
            const characteristic = (await service.characteristics())[0];

            await BLEManager.sendData(device, serviceUUID, characteristic.uuid, data);

            Alert.alert('Success', 'Credentials sent successfully to the mirror.');
        } catch (error) {
            console.error('Failed to send credentials:', error.message);
            Alert.alert('Error', `Failed to send credentials: ${error.message}`);
        } finally {
            setSending(false);
        }
    };

    const handleShareCurrentWifi = async () => {
        let pass = await WifiManager.getStoredPassword(currentSSID);
        if (!pass) {
            WifiManager.promptForPassword(currentSSID, (enteredPass) => {
                sendCredentials(currentSSID, enteredPass);
            });
        } else {
            sendCredentials(currentSSID, pass);
        }
    };

    const handleManualSend = () => {
        if (!ssid || !wifiPassword) {
            Alert.alert('Error', 'Please enter both SSID and password.');
            return;
        }
        WifiManager.storeWifiPassword(ssid, wifiPassword);  // Changed from savePassword to storeWifiPassword
        sendCredentials(ssid, wifiPassword);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Connected to Mirror</Text>

            {currentSSID && (
                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleShareCurrentWifi}
                    disabled={sending}
                >
                    <Text style={styles.buttonText}>
                        {sending ? 'Sending...' : `Share Current WiFi: ${currentSSID}`}
                    </Text>
                </TouchableOpacity>
            )}

            <Text style={styles.subtitle}>Or manually enter WiFi credentials:</Text>

            <TextInput
                style={styles.input}
                placeholder="Wi-Fi SSID"
                value={ssid}
                onChangeText={setSsid}
            />
            <TextInput
                style={styles.input}
                placeholder="Wi-Fi Password"
                value={wifiPassword}
                onChangeText={setWifiPassword}
                secureTextEntry
            />

            <TouchableOpacity style={styles.sendButton} onPress={handleManualSend} disabled={sending}>
                <Text style={styles.buttonText}>{sending ? 'Sending...' : 'Send Wi-Fi Info'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.disconnectButton}
                onPress={handleDisconnect}
            >
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
