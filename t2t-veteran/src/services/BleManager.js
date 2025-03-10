// BLEManager.js
import { BleManager } from 'react-native-ble-plx';
import { Platform, PermissionsAndroid, Alert } from 'react-native';

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
                Alert.alert('Permission denied', 'Some required permissions are not granted.');
                return false;
            }
        }
        return true;
    }

    async connectToDevice(deviceId) {
        try {
            const device = await this.manager.connectToDevice(deviceId);
            await device.discoverAllServicesAndCharacteristics();
            return device;
        } catch (error) {
            console.error('Failed to connect:', error);
            throw error;
        }
    }

    async disconnectFromDevice(device) {
        try {
            await device.cancelConnection();
        } catch (error) {
            console.error('Failed to disconnect:', error);
        }
    }

    async sendData(device, serviceUUID, characteristicUUID, data) {
        try {
            const base64Data = Buffer.from(data).toString('base64');
            await device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, base64Data);
        } catch (error) {
            console.error('Failed to send data:', error);
        }
    }
}

export default new BLEManager();
