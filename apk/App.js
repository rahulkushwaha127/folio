import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import DataList from './components/DataList';
import DetailsModal from './components/DetailsModal';
import Dashboard from './components/Dashboard';
import VisitsScreen from './components/VisitsScreen';
import { fetchContacts } from './services/api';

export default function App() {
  const [screen, setScreen] = useState('dashboard'); // 'dashboard' | 'contacts' | 'visits'
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (screen === 'contacts') loadContacts();
  }, [screen]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const result = await fetchContacts();
      setContacts(result);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const handleScreenChange = (s) => {
    setScreen(s);
    setSelectedItem(null);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Tab Navigation */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.tabButton, screen === 'dashboard' && styles.activeTab]}
          onPress={() => handleScreenChange('dashboard')}
        >
          <Text style={[styles.tabText, screen === 'dashboard' && styles.activeTabText]}>
            Dashboard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, screen === 'contacts' && styles.activeTab]}
          onPress={() => handleScreenChange('contacts')}
        >
          <Text style={[styles.tabText, screen === 'contacts' && styles.activeTabText]}>
            Contacts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, screen === 'visits' && styles.activeTab]}
          onPress={() => handleScreenChange('visits')}
        >
          <Text style={[styles.tabText, screen === 'visits' && styles.activeTabText]}>
            Visits
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {screen === 'dashboard' && (
        <Dashboard onRefresh={() => {}} />
      )}
      {screen === 'contacts' && (
        loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text style={styles.loadingText}>Loading contacts...</Text>
          </View>
        ) : (
          <DataList
            data={contacts}
            dataType="contacts"
            onItemSelect={handleItemSelect}
            onRefresh={loadContacts}
          />
        )
      )}
      {screen === 'visits' && <VisitsScreen />}

      {/* Details Modal (contacts only) */}
      <DetailsModal
        visible={modalVisible}
        item={selectedItem}
        dataType="contacts"
        onClose={handleCloseModal}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginHorizontal: 2,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#4A90E2',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
});
