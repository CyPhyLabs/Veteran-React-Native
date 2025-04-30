import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import HomeStyles from '../styles/HomeStyles';
import { fetchMessages } from '../services/api';

const HomeScreen = () => {
  // #region Authentication and User Data
  const { logout } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const { getItem } = useAsyncStorage('username');
  // #endregion

  // #region State Variables
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
  const [activeNotificationTab, setActiveNotificationTab] = useState('unread');
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // #endregion

  // #region Navigation Hook
  const navigation = useNavigation();
  // #endregion

  // #region useEffect Hooks
  useEffect(() => {
    const fetchUsername = async () => {
      const storedUsername = await getItem();
      if (storedUsername) {
        setUsername(storedUsername);
      }
    };

    fetchUsername();
  }, [getItem]);

  useEffect(() => {
    fetchNotifications();
  }, []);
  // #endregion

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchMessages();

      const formattedNotifications = data.map((item) => ({
        title: item.message.title,
        body: item.message.body,
        priority: item.message.priority,
        read: false,
        id: item.message.message_id,
      }));

      setNotifications(formattedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // #region Modal Toggles
  const toggleSettingsModal = useCallback(() => {
    setIsSettingsModalVisible((prev) => !prev);
  }, []);
  // #endregion
  const StarBackground = useMemo(
    () => (
      <View style={HomeStyles.starBackground}>
        {[...Array(20)].map((_, rowIndex) => (
          <View
            key={`row-${rowIndex}`}
            style={[
              HomeStyles.starRow,
              rowIndex % 2 === 1 && HomeStyles.staggeredRow
            ]}
          >
            {[...Array(10)].map((_, colIndex) => (
              <View key={`star-${rowIndex}-${colIndex}`}>
                <Icon
                  name="star"
                  size={25}
                  style={HomeStyles.star}
                  color={`rgba(255, 255, 255, ${1 - rowIndex * 0.1})`}
                />
              </View>
            ))}
          </View>
        ))}
      </View>
    ),
    []
  );
  // #region Rendered Components
  const HeaderSection = useMemo(
    () => (
      <View style={HomeStyles.header}>
        <View style={HomeStyles.usernameContainer}>
          <Text style={HomeStyles.username}>Welcome, {username}!</Text>
        </View>

        <TouchableOpacity
          style={HomeStyles.settingsButton}
          onPress={toggleSettingsModal}
        >
          <Icon name="settings-outline" size={24} color="#885053" />
        </TouchableOpacity>
      </View>
    ),
    [username, toggleSettingsModal],
  );

  const NotificationsSection = useMemo(
    () => (
      <View style={HomeStyles.sectionContainer}>
        <View style={HomeStyles.sectionTextContainer}>
          <Text style={HomeStyles.sectionText}>Notifications</Text>
          <Icon
            name="notifications-outline"
            size={20}
            color="#885053"
            style={HomeStyles.sectionIcon}
          />
        </View>

        <View style={HomeStyles.ovalContainer}>
          <TouchableOpacity
            style={[
              HomeStyles.tab,
              activeNotificationTab === 'unread' && HomeStyles.activeTab,
            ]}
            onPress={() => setActiveNotificationTab('unread')}
          >
            <Text
              style={[
                HomeStyles.tabText,
                activeNotificationTab === 'unread' && HomeStyles.activeTabText,
              ]}
            >
              Unread
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              HomeStyles.tab,
              activeNotificationTab === 'read' && HomeStyles.activeTab,
            ]}
            onPress={() => setActiveNotificationTab('read')}
          >
            <Text
              style={[
                HomeStyles.tabText,
                activeNotificationTab === 'read' && HomeStyles.activeTabText,
              ]}
            >
              Read
            </Text>
          </TouchableOpacity>
        </View>

        {notifications.length > 0 ? (
          notifications
            .filter((notification) =>
              activeNotificationTab === 'unread'
                ? !notification.read
                : notification.read,
            )
            .slice(0, 3)
            .map((notification, index) => (
              <View
                key={index}
                style={[
                  HomeStyles.notificationItem,
                  notification.priority === 'low' && {
                    borderColor: 'rgba(255, 0, 0, 0.42)',
                  },
                  { borderRadius: 10 },
                  { borderWidth: 2 },
                ]}
              >
                <View style={HomeStyles.notificationContent}>
                  <Text style={HomeStyles.notificationTitle}>
                    {notification.title}
                  </Text>
                  <Text style={HomeStyles.notificationBody}>
                    {notification.body}
                  </Text>
                </View>
              </View>
            ))
        ) : (
          <Text style={HomeStyles.noNotificationsText}>
            {isLoading ? 'Loading notifications' : 'No notifications'}
          </Text>
        )}
        <TouchableOpacity
          style={HomeStyles.viewAllButton}
          onPress={() =>
            navigation.navigate('Notifications', {
              initialTab: activeNotificationTab,
            })
          }
        >
          <Text style={HomeStyles.viewAllText}>View All</Text>
          <Icon name="chevron-forward" size={16} color="#29384B" />
        </TouchableOpacity>
      </View>
    ),
    [activeNotificationTab, notifications, isLoading],
  );
  const UpcomingEventsSection = useMemo(
    () => (
      <View style={HomeStyles.sectionContainer}>
        <View style={HomeStyles.sectionTextContainer}>
          <Text style={HomeStyles.sectionText}>Upcoming Events</Text>
          <Icon
            name="calendar-outline"
            size={20}
            color="#885053"
            style={HomeStyles.sectionIcon}
          />
        </View>
      </View>
    ),
    [],
  );
  const SettingsModal = useMemo(
    () => (
      <Modal
        animationType="fade" // changed from "slide" to "fade"
        transparent={true}
        visible={isSettingsModalVisible}
        onRequestClose={toggleSettingsModal}
      >
        <TouchableOpacity
          style={HomeStyles.modalContainer}
          activeOpacity={1}
          onPress={toggleSettingsModal}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={e => e.stopPropagation()}
          >
            <View style={HomeStyles.modalContent}>
              <Text style={HomeStyles.modalTitle}>Settings</Text>
              <TouchableOpacity
                onPress={logout}
                style={HomeStyles.logoutButton}
                activeOpacity={0.8}
              >
                <Text style={HomeStyles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={toggleSettingsModal}
                style={HomeStyles.closeButton}
                activeOpacity={0.8}
              >
                <Text style={HomeStyles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    ),
    [isSettingsModalVisible, toggleSettingsModal, logout]
  );
  // #endregion

  return (
    <SafeAreaView style={HomeStyles.container}>
      <View style={HomeStyles.contentContainer}>
        {StarBackground}
        <View style={HomeStyles.gradientOverlay} />
        {HeaderSection}
        {NotificationsSection}
        {UpcomingEventsSection}
        {SettingsModal}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;