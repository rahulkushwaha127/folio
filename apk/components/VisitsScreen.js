import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import DataList from './DataList';
import DetailsModal from './DetailsModal';
import { fetchVisits, fetchFilterOptions } from '../services/api';

const DATE_PRESETS = [
  { label: 'All', date_from: null, date_to: null },
  { label: 'Today', date_from: null, date_to: null, days: 0 },
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
];

const getDatePresetRange = (preset) => {
  if (!preset.days && preset.days !== 0) return { date_from: null, date_to: null };
  const to = new Date();
  const from = new Date();
  if (preset.days === 0) {
    from.setHours(0, 0, 0, 0);
    to.setHours(23, 59, 59, 999);
  } else {
    from.setDate(from.getDate() - preset.days);
  }
  return {
    date_from: from.toISOString().slice(0, 10),
    date_to: to.toISOString().slice(0, 10),
  };
};

const VisitsScreen = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterOptions, setFilterOptions] = useState({ countries: [], regions: [] });
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [filters, setFilters] = useState({
    country: null,
    region: null,
    date_from: null,
    date_to: null,
  });
  const [datePreset, setDatePreset] = useState(0);

  const loadFilterOptions = useCallback(async (country = null) => {
    try {
      const opts = await fetchFilterOptions(country);
      setFilterOptions(opts);
    } catch (e) {
      console.warn('Failed to load filter options', e);
    }
  }, []);

  const loadVisits = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const data = await fetchVisits(filters);
      setVisits(data);
    } catch (e) {
      setVisits([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters]);

  useEffect(() => {
    loadFilterOptions(filters.country);
  }, [loadFilterOptions, filters.country]);

  useEffect(() => {
    loadVisits();
  }, [loadVisits]);

  const handleApplyDatePreset = (index) => {
    setDatePreset(index);
    const preset = DATE_PRESETS[index];
    const range = getDatePresetRange(preset);
    setFilters((prev) => ({ ...prev, ...range }));
  };

  const handleSelectCountry = (country) => {
    setFilters((prev) => ({ ...prev, country: country || null, region: null }));
    setShowCountryModal(false);
  };

  const handleSelectRegion = (region) => {
    setFilters((prev) => ({ ...prev, region: region || null }));
    setShowRegionModal(false);
  };

  const handleClearFilters = () => {
    setFilters({ country: null, region: null, date_from: null, date_to: null });
    setDatePreset(0);
  };

  const handleRefresh = () => {
    loadVisits(true);
    loadFilterOptions(filters.country);
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const hasActiveFilters = filters.country || filters.region || filters.date_from || filters.date_to;

  return (
    <View style={styles.container}>
      {/* Filter Bar */}
      <View style={styles.filterBar}>
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterBtn, filters.country && styles.filterBtnActive]}
            onPress={() => setShowCountryModal(true)}
          >
            <Text style={[styles.filterBtnText, filters.country && styles.filterBtnTextActive]} numberOfLines={1}>
              {filters.country || 'Country'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterBtn, filters.region && styles.filterBtnActive]}
            onPress={() => setShowRegionModal(true)}
          >
            <Text style={[styles.filterBtnText, filters.region && styles.filterBtnTextActive]} numberOfLines={1}>
              {filters.region || 'Region'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.datePresets}>
          {DATE_PRESETS.map((preset, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.datePresetBtn, datePreset === index && styles.datePresetActive]}
              onPress={() => handleApplyDatePreset(index)}
            >
              <Text style={[styles.datePresetText, datePreset === index && styles.datePresetTextActive]}>
                {preset.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {hasActiveFilters && (
          <TouchableOpacity style={styles.clearBtn} onPress={handleClearFilters}>
            <Text style={styles.clearBtnText}>Clear filters</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Loading visits...</Text>
        </View>
      ) : (
        <DataList
          data={visits}
          dataType="visits"
          onItemSelect={handleItemSelect}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
      )}

      {/* Country Picker Modal */}
      <Modal visible={showCountryModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Country</Text>
            <TouchableOpacity onPress={() => handleSelectCountry(null)} style={styles.modalOption}>
              <Text style={styles.modalOptionText}>All countries</Text>
            </TouchableOpacity>
            <FlatList
              data={filterOptions.countries}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSelectCountry(item)} style={styles.modalOption}>
                  <Text style={styles.modalOptionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowCountryModal(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Region Picker Modal */}
      <Modal visible={showRegionModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Region / State</Text>
            <TouchableOpacity onPress={() => handleSelectRegion(null)} style={styles.modalOption}>
              <Text style={styles.modalOptionText}>All regions</Text>
            </TouchableOpacity>
            <FlatList
              data={filterOptions.regions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSelectRegion(item)} style={styles.modalOption}>
                  <Text style={styles.modalOptionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowRegionModal(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <DetailsModal
        visible={modalVisible}
        item={selectedItem}
        dataType="visits"
        onClose={() => { setModalVisible(false); setSelectedItem(null); }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  filterBar: {
    backgroundColor: '#fff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterRow: { flexDirection: 'row', marginBottom: 10 },
  filterBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  filterBtnActive: { backgroundColor: '#4A90E2' },
  filterBtnText: { fontSize: 14, color: '#666', textAlign: 'center' },
  filterBtnTextActive: { color: '#fff', fontWeight: '600' },
  datePresets: { flexDirection: 'row', flexWrap: 'wrap' },
  datePresetBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 6,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  datePresetActive: { backgroundColor: '#4A90E2' },
  datePresetText: { fontSize: 12, color: '#666' },
  datePresetTextActive: { color: '#fff', fontWeight: '600' },
  clearBtn: { marginTop: 8, alignSelf: 'flex-start' },
  clearBtnText: { fontSize: 12, color: '#d32f2f' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { marginTop: 12, fontSize: 16, color: '#666' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '70%',
    padding: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12, color: '#333' },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalOptionText: { fontSize: 16, color: '#333' },
  modalClose: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    borderRadius: 8,
  },
  modalCloseText: { color: '#fff', fontWeight: '600' },
});

export default VisitsScreen;
