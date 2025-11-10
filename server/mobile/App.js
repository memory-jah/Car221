import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Linking, Alert, TouchableOpacity } from 'react-native';
import { listVehicles, createBooking, createWaveCheckout } from './services/api';
import CarCard from './components/CarCard';
import AddVehicleForm from './components/AddVehicleForm';
import { SENEGAL } from './constants_config';
import { StatusBar } from 'expo-status-bar';

const COLORS = {
  primary: '#003366',
  accent: '#F5B800',
  bg: '#F7F7F7',
  text: '#111111'
};

export default function App() {
  const [vehicles, setVehicles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [booking, setBooking] = useState(null);
  const [checkout, setCheckout] = useState(null);
  const [error, setError] = useState(null);
  const [hostMode, setHostMode] = useState(false);
  const [adding, setAdding] = useState(false);

  const load = () => listVehicles().then((d) => setVehicles(d.vehicles || []));
  useEffect(() => { load().catch((e) => setError(String(e))); }, []);

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

  const Header = () => (
    <View style={{ paddingTop: 60, paddingBottom: 10, backgroundColor: COLORS.bg }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: COLORS.primary }}>
        Cars221 — Dakar, Senegal
      </Text>
      <Text style={{ textAlign: 'center', marginBottom: 10 }}>
        Map default: {SENEGAL.center.lat}, {SENEGAL.center.lng} (zoom {SENEGAL.defaultZoom})
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
        <TouchableOpacity onPress={() => { setHostMode(false); setAdding(false); }} style={{ padding: 8, backgroundColor: hostMode ? '#ddd' : COLORS.primary, borderRadius: 6 }}>
          <Text style={{ color: hostMode ? '#111' : '#fff' }}>Renter mode</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setHostMode(true); setAdding(false); }} style={{ padding: 8, backgroundColor: hostMode ? COLORS.primary : '#ddd', borderRadius: 6 }}>
          <Text style={{ color: hostMode ? '#fff' : '#111' }}>Host mode</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <Header />

      {error && <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>}

      {!hostMode && (
        <>
          <FlatList
            data={vehicles}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <CarCard item={item} onPress={() => startBooking(item)} />}
          />
          {selected && !checkout && (
            <View style={{ padding: 12, borderTopWidth: 1, backgroundColor: '#fff' }}>
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
        </>
      )}

      {hostMode && !adding && (
        <View style={{ padding: 12 }}>
          <Button title="Add a car" color={COLORS.primary} onPress={() => setAdding(true)} />
          <Text style={{ marginTop: 12, fontWeight: 'bold' }}>Your cars (all)</Text>
          <FlatList
            data={vehicles}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <CarCard item={item} onPress={() => {}} />}
          />
        </View>
      )}

      {hostMode && adding && (
        <AddVehicleForm onDone={() => { setAdding(false); load(); }} />
      )}

      <StatusBar style="auto" />
    </View>
  );
}