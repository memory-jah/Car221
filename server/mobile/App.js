import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';

export default function App() {
  const [tab, setTab] = useState('login'); // 'login' | 'signup'
  const [status, setStatus] = useState('');

  return (
    <View style={{ flex: 1, paddingTop: 60 }}>
      {/* simple tabs */}
      <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 16, marginBottom: 10 }}>
        <TouchableOpacity onPress={() => setTab('login')} style={{ paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderRadius: 6 }}>
          <Text style={{ fontWeight: tab==='login' ? '700' : '400' }}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab('signup')} style={{ paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderRadius: 6 }}>
          <Text style={{ fontWeight: tab==='signup' ? '700' : '400' }}>Sign up</Text>
        </TouchableOpacity>
      </View>

      {/* screen */}
      {tab === 'login' ? <LoginScreen /> : <SignupScreen />}

      {status ? <Text style={{ padding: 16 }}>{status}</Text> : null}
    </View>
  );
}