import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';

const DataList = ({ data, dataType, onItemSelect, onRefresh }) => {
  const renderContactItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => onItemSelect(item)}
      activeOpacity={0.7}
    >
      <View style={styles.itemHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.name ? item.name.charAt(0).toUpperCase() : '?'}
          </Text>
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{item.name || 'Unknown'}</Text>
          <Text style={styles.itemSubtitle}>{item.email || 'No email'}</Text>
        </View>
      </View>
      <View style={styles.itemMeta}>
        <View style={[styles.statusBadge, item.status === 'new' && styles.statusNew]}>
          <Text style={styles.statusText}>{item.status || 'new'}</Text>
        </View>
        <Text style={styles.dateText}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderVisitItem = ({ item }) => {
    const location = [item.country, item.region, item.city]
      .filter(Boolean)
      .join(', ') || 'Unknown Location';
    
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => onItemSelect(item)}
        activeOpacity={0.7}
      >
        <View style={styles.itemHeader}>
          <View style={[styles.avatar, styles.visitAvatar]}>
            <Text style={styles.avatarText}>📍</Text>
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle} numberOfLines={1}>
              {location}
            </Text>
            <View style={styles.visitSubtitleRow}>
              <Text style={styles.itemSubtitle}>
                {item.device_type || 'Unknown Device'}
              </Text>
              <View style={styles.visitCountBadge}>
                <Text style={styles.visitCountText}>
                  {item.visit_count || 1} {item.visit_count === 1 ? 'visit' : 'visits'}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.itemMeta}>
          <View style={styles.locationDetails}>
            {item.country && (
              <Text style={styles.locationText}>🌍 {item.country}</Text>
            )}
            {item.region && (
              <Text style={styles.locationText}>📍 {item.region}</Text>
            )}
            {item.city && (
              <Text style={styles.locationText}>🏙️ {item.city}</Text>
            )}
          </View>
          <Text style={styles.dateText}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={dataType === 'contacts' ? renderContactItem : renderVisitItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContainer}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={onRefresh} />
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No {dataType} found</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  item: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  visitAvatar: {
    backgroundColor: '#4CAF50',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  itemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
  },
  statusNew: {
    backgroundColor: '#4CAF50',
  },
  deviceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
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
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  visitSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  visitCountBadge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: '#FF9800',
  },
  visitCountText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  locationDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  locationText: {
    fontSize: 11,
    color: '#666',
    marginRight: 12,
    marginBottom: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default DataList;

