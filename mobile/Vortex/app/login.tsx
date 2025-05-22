// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { router, useRouter } from 'expo-router';
// import { Button } from '@react-navigation/elements';
import { Button } from 'react-native';

export default function Login() {
  const router = useRouter();
  const { onLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handle = async () => {
    const res = await onLogin!(email, password);
    if (res?.error) {
      Alert.alert('Ошибка', res.message);
    } else {
      router.replace('/wallet');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Вход</Text>
      <TextInput style={styles.input} placeholder="Email" onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Пароль" secureTextEntry onChangeText={setPassword} />
      <Button title="Login" onPress={handle} />
      <Text style={styles.link} onPress={() => router.push('/register')}>
        Нет аккаунта? Зарегистрироваться
      </Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  link: {
    color: '#007bff',
    textAlign: 'center',
  },
});

//export default LoginScreen;