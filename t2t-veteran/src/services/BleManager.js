import { BleManager } from 'react-native-ble-plx';
import { Platform, PermissionsAndroid } from 'react-native';

class BLEManager {
    constructor() {
        this.manager = new BleManager();
    }

    async requestPermissions() {
        if (Platform.OS === 'android' && Platform.Version >= 23) {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            ]);

            if (
                granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] !== PermissionsAndroid.RESULTS.GRANTED ||
                granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] !== PermissionsAndroid.RESULTS.GRANTED ||
                granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] !== PermissionsAndroid.RESULTS.GRANTED
            ) {
                console.error('Bluetooth permissions not granted.');
                return false;
            }
        }
        return true;
    }

    async scanForDevice(deviceId) {
        return new Promise((resolve, reject) => {
            deviceId = deviceId.replace(/-/g, '').toLowerCase();
            console.log('🔍 Scanning for device:', deviceId);

            this.manager.startDeviceScan(null, null, async (error, device) => {
                if (error) {
                    console.error('Scan error:', error);
                    this.manager.stopDeviceScan();
                    reject(error);
                    return;
                }

                if (device && device.serviceUUIDs.some((uuid) => uuid.replace(/-/g, '').toLowerCase() == deviceId.toLowerCase())) {
                    console.log('✅ Device found:', device);
                    this.manager.stopDeviceScan();
                    resolve(device);
                }
            });

            // Stop scan after 10 seconds if device is not found
            setTimeout(() => {
                this.manager.stopDeviceScan();
                reject(new Error('Device scan timeout. Device not found.'));
            }, 60000);
        });
    }

    async connectToDevice(deviceId) {
        try {
            const device = await this.scanForDevice(deviceId);
            if (!device) {
                throw new Error('Device not found');
            }

            console.log('🔗 Connecting to device:', device.id);
            await device.connect();
            await device.discoverAllServicesAndCharacteristics();
            console.log('✅ Connected successfully!');
            return device;
        } catch (error) {
            console.error('❌ Failed to connect:', error);
            throw error;
        }
    }

    async disconnectFromDevice(device) {
        try {
            console.log('🔌 Disconnecting from device:', device.id);
            await device.cancelConnection();
        } catch (error) {
            console.error('❌ Failed to disconnect:', error);
        }
    }

    async sendData(device, serviceUUID, characteristicUUID, data) {
        try {
            console.log('📝 Preparing to send data...');
            await device.discoverAllServicesAndCharacteristics();

            const services = await device.services();
            console.log('📡 Available services:', services.map(s => s.uuid));

            const service = services.find(s => s.uuid.toLowerCase() === serviceUUID.toLowerCase());
            if (!service) {
                throw new Error(`Service ${serviceUUID} not found`);
            }

            const characteristics = await service.characteristics();
            console.log('🔧 Available characteristics:', characteristics.map(c => c.uuid));

            const characteristic = characteristics.find(
                c => c.uuid.toLowerCase() === characteristicUUID.toLowerCase()
            );

            if (!characteristic) {
                throw new Error(`Characteristic ${characteristicUUID} not found`);
            }

            // Convert data to bytes
            const encoder = new TextEncoder();
            const bytes = encoder.encode(data);

            // Convert bytes to base64
            const base64Data = btoa(String.fromCharCode(...bytes));

            console.log('📤 Sending data...');
            try {
                await characteristic.writeWithResponse(base64Data);
                console.log('✅ Data sent successfully!');
            } catch (writeError) {
                // Check if error is ATT error 401
                if (writeError.errorCode === 401) {
                    console.log('⚠️ Got ATT error 401, but data might have been sent successfully');
                    // Return true since the mirror received the data
                    return true;
                }
                throw writeError;
            }

            return true;
        } catch (error) {
            console.error('❌ Send data error:', error.message);
            if (error.errorCode) {
                console.error('Error code:', error.errorCode);
            }
            if (error.reason) {
                console.error('Error reason:', error.reason);
            }
            throw error;
        }
    }
}

export default new BLEManager();
