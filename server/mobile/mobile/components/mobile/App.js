import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Linking, Alert } from 'react-native';
import { listVehicles, createBooking, createWaveCheckout } from './services/api';
import CarCard from './components/CarCard';
import { SENEGAL } from './constants_config';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [vehicles, setVehicles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [booking, setBooking] = useState(null);
  const [checkout, setCheckout] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    listVehicles()
      .then((d) => setVehicles(d.vehicles || []))
      .catch((e) => setError(String(e)));
  }, []);

  const startBooking = async (vehicle) => {
    try {
      setSelected(vehicle);
      const payload = {
        vehicle_id: vehicle.id,
        renter_id: 'demo-renter',
        start_date: new Date().toISOString().slice(0,10),
        end_date: new Date(Date.now()+24*3600*1000).toISOString().slice(0,10),
        price_day_fcfa: vehicle.price_day_fcfa,
        fees_fcfa: 0,
        deposit_fcfa: vehicle.deposit_fcfa,
        total_fcfa: vehicle.price_day_fcfa + vehicle.deposit_fcfa
      };
      const b = await createBooking(payload);
      setBooking(b);
    } catch (e) {
      Alert.alert('Error', String(e));
    }
  };

  const payWithWave = async () => {
    try {
      if (!booking) return;
      const res = await createWaveCheckout({ booking_id: booking.id, amount_fcfa: booking.total_fcfa });
      setCheckout(res);
      if (res.checkout_url) Linking.openURL(res.checkout_url);
    } catch (e) {
      Alert.alert('Checkout error', String(e));
    }
  };

  return (
    <View style={{ flex: 1, paddingTop: 60 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center' }}>Cars221 — Dakar, Senegal</Text>
      <Text style={{ textAlign: 'center', marginBottom: 10 }}>
        Map default: {SENEGAL.center.lat}, {SENEGAL.center.lng} (zoom {SENEGAL.defaultZoom})
      </Text>

      {error && (
        <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
      )}

      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CarCard item={item} onPress={() => startBooking(item)} />
        )}
      />

      {selected && !checkout && (
        <View style={{ padding: 12, borderTopWidth: 1 }}>
          <Text>Booking: {selected.title}</Text>
          <Text>Total: {selected.price_day_fcfa + selected.deposit_fcfa} FCFA</Text>
          <Button title="Pay with Wave" onPress={payWithWave} />
        </View>
      )}

      {checkout && (
        <View style={{ padding: 12 }}>
          <Text>Checkout created. If it didn’t open, tap:</Text>
          <Button title="Open Wave Checkout" onPress={() => Linking.openURL(checkout.checkout_url)} />
        </View>
      )}

      <StatusBar style="auto" />
    </View>
  );
}