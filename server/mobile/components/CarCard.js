import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function CarCard({ item, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ padding: 12, borderBottomWidth: 1 }}>
      <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
      <Text>{item.location?.address} • {item.price_day_fcfa} FCFA/jour</Text>
      <Text>{(item.transmission || '').toUpperCase()} • {(item.fuel_type || '').toUpperCase()}</Text>
    </TouchableOpacity>
  );
}