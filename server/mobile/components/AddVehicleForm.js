import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { createVehicle } from '../services/api';

export default function AddVehicleForm({ onDone }) {
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

  const submit = async () => {
    try {
      const payload = {
        title,
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
      Alert.alert('Success', 'Vehicle added');
      onDone?.();
    } catch (e) {
      Alert.alert('Error', String(e));
    }
  };

  const Box = ({ label, value, onChangeText, keyboardType='default' }) => (
    <View style={{ marginBottom: 8 }}>
      <Text>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={{ borderWidth: 1, padding: 8, borderRadius: 6, backgroundColor: '#fff' }}
        keyboardType={keyboardType}
      />
    </View>
  );

  return (
    <View style={{ padding: 12 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>Add Vehicle</Text>
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
      <Button title="Save car" onPress={submit} />
      <View style={{ height: 8 }} />
      <Button title="Cancel" onPress={() => onDone?.()} />
    </View>
  );
}