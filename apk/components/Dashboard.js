import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { fetchReport } from '../services/api';

const Dashboard = ({ onRefresh }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadReport = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const data = await fetchReport();
      setReport(data);
    } catch (error) {
      setReport(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const handleRefresh = () => {
    loadReport(true);
    onRefresh?.();
  };

  if (loading && !report) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading report...</Text>
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load report</Text>
        <Text style={styles.errorSubtext}>Pull down to retry</Text>
      </View>
    );
  }

  const stats = report.statistics || {};
  const topCountries = report.top_countries || [];
  const topPages = report.top_pages || [];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <Text style={styles.title}>Analytics Report</Text>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={styles.statCardInner}>
            <Text style={styles.statValue}>{stats.unique_visitors ?? '—'}</Text>
            <Text style={styles.statLabel}>Unique Visitors</Text>
          </View>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statCardInner}>
            <Text style={styles.statValue}>{stats.total_visits ?? '—'}</Text>
            <Text style={styles.statLabel}>Total Visits</Text>
          </View>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statCardInner}>
            <Text style={styles.statValue}>{stats.countries ?? '—'}</Text>
            <Text style={styles.statLabel}>Countries</Text>
          </View>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statCardInner}>
            <Text style={styles.statValue}>{stats.days_active ?? '—'}</Text>
            <Text style={styles.statLabel}>Days Active</Text>
          </View>
        </View>
      </View>

      {topCountries.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Countries</Text>
          <View style={styles.listCard}>
            {topCountries.map((item, index) => (
              <View key={index} style={styles.listRow}>
                <Text style={styles.listLabel} numberOfLines={1}>
                  {item.country || 'Unknown'}
                </Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.visits}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {topPages.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Pages</Text>
          <View style={styles.listCard}>
            {topPages.map((item, index) => (
              <View key={index} style={styles.listRow}>
                <Text style={styles.listLabel} numberOfLines={1}>
                  {item.page_visited || '/'}
                </Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.visits}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16, paddingBottom: 32 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { marginTop: 12, fontSize: 16, color: '#666' },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: { fontSize: 18, color: '#d32f2f', fontWeight: '600' },
  errorSubtext: { marginTop: 8, fontSize: 14, color: '#999' },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 24,
  },
  statCard: {
    width: '50%',
    padding: 6,
  },
  statCard1: {},
  statCard2: {},
  statCard3: {},
  statCard4: {},
  statCardInner: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
  },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  listCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  listLabel: { flex: 1, fontSize: 14, color: '#333', marginRight: 12 },
  badge: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { fontSize: 12, fontWeight: '600', color: '#fff' },
});

export default Dashboard;
