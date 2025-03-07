import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
 import LoginScreen from '../screens/LoginScreen';
 import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import { AuthContext } from '../context/AuthContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => (
    <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
    </Tab.Navigator>
);

const AppNavigator = () => {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <NavigationContainer>
            <Stack.Navigator>
                 {isAuthenticated ? ( 
                    <Stack.Screen name="Home" component={TabNavigator} />
                 ) : ( 
                     <> 
                        { <Stack.Screen name="Login" component={LoginScreen} /> }
                        { <Stack.Screen name="Register" component={RegisterScreen} /> }
                     </> 
                 )} 
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
