// src/screens/PurchaseFuelScreen.tsx
import React, { useEffect, useState } from 'react';
import { useNavigation, CommonActions } from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { useAuth, API_URL } from '../context/AuthContext';

type FuelPrice = {
  id: number;
  name: string;    // '92', '95', '100', 'Gas', 'Diesel'
  price: number;   // цена за литр
};

export default function PurchaseFuelScreen() {
  const { authState } = useAuth();
  const [prices, setPrices] = useState<FuelPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [selectedFuel, setSelectedFuel] = useState<FuelPrice | null>(null);
  const [amount, setAmount] = useState<string>('');

  // 1) Получаем глобальные цены
  useEffect(() => {
    axios
      .get<FuelPrice[]>(`${API_URL}/api/global-fuel-prices/`, {
        headers: { Authorization: `Bearer ${authState?.token}` },
      })
      .then(res => setPrices(res.data))
      .catch(err => {
        console.error(err);
        Alert.alert('Ошибка', 'Не удалось загрузить цены на топливо');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 2) Рассчитываем итоговую сумму
  const amountNum = parseFloat(amount) || 0;
  const total = selectedFuel ? selectedFuel.price * amountNum : 0;
  const totalStr = total.toFixed(2);

  const handlePurchase = () => {
    if (!selectedFuel) {
      Alert.alert('Ошибка', 'Выберите тип топлива');
      return;
    }
    if (amountNum <= 0) {
      Alert.alert('Ошибка', 'Введите корректное количество литров');
      return;
    }

    navigation.navigate({
      name: 'LiqPay',
      params: {
        amount: totalStr,
        fuel_type: selectedFuel.name
      }
    } as never);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Покупка топлива</Text>

      <Text style={styles.label}>Выберите тип топлива:</Text>
      <View style={styles.buttonsRow}>
        {prices.map(f => (
          <TouchableOpacity
            key={f.id}
            style={[
              styles.fuelButton,
              selectedFuel?.id === f.id && styles.fuelButtonSelected,
            ]}
            onPress={() => setSelectedFuel(f)}
          >
            <Text
              style={[
                styles.fuelButtonText,
                selectedFuel?.id === f.id && styles.fuelButtonTextSelected,
              ]}
            >
              {f.name} ({f.price} ₴/л)
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Количество (л):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Например, 50"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.total}>
        Итоговая цена: {selectedFuel ? total.toFixed(2) : '—'} ₴
      </Text>

      <Button title="Купить" onPress={handlePurchase} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:16, backgroundColor:'#fff' },
  center: { flex:1, justifyContent:'center', alignItems:'center' },
  heading: { fontSize:20, fontWeight:'bold', marginBottom:16, textAlign:'center' },
  label: { marginTop:12, marginBottom:4 },
  buttonsRow: { flexDirection:'row', flexWrap:'wrap' },
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
  total: {
    fontSize:16,
    fontWeight:'600',
    marginVertical:12,
    textAlign:'center',
  },
});

    // try { 73
    //   await axios.post(
    //     `${API_URL}/api/fuel-transactions/`,
    //     {
    //       fuel_type: selectedFuel.name,
    //       amount: amountNum,
    //       price: totalStr,          // цена за всю покупку
    //       transaction_type: 'buy',
    //     },
    //     { headers: { Authorization: `Bearer ${authState?.token}` } }
    //   );
    //   Alert.alert('Успех', `Вы купили ${amountNum} л ${selectedFuel.name} за ${total.toFixed(2)} ₴`);

    //   navigation.dispatch(
    //     CommonActions.navigate({
    //     name: 'Main',
    //     params: {
    //     screen: 'Wallet',
    //       }
    //     })
    //   );
    //   setSelectedFuel(null);
    //   setAmount('');
    // } catch (error) {
    //   console.error(error);
    //   Alert.alert('Ошибка', 'Не удалось выполнить покупку топлива');
    // } 99