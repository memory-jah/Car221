import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { listBookings } from '../services/api';

export default function MyBookingsScreen({ renterId }) {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      setError('');
      const data = await listBookings({ renter_id: renterId });
      setBookings(data.bookings || []);
    } catch (e) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, [renterId]);
  const onRefresh = () => { setRefreshing(true); load(); };

  if (loading) return <View style={{ flex:1, justifyContent:'center' }}><ActivityIndicator /></View>;
  if (error) return <View style={{ padding:16 }}><Text style={{ color:'red' }}>{error}</Text></View>;

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <FlatList
        data={bookings}
        keyExtractor={(b) => b.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <View style={{ padding: 12, borderWidth: 1, borderRadius: 8, marginBottom: 10, backgroundColor: '#fff' }}>
            <Text style={{ fontWeight: '700' }}>Booking #{item.id}</Text>
            <Text>Vehicle: {item.vehicle_id}</Text>
            <Text>Dates: {item.start_date} → {item.end_date}</Text>
            <Text>Total: {item.total_fcfa} FCFA</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign:'center', marginTop:20 }}>No bookings yet.</Text>}
      />
    </View>
  );
}