import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

const DetailsModal = ({ visible, item, dataType, onClose }) => {
  if (!item) return null;

  const renderContactDetails = () => (
    <>
      <View style={styles.header}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarLargeText}>
            {item.name ? item.name.charAt(0).toUpperCase() : '?'}
          </Text>
        </View>
        <Text style={styles.name}>{item.name || 'Unknown'}</Text>
        <View style={[styles.statusBadge, item.status === 'new' && styles.statusNew]}>
          <Text style={styles.statusText}>{item.status || 'new'}</Text>
        </View>
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Email:</Text>
          <Text style={styles.detailValue}>{item.email || 'N/A'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>IP Address:</Text>
          <Text style={styles.detailValue}>{item.ip_address || 'N/A'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailValue}>
            {new Date(item.created_at).toLocaleString()}
          </Text>
        </View>
      </View>

      <View style={styles.messageCard}>
        <Text style={styles.sectionTitle}>Message</Text>
        <Text style={styles.messageText}>{item.message || 'No message'}</Text>
      </View>

      {item.user_agent && (
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>User Agent</Text>
          <Text style={styles.infoText}>{item.user_agent}</Text>
        </View>
      )}
    </>
  );

  const renderVisitDetails = () => (
    <>
      <View style={styles.header}>
        <View style={[styles.avatarLarge, styles.visitAvatar]}>
          <Text style={styles.avatarLargeText}>📍</Text>
        </View>
        <Text style={styles.name}>
          {item.country || item.city || 'Unknown Location'}
        </Text>
        <View style={styles.deviceBadge}>
          <Text style={styles.deviceText}>{item.device_type || 'Unknown'}</Text>
        </View>
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Location Information</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Country:</Text>
          <Text style={styles.detailValue}>{item.country || 'N/A'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Region:</Text>
          <Text style={styles.detailValue}>{item.region || 'N/A'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>City:</Text>
          <Text style={styles.detailValue}>{item.city || 'N/A'}</Text>
        </View>

        {item.timezone && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Timezone:</Text>
            <Text style={styles.detailValue}>{item.timezone}</Text>
          </View>
        )}
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Device Information</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Device:</Text>
          <Text style={styles.detailValue}>{item.device_type || 'N/A'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Browser:</Text>
          <Text style={styles.detailValue}>{item.browser || 'N/A'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>OS:</Text>
          <Text style={styles.detailValue}>{item.os || 'N/A'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>IP Address:</Text>
          <Text style={styles.detailValue}>{item.ip_address || 'N/A'}</Text>
        </View>
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Visit Information</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Page Visited:</Text>
          <Text style={styles.detailValue}>{item.page_visited || '/'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Visit Count:</Text>
          <Text style={styles.detailValue}>{item.visit_count || 1}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailValue}>
            {new Date(item.created_at).toLocaleString()}
          </Text>
        </View>

        {item.referrer && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Referrer:</Text>
            <Text style={styles.detailValue} numberOfLines={2}>{item.referrer}</Text>
          </View>
        )}
      </View>

      {item.user_agent && (
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>User Agent</Text>
          <Text style={styles.infoText}>{item.user_agent}</Text>
        </View>
      )}
    </>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <SafeAreaView style={styles.modalContent}>
            {/* Header with Close Button */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {dataType === 'contacts' ? 'Contact Details' : 'Visit Details'}
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
            >
              {dataType === 'contacts' ? renderContactDetails() : renderVisitDetails()}
            </ScrollView>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    flex: 1,
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  visitAvatar: {
    backgroundColor: '#4CAF50',
  },
  avatarLargeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
  },
  statusNew: {
    backgroundColor: '#4CAF50',
  },
  deviceBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#2196F3',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'uppercase',
  },
  deviceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  messageCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  messageText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
});

export default DetailsModal;

