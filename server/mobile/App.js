import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import VehiclesScreen from './screens/VehiclesScreen';
import CarDetailsScreen from './screens/CarDetailsScreen';
import HostScreen from './screens/HostScreen';
import MyBookingsScreen from './screens/MyBookingsScreen';
import KycScreen from './screens/KycScreen'; // <<< ADDED

export default function App() {
  // tabs: 'login' | 'signup' | 'kyc' | 'vehicles' | 'details' | 'host' | 'bookings'
  const [tab, setTab] = useState('login');
  const [token, setToken] = useState(null);
  const [me, setMe] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const onAuthed = (tokenValue, user) => {
    setToken(tokenValue);
    setMe(user);
    // Force KYC if not verified
    if (user?.kyc_status !== 'verified') {
      setTab('kyc');
    } else {
      setTab('vehicles');
    }
  };

  const openDetails = (vehicle) => {
    setSelectedVehicle(vehicle);
    setTab('details');
  };

  const backFromDetails = () => {
    setSelectedVehicle(null);
    setTab('vehicles');
  };

  const logout = () => {
    setToken(null);
    setMe(null);
    setSelectedVehicle(null);
    setTab('login');
  };

  const isKycGate = token && tab === 'kyc';

  return (
    <View style={{ flex: 1, paddingTop: 60 }}>
      {/* Tabs */}
      <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 16, marginBottom: 10, flexWrap:'wrap' }}>
        {!token && (
          <>
            <TouchableOpacity onPress={() => setTab('login')} style={{ padding:8, borderWidth:1, borderRadius:6 }}>
              <Text style={{ fontWeight: tab==='login' ? '700' : '400' }}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTab('signup')} style={{ padding:8, borderWidth:1, borderRadius:6 }}>
              <Text style={{ fontWeight: tab==='signup' ? '700' : '400' }}>Sign up</Text>
            </TouchableOpacity>
          </>
        )}

        {token && !isKycGate && (
          <>
            <TouchableOpacity onPress={() => setTab('vehicles')} style={{ padding:8, borderWidth:1, borderRadius:6 }}>
              <Text style={{ fontWeight: tab==='vehicles' ? '700' : '400' }}>Vehicles</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setTab('bookings')} style={{ padding:8, borderWidth:1, borderRadius:6 }}>
              <Text style={{ fontWeight: tab==='bookings' ? '700' : '400' }}>My bookings</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setTab('host')} style={{ padding:8, borderWidth:1, borderRadius:6 }}>
              <Text style={{ fontWeight: tab==='host' ? '700' : '400' }}>Host</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={logout} style={{ padding:8, borderWidth:1, borderRadius:6 }}>
              <Text>Logout</Text>
            </TouchableOpacity>
          </>
        )}

        {token && isKycGate && (
          <>
            <View style={{ padding:8, borderWidth:1, borderRadius:6, backgroundColor:'#eee' }}>
              <Text style={{ fontWeight:'700' }}>KYC Required</Text>
            </View>
            <TouchableOpacity onPress={logout} style={{ padding:8, borderWidth:1, borderRadius:6 }}>
              <Text>Logout</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Screens */}
      {!token && tab === 'login' && <LoginScreen onAuthed={onAuthed} />}
      {!token && tab === 'signup' && <SignupScreen onAuthed={onAuthed} />}

      {token && tab === 'kyc' && (
        <KycScreen
          user={me}
          onDone={() => setTab('vehicles')} // when status is verified
        />
      )}

      {token && tab === 'vehicles' && (
        <VehiclesScreen key={tab + Date.now()} onSelect={openDetails} />
      )}

      {token && tab === 'details' && (
        <CarDetailsScreen vehicle={selectedVehicle} onBack={backFromDetails} user={me} />
      )}

      {token && tab === 'host' && <HostScreen />}

      {token && tab === 'bookings' && <MyBookingsScreen renterId={me?.id} />}
    </View>
  );
}