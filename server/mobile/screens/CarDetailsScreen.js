import React, { useState } from 'react';
import { View, Text, Button, Alert, Linking } from 'react-native';
import { createBooking, createWaveCheckout } from '../services/api';

export default function CarDetailsScreen({ vehicle, onBack, user }) {
  const [busy, setBusy] = useState(false);
  const total = (vehicle?.price_day_fcfa || 0) + (vehicle?.deposit_fcfa || 0);

  const bookNow = async () => {
    try {
      setBusy(true);
      // simple 1-day booking demo
      const start = new Date();
      const end = new Date(Date.now() + 24 * 3600 * 1000);

      const booking = await createBooking({
        vehicle_id: vehicle.id,
        renter_id: user?.id || 'demo-renter',    // <-- use logged-in user
        start_date: start.toISOString().slice(0, 10),
        end_date: end.toISOString().slice(0, 10),
        price_day_fcfa: vehicle.price_day_fcfa,
        deposit_fcfa: vehicle.deposit_fcfa || 0,
        total_fcfa: total
      });

      const pay = await createWaveCheckout({
        booking_id: booking.id,
        amount_fcfa: booking.total_fcfa
      });

      if (pay.checkout_url) {
        Linking.openURL(pay.checkout_url);
      } else {
        Alert.alert('Payment', 'No checkout URL returned');
      }
    } catch (e) {
      Alert.alert('Error', String(e));
    } finally {
      setBusy(false);
    }
  };

  if (!vehicle) {
    return (
      <View style={{ padding: 16 }}>
        <Text>No vehicle selected.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '700' }}>{vehicle.title}</Text>
      <Text style={{ marginTop: 6 }}>{vehicle.location?.address}</Text>
      <Text style={{ marginTop: 6 }}>Transmission: {vehicle.transmission}</Text>
      <Text style={{ marginTop: 6 }}>Fuel: {vehicle.fuel_type}</Text>
      <Text style={{ marginTop: 6 }}>Seats: {vehicle.seats}</Text>
      <Text style={{ marginTop: 10, fontWeight: '700' }}>
        Total (1 day): {total} FCFA
      </Text>

      <View style={{ height: 16 }} />

      <Button title="Book now → Wave" onPress={bookNow} disabled={busy} />

      <View style={{ height: 8 }} />
      <Button title="Back" onPress={onBack} />
    </View>
  );
}