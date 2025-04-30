import React from 'react';
import { Platform, StatusBar } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    // <SafeAreaProvider>
    //   <StatusBar
    //     barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
    //     backgroundColor="transparent"
    //     translucent={Platform.OS === 'android'}
    //   />
    <AuthProvider>
      <AppNavigator />
      <Toast />
    </AuthProvider>
    // </SafeAreaProvider>
  );
}