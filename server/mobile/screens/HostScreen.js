import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { createVehicle } from '../services/api';

export default function HostScreen() {
  const [title, setTitle] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [address, setAddress] = useState('Dakar');
  const [price, setPrice] = useState('');
  const [deposit, setDeposit] = useState('');
  const [transmission, setTransmission] = useState('automatic');
  const [fuel, setFuel] = useState('essence');
  const [seats, setSeats] = useState('5');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    try {
      setSaving(true);
      const payload = {
        title: title || `${make} ${model}`,
        make, model, year: Number(year) || 2020,
        plate: '',
        seats: Number(seats) || 5,
        transmission, fuel_type: fuel,
        features: ['AC'],
        photos: [],
        location: { lat: 14.7167, lng: -17.4677, address },
        price_day_fcfa: Number(price) || 15000,
        weekend_multiplier: 1.0,
        min_days: 1,
        deposit_fcfa: Number(deposit) || 30000,
        status: 'active'
      };
      await createVehicle(payload);
      Alert.alert('Success', 'Vehicle added!');
      setTitle(''); setMake(''); setModel(''); setYear('');
      setAddress('Dakar'); setPrice(''); setDeposit('');
      setTransmission('automatic'); setFuel('essence'); setSeats('5');
    } catch (e) {
      Alert.alert('Error', String(e));
    } finally {
      setSaving(false);
    }
  };

  const Box = ({ label, value, onChangeText, keyboardType='default' }) => (
    <View style={{ marginBottom: 10 }}>
      <Text style={{ marginBottom: 4 }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        style={{ borderWidth: 1, borderRadius: 8, padding: 10, backgroundColor: '#fff' }}
      />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 12 }}>Add a car</Text>

      <Box label="Title" value={title} onChangeText={setTitle} />
      <Box label="Make" value={make} onChangeText={setMake} />
      <Box label="Model" value={model} onChangeText={setModel} />
      <Box label="Year" value={year} onChangeText={setYear} keyboardType="number-pad" />
      <Box label="City/Address" value={address} onChangeText={setAddress} />
      <Box label="Price/day (FCFA)" value={price} onChangeText={setPrice} keyboardType="number-pad" />
      <Box label="Deposit (FCFA)" value={deposit} onChangeText={setDeposit} keyboardType="number-pad" />
      <Box label="Transmission (automatic/manual)" value={transmission} onChangeText={setTransmission} />
      <Box label="Fuel (essence/diesel)" value={fuel} onChangeText={setFuel} />
      <Box label="Seats" value={seats} onChangeText={setSeats} keyboardType="number-pad" />

      <TouchableOpacity
        onPress={save}
        disabled={saving}
        style={{ backgroundColor: '#003366', padding: 14, borderRadius: 8, marginTop: 6 }}
      >
        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>
          {saving ? 'Saving…' : 'Save car'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}