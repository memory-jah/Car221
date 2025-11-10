import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { submitKyc, getKycStatus } from '../services/api';

export default function KycScreen({ user, onDone }) {
  const [idType, setIdType] = useState('permis'); // 'cni' or 'permis'
  const [idNumber, setIdNumber] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [status, setStatus] = useState('pending');

  const refresh = async () => {
    const r = await getKycStatus(user.id);
    setStatus(r.status);
  };

  useEffect(() => { refresh(); }, []);

  const submit = async () => {
    try {
      await submitKyc({
        user_id: user.id,
        id_type: idType,
        id_number: idNumber,
        photo_url: photoUrl || null
      });
      Alert.alert('Submitted', 'Your documents are under review.');
      await refresh();
    } catch (e) {
      Alert.alert('Error', 'Could not submit KYC.');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 10 }}>
        Identity verification
      </Text>
      <Text style={{ marginBottom: 16 }}>
        Upload Senegalese ID (CNI) or Driving License (Permis de conduire).
      </Text>

      <Text style={{ marginTop: 6, fontWeight: '600' }}>Document type</Text>
      <TextInput
        value={idType}
        onChangeText={setIdType}
        placeholder="cni or permis"
        style={{ borderWidth:1, padding:10, borderRadius:8, marginTop:6 }}
      />

      <Text style={{ marginTop: 12, fontWeight: '600' }}>ID number</Text>
      <TextInput
        value={idNumber}
        onChangeText={setIdNumber}
        placeholder="e.g., 1234567890"
        style={{ borderWidth:1, padding:10, borderRadius:8, marginTop:6 }}
      />

      <Text style={{ marginTop: 12, fontWeight: '600' }}>Photo URL (front)</Text>
      <TextInput
        value={photoUrl}
        onChangeText={setPhotoUrl}
        placeholder="https://image-hosting/your-id.jpg"
        style={{ borderWidth:1, padding:10, borderRadius:8, marginTop:6 }}
      />

      <TouchableOpacity
        onPress={submit}
        style={{ backgroundColor:'black', padding:14, borderRadius:8, marginTop:16 }}
      >
        <Text style={{ color:'#fff', textAlign:'center', fontWeight:'600' }}>
          Submit for review
        </Text>
      </TouchableOpacity>

      <Text style={{ marginTop: 16 }}>
        Status: <Text style={{ fontWeight:'700' }}>{status}</Text>
      </Text>

      {status === 'verified' && (
        <TouchableOpacity
          onPress={onDone}
          style={{ backgroundColor:'#0a7', padding:14, borderRadius:8, marginTop:12 }}
        >
          <Text style={{ color:'#fff', textAlign:'center', fontWeight:'600' }}>
            Continue to app
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}