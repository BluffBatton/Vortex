// src/screens/SpendFuelScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import { useAuth, API_URL } from '../context/AuthContext';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Header } from '../components/Header'
import Toast from 'react-native-toast-message';

type Wallet = {
  amount92: number;
  amount95: number;
  amount100: number;
  amountGas: number;
  amountDiesel: number;
};

type FuelType = '92' | '95' | '100' | 'Gas' | 'Diesel';

export default function SpendFuelScreen() {
  const { authState } = useAuth();
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();

  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFuel, setSelectedFuel] = useState<FuelType | null>(null);
  const [amount, setAmount] = useState<string>('');

  useEffect(() => {
    axios.get<Wallet>(`${API_URL}/api/user/wallet/`, {
      headers: { Authorization: `Bearer ${authState?.token}` },
    })
    .then(res => setWallet(res.data))
    .catch(err => {
      console.error(err);
      Alert.alert('Error', 'Unable to load wallet');
    })
    .finally(() => setLoading(false));
  }, []);

  if (loading || !wallet) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

    const colors: Record<string,string> = {
    '92': '#28A3DD',
    '95': '#3DBB65',
    '100': '#F1D91A',
    'Gas': '#E44DC3',
    'Diesel': '#DD3B3B',
  };

  const balanceFor = (fuel: FuelType) => {
    switch (fuel) {
      case '92': return wallet.amount92;
      case '95': return wallet.amount95;
      case '100': return wallet.amount100;
      case 'Gas': return wallet.amountGas;
      case 'Diesel': return wallet.amountDiesel;
    }
  };

  const amountNum = parseFloat(amount) || 0;

  const handleSpend = async () => {
    if (!selectedFuel) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `Choose fuel type`,
        position: 'bottom',
      });
      return;
    }
    if (amountNum <= 0) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `Enter valid fuel amount`,
        position: 'bottom',
      });
      return;
    }
    const available = balanceFor(selectedFuel);
    if (amountNum > available) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `You have only ${available} L`,
        position: 'bottom',
      });
      return;
    }

    try {
      const { data } = await axios.post(
        `${API_URL}/api/fuel-transactions/spend/`,
        { fuel_type: selectedFuel, amount: amountNum },
        { headers: { Authorization: `Bearer ${authState?.token}` } }
      );
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `You have spent ${data.amount} L of ${data.fuel_type} fuel`,
        position: 'bottom',
      });
      navigation.goBack();
    } catch (err: any) {

      console.error(err);
      Alert.alert('Error', err.response?.data?.detail || 'Unable to spend fuel');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header title="Spend Fuel" />

      <Text style={styles.sectionLabel}>Choose fuel type</Text>
      <View style={styles.grid}>
        {(['92','95','100','Gas','Diesel'] as FuelType[]).map(f => (
          <TouchableOpacity
            key={f}
            style={[
              styles.card,
              selectedFuel === f && styles.cardSelected
            ]}
            onPress={() => setSelectedFuel(f)}
            activeOpacity={0.8}
          >
            <View style={[styles.iconCircle, { backgroundColor: colors[f] }]}></View>
            <Text style={styles.cardTitle}>{f}</Text>
            <Text style={styles.cardSubtitle}>
              {balanceFor(f)} L
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Amount (L)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="10"
        value={amount}
        onChangeText={setAmount}
      />
      <Text style={styles.warning}>ALERT!</Text>
      <Text style={styles.underWarning}>After pressing button "Confirm Fuel Spending", there is no way of returning fuel back</Text>
      <TouchableOpacity style={styles.confirmButton} onPress={handleSpend}>
        <Text style={styles.confirmText}>Confirm Spend</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  warning: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
    color: "#135452"
  },
  underWarning: {
    fontSize: 16,
    color: "#135452"
  },
  container: { padding:16, backgroundColor:'#fff' },
  center: { flex:1, justifyContent:'center', alignItems:'center' },
  heading: { fontSize:20, fontWeight:'bold', marginBottom:16, textAlign:'center' },
  sectionLabel: {
    fontSize:16,
    color:'#444',
    marginTop: 20,
    marginBottom:12,
    fontWeight:'600'
  },

  grid: {
    flexDirection:'row',
    flexWrap:'wrap',
    justifyContent:'space-between'
  },

  balanceCard: {
    width:'48%',
    backgroundColor:'#f9f9f9',
    borderRadius:12,
    padding:16,
    marginBottom:12,
    alignItems:'center',
    shadowColor:'#000',
    shadowOffset:{ width:0, height:1 },
    shadowOpacity:0.1,
    shadowRadius:3,
    elevation:2
  },

  card: {
    width:'48%',
    backgroundColor:'#fff',
    borderRadius:12,
    padding:16,
    marginBottom:12,
    alignItems:'center',
    shadowColor:'#000',
    shadowOffset:{ width:0, height:1 },
    shadowOpacity:0.1,
    shadowRadius:3,
    elevation:2
  },
  cardSelected: {
    backgroundColor:'#f0f0f0'
  },

  iconCircle: {
    width:32,
    height:32,
    borderRadius:16,
    justifyContent:'center',
    alignItems:'center',
    marginBottom:8
  },
  cardTitle: {
    fontSize:18,
    fontWeight:'500',
    color:'#333'
  },
  cardSubtitle: {
    fontSize:14,
    color:'#666',
    marginTop:4
  },

  label: {
    fontSize:14,
    color:'#444',
    marginTop:16,
    marginBottom:8,
    fontWeight:'600'
  },
  input: {
    borderWidth:1,
    borderColor:'#ccc',
    borderRadius:8,
    padding:12,
    fontSize:16
  },

  confirmButton: {
    backgroundColor:'#135452',
    paddingVertical:14,
    borderRadius:12,
    alignItems:'center',
    marginTop:30
  },
  confirmText: {
    color:'#fff',
    fontSize:18,
    fontWeight:'600'
  },
});
