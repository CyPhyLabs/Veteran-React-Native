import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import CameraScreen from '../screens/CameraScreen';
import MirrorConnectionScreen from '../screens/MirrorConnectionScreen';
import { AuthContext } from '../context/AuthContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === 'Home') {
                    iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Calendar') {
                    iconName = focused ? 'calendar' : 'calendar-outline';
                } else if (route.name === 'Camera') {
                    iconName = focused ? 'camera' : 'camera-outline';
                }
                return <Ionicons name={iconName} size={size} color={color} />;
            },
        })}
    >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
        <Tab.Screen name="Camera" component={CameraScreen} />
    </Tab.Navigator>
);

const AppNavigator = () => {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isAuthenticated ? (
                    <>
                        <Stack.Screen name="MainApp" component={TabNavigator} />
                        <Stack.Screen
                            name="MirrorConnectionScreen"
                            component={MirrorConnectionScreen}
                            options={{
                                headerShown: true,
                                title: 'Mirror Connection'
                            }}
                        />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                        <Stack.Screen name="MirrorConnectionScreen" component={MirrorConnectionScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;