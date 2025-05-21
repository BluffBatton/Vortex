import { useEffect } from 'react';
import { View, Text, Alert } from 'react-native';

export const PingComponent = () => {
  const pingServer = async () => {
    try {
      const response = await fetch('http://10.0.2.2:8000/api/ping/', { // Для Android эмулятора
      // const response = await fetch('http://localhost:8000/api/ping/', { // Для iOS эмулятора
        method: 'GET',
      });
      
      if (response.ok) {
        Alert.alert('Успех', 'Сервер доступен');
      } else {
        Alert.alert('Ошибка', `Статус: ${response.status}`);
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось подключиться к серверу');
    }
  };

  useEffect(() => {
    pingServer();
  }, []);

  return (
    <View>
      <Text>Проверка соединения...</Text>
    </View>
  );
};