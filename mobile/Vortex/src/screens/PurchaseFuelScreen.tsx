// src/screens/PurchaseFuelScreen.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import { useAuth, API_URL } from '../context/AuthContext';
import { Header } from '../components/Header'

type FuelPrice = {
  id: number;
  name: string;
  price: number; 
};

export default function PurchaseFuelScreen() {
  const { authState } = useAuth();
  const [prices, setPrices] = useState<FuelPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const [selectedFuel, setSelectedFuel] = useState<FuelPrice | null>(null);
  const [amount, setAmount] = useState<string>('');

  const [promo, setPromo] = useState<string>('');
  const [promoValid, setPromoValid] = useState<boolean | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  useEffect(() => {
    axios
      .get<FuelPrice[]>(`${API_URL}/api/global-fuel-prices/`, {
        headers: { Authorization: `Bearer ${authState?.token}` },
      })
      .then(res => {
        const clean = res.data.map(p => ({
          ...p,
          price: Number(p.price) || 0,
        }));
        setPrices(clean);
      })
      .catch(err => {
        console.error(err);
        Alert.alert('Error', 'Unable to load fuel prices');
      })
      .finally(() => setLoading(false));
  }, [isFocused]);

    const validatePromo = useCallback(async () => {
    if (!promo.trim()) {
      setPromoValid(null);
      setDiscountPercent(0);
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/api/promo/validate/`,
        { promo: promo.trim().toUpperCase() },
        { headers: { Authorization: `Bearer ${authState?.token}` } }
      );
      setPromoValid(true);
      setDiscountPercent(Number(res.data.discount_percent) || 0);
    } catch {
      setPromoValid(false);
      setDiscountPercent(0);
    }
  }, [promo, authState?.token]);

    useEffect(() => {
    // невеликая задержка перед проверкой, чтобы не спамить сервер
    const t = setTimeout(validatePromo, 500);
    return () => clearTimeout(t);
  }, [promo, validatePromo]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color = "#135452"/>
      </View>
    );
  }

  const amountNum = parseFloat(amount) || 0;
  const base = selectedFuel ? selectedFuel.price * amountNum : 0;
  const discount = base * (discountPercent / 100);
  const total = base - discount;
  const totalStr = total.toFixed(2);

  const onConfirm = () => {
    if (!selectedFuel) {
      Alert.alert('Error', 'Choose fuel type');
      return;
    }
    if (amountNum <= 0) {
      Alert.alert('Error', 'Enter valid fuel amount');
      return;
    }
    navigation.navigate('LiqPay', {
      amount: totalStr,
      liters: amount,
      fuel_type: selectedFuel.name,
    });
  };

    const colors: Record<string,string> = {
    '92': '#28A3DD',
    '95': '#3DBB65',
    '100': '#F1D91A',
    'Gas': '#E44DC3',
    'Diesel': '#DD3B3B',
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header title="Buy fuel" />

      <Text style={styles.sectionLabel}>Select fuel type</Text>
      <View style={styles.grid}>
        {prices.map(f => (
          <TouchableOpacity
            key={f.id}
            style={[
              styles.card,
              selectedFuel?.id === f.id && styles.cardSelected
            ]}
            onPress={() => setSelectedFuel(f)}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: colors[f.name] || '#ccc' }
              ]}
            >
            </View>
            <Text style={styles.cardTitle}>{f.name}</Text>
            <Text style={styles.cardSubtitle}>{f.price.toFixed(2)} ₴</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Amount (Liters)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="30"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>Promocode (Optional)</Text>
      <TextInput
        style={[
          styles.input,
          promoValid === true   && styles.inputValid,
          promoValid === false  && styles.inputInvalid
        ]}
        placeholder="ENTER CODE"
        value={promo}
        onChangeText={setPromo}
        autoCapitalize="characters"
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total Amount:</Text>
        <Text style={styles.totalValue}>{totalStr} ₴</Text>
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
        <Text style={styles.confirmText}>Confirm Purchase</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    inputValid: {
       borderColor:'#2ecc71' 
  },
    inputInvalid: { 
      borderColor:'#e74c3c' 
  },
    container: {
    padding:20,
    backgroundColor:'#fff'
  },
    center: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#fff'
  },
  heading: { 
    fontSize:20, 
    fontWeight:'bold', 
    marginBottom:16, 
    textAlign:'center' 
  },
  sectionLabel: {
    fontSize:16,
    color:'#444',
    left: 20,
    marginBottom:16,
    marginTop: 20
  },
  grid: {
    flexDirection:'row',
    flexWrap:'wrap',
    justifyContent:'center',
    gap: 20
  },
  card: {
    width:'40%',
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
    marginBottom:8
  },
  input: {
    borderWidth:1,
    borderColor:'#ccc',
    borderRadius:8,
    padding:12,
    fontSize:16
  },

  paymentRow: {
    flexDirection:'row',
    justifyContent:'space-between',
    marginTop:8
  },
  payButton: {
    flex:1,
    marginHorizontal:4,
    paddingVertical:12,
    borderRadius:8,
    borderWidth:1,
    borderColor:'#135452',
    alignItems:'center'
  },
  payButtonSelected: {
    backgroundColor:'#135452'
  },
  payText: {
    fontSize:16,
    color:'#135452'
  },
  payTextSelected: {
    color:'#fff'
  },

  totalContainer: {
    flexDirection:'row',
    justifyContent:'space-between',
    backgroundColor:'#f0f0f0',
    padding:12,
    borderRadius:8,
    marginTop:20
  },
  totalLabel: {
    fontSize:16,
    color:'#444'
  },
  totalValue: {
    fontSize:16,
    fontWeight:'600',
    color:'#333'
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
  }
});