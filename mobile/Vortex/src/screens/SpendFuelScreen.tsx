// src/screens/SpendFuelScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import { useAuth, API_URL } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

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

  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFuel, setSelectedFuel] = useState<FuelType | null>(null);
  const [amount, setAmount] = useState<string>('');

  // 1) Загрузка баланса пользователя
  useEffect(() => {
    axios.get<Wallet>(`${API_URL}/api/user/wallet/`, {
      headers: { Authorization: `Bearer ${authState?.token}` },
    })
    .then(res => setWallet(res.data))
    .catch(err => {
      console.error(err);
      Alert.alert('Ошибка', 'Не удалось загрузить баланс');
    })
    .finally(() => setLoading(false));
  }, []);

  if (loading || !wallet) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 2) Проверим, есть ли топливо
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
      Alert.alert('Ошибка', 'Выберите тип топлива');
      return;
    }
    if (amountNum <= 0) {
      Alert.alert('Ошибка', 'Введите количество литров');
      return;
    }
    const available = balanceFor(selectedFuel);
    if (amountNum > available) {
      Alert.alert('Ошибка', `У вас только ${available} л`);
      return;
    }

    try {
      const { data } = await axios.post(
        `${API_URL}/api/fuel-transactions/spend/`,
        { fuel_type: selectedFuel, amount: amountNum },
        { headers: { Authorization: `Bearer ${authState?.token}` } }
      );
      Alert.alert('Успех', `Списано ${data.amount} л топлива типа ${data.fuel_type}`);
      // после списания обновим баланс и вернёмся назад
      navigation.goBack();
    } catch (err: any) {
      console.error(err);
      Alert.alert('Ошибка', err.response?.data?.detail || 'Не удалось списать топливо');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Потратить топливо</Text>

      <Text style={styles.label}>Ваш баланс:</Text>
      <View style={styles.balances}>
        {(['92','95','100','Gas','Diesel'] as FuelType[]).map(fuel => (
          <View key={fuel} style={styles.balanceRow}>
            <Text style={styles.balanceText}>{fuel}:</Text>
            <Text style={styles.balanceValue}>{balanceFor(fuel)} л</Text>
          </View>
        ))}
      </View>

      <Text style={styles.label}>Выберите тип топлива:</Text>
      <View style={styles.buttonsRow}>
        {(['92','95','100','Gas','Diesel'] as FuelType[]).map(fuel => (
          <TouchableOpacity
            key={fuel}
            style={[
              styles.fuelButton,
              selectedFuel === fuel && styles.fuelButtonSelected,
            ]}
            onPress={() => setSelectedFuel(fuel)}
          >
            <Text style={[
              styles.fuelButtonText,
              selectedFuel === fuel && styles.fuelButtonTextSelected,
            ]}>
              {fuel}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Количество (л):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Например, 10"
        value={amount}
        onChangeText={setAmount}
      />

      <Button title="Тратить" onPress={handleSpend} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding:16, backgroundColor:'#fff' },
  center: { flex:1, justifyContent:'center', alignItems:'center' },
  heading: { fontSize:20, fontWeight:'bold', marginBottom:16, textAlign:'center' },
  label: { marginTop:12, marginBottom:4, fontWeight:'600' },
  balances: { marginBottom:16 },
  balanceRow: { flexDirection:'row', justifyContent:'space-between', paddingVertical:4 },
  balanceText: { fontSize:16, color:'#333' },
  balanceValue: { fontSize:16, fontWeight:'600' },
  buttonsRow: { flexDirection:'row', flexWrap:'wrap', marginBottom:16 },
  fuelButton: {
    borderWidth:1,
    borderColor:'#888',
    borderRadius:4,
    padding:8,
    margin:4,
  },
  fuelButtonSelected: {
    backgroundColor:'#2c3e50',
    borderColor:'#2c3e50',
  },
  fuelButtonText: { color:'#2c3e50' },
  fuelButtonTextSelected: { color:'#fff' },
  input: {
    borderWidth:1,
    borderColor:'#ccc',
    borderRadius:4,
    padding:8,
    marginBottom:12,
  },
});
