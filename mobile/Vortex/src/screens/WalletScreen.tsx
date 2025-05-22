// src/screens/WalletScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../context/AuthContext';

const WalletScreen = () => {
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
      console.error('Ошибка загрузки данных:', error);
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
    fetchWalletData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Загрузка данных...</Text>
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
      <Text style={styles.title}>Мой топливный кошелек</Text>
      
      <View style={styles.fuelBlock}>
        <Text style={styles.fuelTitle}>АИ-92</Text>
        <Text style={styles.fuelAmount}>{walletData.amount92.toFixed(2)} л</Text>
      </View>

      <View style={styles.fuelBlock}>
        <Text style={styles.fuelTitle}>АИ-95</Text>
        <Text style={styles.fuelAmount}>{walletData.amount95.toFixed(2)} л</Text>
      </View>

      <View style={styles.fuelBlock}>
        <Text style={styles.fuelTitle}>АИ-100</Text>
        <Text style={styles.fuelAmount}>{walletData.amount100.toFixed(2)} л</Text>
      </View>

      <View style={styles.fuelBlock}>
        <Text style={styles.fuelTitle}>Газ</Text>
        <Text style={styles.fuelAmount}>{walletData.amountGas.toFixed(2)} л</Text>
      </View>

      <View style={styles.fuelBlock}>
        <Text style={styles.fuelTitle}>Дизель</Text>
        <Text style={styles.fuelAmount}>{walletData.amountDiesel.toFixed(2)} л</Text>
      </View>
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
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
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