import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import VehiclesScreen from './screens/VehiclesScreen';
import CarDetailsScreen from './screens/CarDetailsScreen';

export default function App() {
  const [tab, setTab] = useState('login');   // 'login' | 'signup' | 'vehicles' | 'details'
  const [token, setToken] = useState(null);
  const [me, setMe] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const onAuthed = (t, user) => {
    setToken(t);
    setMe(user);
    setTab('vehicles');
  };

  const openDetails = (vehicle) => {
    setSelectedVehicle(vehicle);
    setTab('details');
  };

  const backFromDetails = () => {
    setSelectedVehicle(null);
    setTab('vehicles');
  };

  return (
    <View style={{ flex: 1, paddingTop: 60 }}>
      {/* simple tabs */}
      <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 16, marginBottom: 10, flexWrap:'wrap' }}>
        {!token && (
          <>
            <TouchableOpacity onPress={() => setTab('login')} style={{ paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderRadius: 6 }}>
              <Text style={{ fontWeight: tab==='login' ? '700' : '400' }}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTab('signup')} style={{ paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderRadius: 6 }}>
              <Text style={{ fontWeight: tab==='signup' ? '700' : '400' }}>Sign up</Text>
            </TouchableOpacity>
          </>
        )}
        {token && (
          <>
            <TouchableOpacity onPress={() => setTab('vehicles')} style={{ paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderRadius: 6 }}>
              <Text style={{ fontWeight: tab==='vehicles' ? '700' : '400' }}>Vehicles</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setToken(null); setMe(null); setSelectedVehicle(null); setTab('login'); }} style={{ paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderRadius: 6 }}>
              <Text>Logout</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* screens */}
      {!token && tab === 'login' && <LoginScreen onAuthed={onAuthed} />}
      {!token && tab === 'signup' && <SignupScreen onAuthed={onAuthed} />}
      {token && tab === 'vehicles' && <VehiclesScreen onSelect={openDetails} />}
      {token && tab === 'details' && <CarDetailsScreen vehicle={selectedVehicle} onBack={backFromDetails} />}
    </View>
  );
}