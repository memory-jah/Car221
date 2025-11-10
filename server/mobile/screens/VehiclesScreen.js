// server/mobile/screens/VehiclesScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { listVehicles } from '../services/api';
import CarCard from '../components/CarCard';

export default function VehiclesScreen({ onSelect }) {
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      setError('');
      const data = await listVehicles();
      setVehicles(data.vehicles || []);
    } catch (e) {
      setError('Failed to load vehicles');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { 
  const unsub = navigation?.addListener('focus', load);
  return unsub;
}, [navigation]);
  const onRefresh = () => { setRefreshing(true); load(); };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ padding: 16 }}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CarCard item={item} onPress={() => onSelect && onSelect(item)} />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            No cars yet.
          </Text>
        }
      />
    </View>
  );
}