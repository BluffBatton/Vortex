// src/screens/WalletScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  Button,
} from 'react-native';
import axios from 'axios';
import { useAuth } from '../src/context/AuthContext';
import { API_URL } from '../src/context/AuthContext';
import { useRouter } from 'expo-router';  // ←

export default function WalletScreen() {
  const router = useRouter();            // ←
  const [walletData, setWalletData] = useState({
    amount92: 0,
    amount95: 0,
    amount100: 0,
    amountGas: 0,
    amountDiesel: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { authState, onLogout } = useAuth();

  const fetchWalletData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/user/wallet/`, {
        headers: {
          Authorization: `Bearer ${authState?.token}`,
        },
      });
      setWalletData(response.data);
    } catch (err) {
      console.error(err);
      Alert.alert('Ошибка', 'Не удалось загрузить данные кошелька');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  // Пока грузим — простой спиннер
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
        <RefreshControl refreshing={refreshing} onRefresh={fetchWalletData} />
      }
    >
      {/* 1) Кнопка «Выйти» */}
      <View style={styles.logoutButton}>
        <Button
          title="Выйти"
          onPress={async () => {
            await onLogout?.();
            router.replace('/login');  // ← перенаправляем на логин
          }}
        />
      </View>

      {/* 2) Заголовок и контент */}
      <Text style={styles.title}>Fuel Wallet</Text>
      {(['92', '95', '100', 'Gas', 'Diesel'] as const).map(key => (
        <View key={key} style={styles.fuelBlock}>
          <Text style={styles.fuelTitle}>{key}</Text>
          <Text style={styles.fuelAmount}>
            {/* @ts-ignore */}
            {walletData['amount' + (key === 'Gas' ? 'Gas' : key)]} л
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  logoutButton: {
    marginBottom: 20,       // отступ снизу, чтобы кнопка не слипалась с заголовком
    alignSelf: 'flex-end',  // кнопка справа
    width: 100,
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
