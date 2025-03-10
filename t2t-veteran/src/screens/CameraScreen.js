import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import BLEManager from '../services/BleManager';

export default function CameraScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanning, setScanning] = useState(false);
    const [facing, setFacing] = useState('back');
    const [mirrorData, setMirrorData] = useState(null); // Store scanned mirror data
    const [modalVisible, setModalVisible] = useState(false);
    const [connecting, setConnecting] = useState(false);

    const navigation = useNavigation();

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                    <Text style={styles.buttonText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleBarCodeScanned = async ({ data }) => {
        setScanning(false);
        try {
            const parsedData = JSON.parse(data);
            if (parsedData.id && parsedData.password) {
                setMirrorData(parsedData); // Store mirror data
                setModalVisible(true); // Open modal
            } else {
                setMirrorData({ error: 'Invalid QR Code' });
                setModalVisible(true);
            }
        } catch (error) {
            setMirrorData({ error: 'Failed to parse QR code' });
            setModalVisible(true);
        }
    };

    const connectToMirror = async () => {
        setConnecting(true);
        setModalVisible(false);

        const permissionsGranted = await BLEManager.requestPermissions();
        if (!permissionsGranted) {
            setConnecting(false);
            return;
        }

        try {
            const device = await BLEManager.connectToDevice(mirrorData.id);
            setConnecting(false);
            navigation.navigate('MirrorConnectionScreen', { device, password: mirrorData.password });
        } catch (error) {
            setConnecting(false);
            setMirrorData({ error: 'Connection Failed' });
            setModalVisible(true);
        }
    };

    const toggleCameraFacing = () => {
        setFacing((current) => (current === 'back' ? 'front' : 'back'));
    };

    return (
        <SafeAreaView style={StyleSheet.absoluteFillObject}>
            {/* Camera View */}
            <CameraView
                style={StyleSheet.absoluteFillObject}
                facing={facing}
                barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                onBarcodeScanned={scanning ? handleBarCodeScanned : undefined}
            >
                <View style={styles.overlay}>
                    <View style={styles.scannerFrame} />
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                        <Text style={styles.text}>Flip Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.scanButton} onPress={() => setScanning(true)}>
                        <Text style={styles.buttonText}>Scan QR</Text>
                    </TouchableOpacity>
                </View>
            </CameraView>

            {/* Modal for Mirror Connection */}
            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {mirrorData?.error ? (
                            <>
                                <Text style={styles.modalText}>{mirrorData.error}</Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        setModalVisible(false);
                                        setMirrorData(null); // Reset mirror data
                                    }}
                                    style={styles.modalButton}
                                >
                                    <Text style={styles.buttonText}>Close</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <Text style={styles.modalText}>Mirror Detected</Text>
                                <Text style={styles.modalSubText}>Do you want to connect?</Text>
                                <View style={styles.buttonRow}>
                                    <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                                        <Text style={styles.buttonText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={connectToMirror} style={styles.confirmButton}>
                                        <Text style={styles.buttonText}>Connect</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>

            {/* Loading Indicator While Connecting */}
            {connecting && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#FFFFFF" />
                    <Text style={styles.loadingText}>Connecting...</Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
    message: { textAlign: 'center', color: '#fff', paddingBottom: 10, fontSize: 18 },
    permissionButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10 },
    buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    buttonContainer: { position: 'absolute', bottom: 20, width: '100%', flexDirection: 'row', justifyContent: 'space-evenly' },
    button: { backgroundColor: '#007AFF', padding: 12, borderRadius: 10, alignItems: 'center' },
    scanButton: { backgroundColor: '#34C759', padding: 12, borderRadius: 10, alignItems: 'center' },
    text: { fontSize: 16, fontWeight: 'bold', color: 'white' },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
    scannerFrame: { width: 250, height: 250, borderWidth: 4, borderColor: '#FFF', backgroundColor: 'rgba(255,255,255,0.2)' },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.6)' },
    modalContent: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 10, alignItems: 'center', width: '80%' },
    modalText: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    modalSubText: { fontSize: 16, color: '#555', marginBottom: 20 },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
    confirmButton: { backgroundColor: '#007AFF', padding: 12, borderRadius: 10, alignItems: 'center', flex: 1, marginHorizontal: 5 },
    cancelButton: { backgroundColor: '#FF3B30', padding: 12, borderRadius: 10, alignItems: 'center', flex: 1, marginHorizontal: 5 },
    loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
    loadingText: { color: '#FFF', marginTop: 10, fontSize: 18 },
    modalButton: {
        backgroundColor: '#FF3B30',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
        marginTop: 10
    },
});
