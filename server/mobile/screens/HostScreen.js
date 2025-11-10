import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { createVehicle } from '../services/api';

export default function HostScreen({ user }) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [deposit, setDeposit] = useState('');

  const save = async () => {
    try {
      const res = await createVehicle({
        title,
        price_day_fcfa: Number(price),
        deposit_fcfa: Number(deposit),
        status: 'active',
        owner_id: user?.id || 'unknown'
      });
      Alert.alert('Success', 'Vehicle added ✅');
      setTitle(''); setPrice(''); setDeposit('');
    } catch (e) {
      Alert.alert('Error', 'Failed to add vehicle');
    }
  };

  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontWeight:'700', fontSize:20, marginBottom:20 }}>Add vehicle</Text>

      <TextInput placeholder="Title" value={title} onChangeText={setTitle}
        style={{ borderWidth:1, padding:10, marginBottom:12 }} />
      <TextInput placeholder="Price / day (FCFA)" keyboardType="numeric" value={price} onChangeText={setPrice}
        style={{ borderWidth:1, padding:10, marginBottom:12 }} />
      <TextInput placeholder="Deposit (FCFA)" keyboardType="numeric" value={deposit} onChangeText={setDeposit}
        style={{ borderWidth:1, padding:10, marginBottom:12 }} />

      <TouchableOpacity onPress={save} style={{ backgroundColor:'black', padding:14, borderRadius:8 }}>
        <Text style={{ color:'white', textAlign:'center', fontWeight:'600' }}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}