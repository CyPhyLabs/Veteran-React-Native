// src/screens/HomeScreenStyles.js
import { StyleSheet } from 'react-native';

const NotificationStyles = StyleSheet.create({
  safeArea: {
      flex: 1,
      backgroundColor: '#D7E3F1', // set the background color for the safe area
  },
  container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#D7E3F1', // make sure container background color matches the safeArea color
  },
  headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
  },
  header: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#637D92',
  },
  loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: '#4F5892',
  },
  emptyText: {
      fontSize: 16,
      color: '#4F5892',
      textAlign: 'center',
      marginTop: 20,
  },
  modalBody: {
      fontSize: 16,
      marginBottom: 12,
  },
  modalPriority: {
      fontSize: 14,
      color: 'gray',
      marginBottom: 16,
  },

});

export default NotificationStyles;