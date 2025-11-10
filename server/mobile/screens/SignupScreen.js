import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { signup } from '../services/api';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const signup = async () => {
    try {
      const res = await signup({ name, email, password });
      setMessage('✅ Signup successful');
    } catch (err) {
      setMessage('❌ Signup failed');
    }
  };

  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Create account
      </Text>

      <TextInput
        placeholder="Full name"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, padding: 10, marginBottom: 12 }}
      />

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
        onPress={signup}
        style={{ backgroundColor: 'black', padding: 14, borderRadius: 8 }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
          Sign up
        </Text>
      </TouchableOpacity>

      {message !== '' && <Text style={{ marginTop: 16 }}>{message}</Text>}
    </View>
  );
}