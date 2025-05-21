// ../app/wallet.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider, useAuth } from '../context/auth/authProvider';
import { useRouter } from 'expo-router';

interface Wallet {
  amount92: number;
  amount95: number;
  amount100: number;
  amountGas: number;
  amountDiesel: number;
}

export default function Wallet() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const { onLogout } = useAuth();
  const router = useRouter();

useEffect(() => {
  axios.get('http://10.0.2.2:8000/api/user/wallet/')
    .then(res => setWallet(res.data))
    .catch(() => router.replace('../login'));
}, []);

  if (!wallet) return <ActivityIndicator style={{ flex:1 }} />;

//   return (
//     <View style={styles.container}>
//       <Text>92: {wallet.amount92} л</Text>
//       <Text>95: {wallet.amount95} л</Text>
//       <Text>100: {wallet.amount100} л</Text>
//       <Text>Gas: {wallet.amountGas} л</Text>
//       <Text>Diesel: {wallet.amountDiesel} л</Text>
//       <Button title="Logout" onPress={() => { onLogout(); router.replace('../login'); }} />
//     </View>
//   );
// }

const styles = StyleSheet.create({
  container: { flex:1, padding:20, justifyContent:'center' },
  })}
