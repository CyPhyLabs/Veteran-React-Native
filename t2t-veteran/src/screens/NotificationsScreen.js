import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { fetchMessages } from '../services/api';
import HomeStyles from '../styles/HomeStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import NotificationStyles from '../styles/NotificationStyles';

const NotificationsScreen = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                setLoading(true);
                const messages = await fetchMessages();

                const formattedNotifications = messages.map(item => ({
                    title: item.message.title,
                    body: item.message.body,
                    priority: item.message.priority,
                    id: item.message.message_id
                }));

                setNotifications(formattedNotifications);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        loadNotifications();
    }, []);

    const openModal = (notification) => {
        setSelectedNotification(notification);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedNotification(null);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            onPress={() => openModal(item)} 
            style={[
                HomeStyles.notificationItem, 
                item.priority === 'low' && { backgroundColor: 'rgb(254, 233, 225)' }
            ]}
        >
            <View style={HomeStyles.notificationContent}>
                <Text style={HomeStyles.notificationTitle}>{item.title}</Text>
                <Text style={HomeStyles.notificationBody}>{item.body}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={NotificationStyles.safeArea}>
            <View style={NotificationStyles.container}>
                <View style={NotificationStyles.headerContainer}>
                    <Text style={NotificationStyles.header}>Notifications</Text>
                    <Icon name="notifications-outline" size={24} color="#4F5892" />
                </View>
                {loading ? (
                    <View style={NotificationStyles.loadingContainer}>
                        <ActivityIndicator size="large" color="#4F5892" />
                        <Text style={NotificationStyles.loadingText}>Loading...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={notifications}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        ListEmptyComponent={
                            <Text style={NotificationStyles.emptyText}>No notifications available</Text>
                        }
                    />
                )}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={closeModal}
                >
                    <View style={HomeStyles.modalContainer}>
                        <View style={HomeStyles.modalContent}>
                            <Text style={HomeStyles.modalTitle}>{selectedNotification?.title}</Text>
                            <Text style={NotificationStyles.modalBody}>{selectedNotification?.body}</Text>
                            <Text style={NotificationStyles.modalPriority}>Priority: {selectedNotification?.priority}</Text>
                            <TouchableOpacity style={HomeStyles.closeButton} onPress={closeModal}>
                                <Text style={HomeStyles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
};

export default NotificationsScreen;