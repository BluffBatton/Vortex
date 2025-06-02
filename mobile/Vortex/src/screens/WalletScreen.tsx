// src/screens/WalletScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Button, TouchableOpacity, Image } from 'react-native';
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

  const fuelCards = [
    { label: '92', amount: walletData.amount92, color: '#28A3DD' },
    { label: '95', amount: walletData.amount95, color: '#3DBB65' },
    { label: '100', amount: walletData.amount100, color: '#F1D91A' },
    { label: 'GAS', amount: walletData.amountGas, color: '#E44DC3' },
    { label: 'DIESEL', amount: walletData.amountDiesel, color: '#DD3B3B' },
  ];

return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.header}>Fuel Wallet</Text>

      <Text style={styles.walletLabel}>Wallet number</Text>
      <Text style={styles.walletNumber}>2132 5243 2342 3213</Text>

      <View style={styles.qrCodePlaceholder}>
        <Image
          source={require('../../assets/qr-placeholder.png')}
          style={{ width: 120, height: 120 }}
        />
      </View>

      <View style={styles.fuelGrid}>
        {fuelCards.map((fuel, index) => (
          <View key={index} style={styles.fuelCard}>
            <View style={[styles.iconCircle, { backgroundColor: fuel.color }]} />
            <Text style={styles.fuelType}>{fuel.label}</Text>
            <Text style={styles.fuelAmount}>{fuel.amount}L</Text>
          </View>
        ))}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('PurchaseFuel')}
        >
          <Text style={styles.buttonText}>Buy fuel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('SpendFuel')}
        >
          <Text style={styles.buttonText}>Spend fuel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  header: {
    fontSize: 24,
    fontWeight: 600,
    color: '#135452',
    marginTop: 50,
    left: -120
  },
  walletLabel: {
    marginTop: 10,
    fontSize: 18,
    color: '#444',
  },
  walletNumber: {
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 8,
  },
  qrCodePlaceholder: {
    marginVertical: 10,
    padding: 10,
  },
  fuelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginTop: 0,
  },
  fuelCard: {
    width: 100,
    height:100,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    margin: 6,
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginBottom: 4,
  },
  fuelType: {
    fontSize: 20,
    fontWeight: '500',
    color: '#333',
  },
  fuelAmount: {
    fontSize: 14,
    marginTop: 4,
    color: '#555',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    marginTop: 30,
  },
  actionButton: {
    backgroundColor: '#135452',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default WalletScreen;