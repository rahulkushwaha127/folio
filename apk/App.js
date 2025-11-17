import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Modal,
} from 'react-native';
import DataList from './components/DataList';
import DetailsModal from './components/DetailsModal';
import { fetchContacts, fetchVisits } from './services/api';

export default function App() {
  const [dataType, setDataType] = useState('contacts'); // 'contacts' or 'visits'
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, [dataType]);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = dataType === 'contacts' 
        ? await fetchContacts() 
        : await fetchVisits();
      setData(result);
    } catch (error) {
      console.error(`Error loading ${dataType}:`, error);
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

  const handleDataTypeChange = (type) => {
    setDataType(type);
    setSelectedItem(null);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Toggle Buttons */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.toggleButton, dataType === 'contacts' && styles.activeButton]}
          onPress={() => handleDataTypeChange('contacts')}
        >
          <Text style={[styles.buttonText, dataType === 'contacts' && styles.activeButtonText]}>
            Contacts
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.toggleButton, dataType === 'visits' && styles.activeButton]}
          onPress={() => handleDataTypeChange('visits')}
        >
          <Text style={[styles.buttonText, dataType === 'visits' && styles.activeButtonText]}>
            Visits
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Loading {dataType}...</Text>
        </View>
      ) : (
        <DataList
          data={data}
          dataType={dataType}
          onItemSelect={handleItemSelect}
          onRefresh={loadData}
        />
      )}

      {/* Details Modal */}
      <DetailsModal
        visible={modalVisible}
        item={selectedItem}
        dataType={dataType}
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: '#4A90E2',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  activeButtonText: {
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
