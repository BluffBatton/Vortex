// src/screens/LiqPayScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRoute, useNavigation, CommonActions } from '@react-navigation/native';
import { API_URL } from '../context/AuthContext';

export default function LiqPayScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { amount, fuel_type } = route.params;
  const [html, setHtml] = useState<string|null>(null);

  useEffect(() => {
    // Запросим HTML-форму у Django
    fetch(
      `${API_URL}/api/liqpay/pay/?amount=${amount}&fuel_type=${encodeURIComponent(fuel_type)}`,
      { headers: { 'Accept': 'text/html' } }
    )
      .then(res => res.text())
      .then(setHtml)
      .catch(err => {
        console.error(err);
        Alert.alert('Ошибка', 'Не удалось загрузить форму оплаты');
      });
  }, []);

  const onNavigationStateChange = (navState: any) => {
    // Если WebView перешёл на ваш result_url — значит оплата завершена
    if (navState.url.includes('/api/liqpay/result/')) {
      // Возвращаемся в Wallet и обновляем его
      navigation.dispatch(
        CommonActions.navigate({
          name: 'Main',
          params: { screen: 'Wallet' },
        })
      );
    }
  };

  if (!html) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html }}
      onNavigationStateChange={onNavigationStateChange}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex:1, justifyContent:'center', alignItems:'center' },
});
