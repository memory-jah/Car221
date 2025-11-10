import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { getWalletBalance, getWalletTransactions, withdrawWallet } from '../services/api';

export default function WalletScreen({ user }) {
  const [balance, setBalance] = useState(0);
  const [tx, setTx] = useState([]);
  const [amount, setAmount] = useState('');
  const [last4, setLast4] = useState('');

  const load = async () => {
    const b = await getWalletBalance(user.id);
    setBalance(b.balance_fcfa || 0);
    const t = await getWalletTransactions(user.id);
    setTx(t.transactions || []);
  };

  useEffect(() => { load(); }, []);

  const withdraw = async () => {
    try {
      const amt = Number(amount);
      if (!amt || amt <= 0) return Alert.alert('Invalid amount');
      const r = await withdrawWallet({ user_id: user.id, amount_fcfa: amt, card_last4: last4 });
      setAmount(''); setLast4('');
      Alert.alert('Withdraw', `Payout: ${r.payout_fcfa} FCFA\nFee: ${r.fee_fcfa} FCFA`);
      await load();
    } catch {
      Alert.alert('Withdraw', 'Failed to withdraw');
    }
  };

  return (
    <View style={{ flex:1, padding:16 }}>
      <Text style={{ fontSize:22, fontWeight:'700' }}>Wallet</Text>
      <Text style={{ marginTop:8 }}>Balance: <Text style={{ fontWeight:'700' }}>{balance} FCFA</Text></Text>

      <View style={{ marginTop:16 }}>
        <Text style={{ fontWeight:'600' }}>Withdraw to Wave Visa (6% fee)</Text>
        <TextInput placeholder="Amount (FCFA)" keyboardType="numeric" value={amount} onChangeText={setAmount}
          style={{ borderWidth:1, padding:10, borderRadius:8, marginTop:6 }} />
        <TextInput placeholder="Card last 4 (optional)" keyboardType="numeric" value={last4} onChangeText={setLast4}
          style={{ borderWidth:1, padding:10, borderRadius:8, marginTop:6 }} />
        <TouchableOpacity onPress={withdraw} style={{ backgroundColor:'black', padding:14, borderRadius:8, marginTop:8 }}>
          <Text style={{ color:'#fff', textAlign:'center', fontWeight:'600' }}>Withdraw</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ marginTop:20, fontWeight:'700' }}>Transactions</Text>
      <FlatList
        data={tx}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={{ padding:10, borderWidth:1, borderRadius:8, marginTop:8, backgroundColor:'#fff' }}>
            <Text style={{ fontWeight:'600' }}>{item.type}</Text>
            <Text>Amount: {item.amount_fcfa} FCFA</Text>
            {item.fee_fcfa ? <Text>Fee: {item.fee_fcfa} FCFA</Text> : null}
            {item.payout_fcfa ? <Text>Payout: {item.payout_fcfa} FCFA</Text> : null}
            <Text style={{ color:'#555' }}>{item.ts}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ marginTop:8 }}>No transactions</Text>}
      />
    </View>
  );
}