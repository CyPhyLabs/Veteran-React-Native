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
            console.log('🔍 Scanning for device:', deviceId);

            this.manager.startDeviceScan(null, null, async (error, device) => {
                if (error) {
                    console.error('Scan error:', error);
                    this.manager.stopDeviceScan();
                    reject(error);
                    return;
                }

                if (device && device.id.toLowerCase() === deviceId.toLowerCase()) {
                    console.log('✅ Device found:', device.id);
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
}

export default new BLEManager();
