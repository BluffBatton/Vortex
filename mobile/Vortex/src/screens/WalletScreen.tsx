// src/screens/WalletScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Button } from 'react-native';
import axios from 'axios';
import { useAuth, API_URL } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';

type WalletScreenNavigationProp = {
  navigate: (screen: 'PurchaseFuel' | 'SpendFuel') => void;
};

const WalletScreen = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation<WalletScreenNavigationProp>();
  const [walletData, setWalletData] = useState({
    amount92: 0,
    amount95: 0,
    amount100: 0,
    amountGas: 0,
    amountDiesel: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { authState } = useAuth();

  const fetchWalletData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/user/wallet/`);
      setWalletData(response.data);
    } catch (error) {
      console.error('Loading data error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchWalletData();
  };

  useEffect(() => {
    {
      fetchWalletData();
    }
  }, [isFocused]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading data</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>Fuel Wallet</Text>
        <View style={{ marginBottom: 16 }}>
     </View>
      <View style={styles.fuelBlock}>
        <Text style={styles.fuelTitle}>92</Text>
        <Text style={styles.fuelAmount}>{walletData.amount92} L</Text>
      </View>

      <View style={styles.fuelBlock}>
        <Text style={styles.fuelTitle}>95</Text>
        <Text style={styles.fuelAmount}>{walletData.amount95} L</Text>
      </View>

      <View style={styles.fuelBlock}>
        <Text style={styles.fuelTitle}>100</Text>
        <Text style={styles.fuelAmount}>{walletData.amount100} L</Text>
      </View>

      <View style={styles.fuelBlock}>
        <Text style={styles.fuelTitle}>GAS</Text>
        <Text style={styles.fuelAmount}>{walletData.amountGas} L</Text>
      </View>

      <View style={styles.fuelBlock}>
        <Text style={styles.fuelTitle}>DIESEL</Text>
        <Text style={styles.fuelAmount}>{walletData.amountDiesel} L</Text>
      </View>

       <Button
         title="Buy Fuel"
         color="#135452"
         onPress={() => navigation.navigate('PurchaseFuel')}
       />
       <Button
       title = "Spend Fuel"
       color="#135452"
       onPress={() => navigation.navigate('SpendFuel')}
       />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 50,  // Добавлено
    marginBottom: 10,
    textAlign: 'center',
    color: '#135452',
  },
  fuelBlock: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fuelTitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
  },
  fuelAmount: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2c3e50',
  },
});

export default WalletScreen;