import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import api from '../services/api';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const login = async () => {
    try {
      const res = await api.post('/auth/login', { email, password });
      setMessage('✅ Login successful');
    } catch (err) {
      setMessage('❌ Login failed');
    }
  };

  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Login
      </Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 10, marginBottom: 12 }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 10, marginBottom: 12 }}
      />

      <TouchableOpacity
        onPress={login}
        style={{
          backgroundColor: 'black',
          padding: 14,
          borderRadius: 8,
          marginTop: 10,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
          Login
        </Text>
      </TouchableOpacity>

      {message !== '' && (
        <Text style={{ marginTop: 16 }}>{message}</Text>
      )}
    </View>
  );
}