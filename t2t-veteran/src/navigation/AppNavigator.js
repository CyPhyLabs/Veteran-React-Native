
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import { AuthContext } from '../context/AuthContext';
import NotificationsScreen from '../screens/NotificationsScreen';
import RemindersScreen from '../screens/RemindersScreen';
import CameraScreen from '../screens/CameraScreen';
import MirrorConnectionScreen from '../screens/MirrorConnectionScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Notifications"
      component={NotificationsScreen}
      options={{headerShown: false, tabBarIcon: ({ color, size }) => (<Icon name="notifications-outline" color={color} size={size} />),
      }}
    />
    <Tab.Screen
      name="Events"
      component={CalendarScreen}
      options={{headerShown: false, tabBarIcon: ({ color, size }) => (<Icon name="calendar-outline" color={color} size={size} /> ),
      }}
    />
     <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{headerShown: false, tabBarIcon: ({ color, size }) => (<Icon name="home-outline" color={color} size={size} />),
      }}
    />
    <Tab.Screen
      name="Reminders"
      component={RemindersScreen}
      options={{headerShown: false, tabBarIcon: ({ color, size }) => (<Icon name="alarm-outline" color={color} size={size} /> ),
      }}
    />
    <Tab.Screen
      name="Mirror"
      component={CameraScreen}
      options={{headerShown: false, tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="mirror-rectangle" size={size} color={color} /> ),
      }}
    />
  </Tab.Navigator>
);

const AppNavigator = () => {
    const { isAuthenticated } = useContext(AuthContext);

     return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isAuthenticated ? (
                    <>
                        <Stack.Screen name="Home" component={TabNavigator} />
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
