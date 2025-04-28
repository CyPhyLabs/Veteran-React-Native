import * as Network from 'expo-network';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

const WifiManager = {
    getCurrentSSID: async () => {
        try {
            const networkState = await Network.getNetworkStateAsync();
            if (networkState.type === Network.NetworkStateType.WIFI) {
                return networkState.ssid;
            }
            return null;
        } catch (error) {
            console.error('Error fetching current SSID:', error);
            return null;
        }
    },

    getStoredPassword: async (ssid) => {
        try {
            const password = await SecureStore.getItemAsync(`wifi-${ssid}`);
            return password;
        } catch (error) {
            console.error('Error retrieving stored password:', error);
            return null;
        }
    },

    storeWifiPassword: async (ssid, password) => {
        try {
            await SecureStore.setItemAsync(`wifi-${ssid}`, password);
            return true;
        } catch (error) {
            console.error('Error storing WiFi password:', error);
            return false;
        }
    },

    promptForPassword: (ssid, onPasswordEntered) => {
        Alert.prompt(
            "Enter WiFi Password",
            `Please enter password for ${ssid}`,
            [
                { text: "Cancel", style: "cancel" },
                { text: "OK", onPress: password => onPasswordEntered(password) }
            ],
            'secure-text'
        );
    }
};

export default WifiManager;