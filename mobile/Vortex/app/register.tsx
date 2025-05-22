// src/screens/RegisterScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Button } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { router } from 'expo-router';

const RegisterScreen = ({ navigation }: any) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { onRegister } = useAuth();

  const handleRegister = async () => {
    if (!firstName || !lastName || !phone || !email || !password) {
      Alert.alert('Error', 'Fill all fields');
      return;
    }

    setLoading(true);
    try {
      const result = await onRegister!(firstName, lastName, phone, email, password);
      if (result?.error) {
        Alert.alert('Registration error', result.message);
      } else {
        Alert.alert('Success', 'Registration was successful!');
        navigation.navigate('Login');
      }
    } catch (error) {
      Alert.alert('Error', 'Registration was failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Регистрация</Text>
      <TextInput style={styles.input} placeholder="Имя" value={firstName} onChangeText={setFirstName} />
      <TextInput style={styles.input} placeholder="Фамилия" value={lastName} onChangeText={setLastName} />
      <TextInput style={styles.input} placeholder="Телефон" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Пароль" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Зарегистрироваться" onPress={handleRegister} />
      <Text style={styles.link} onPress={() => router.push('/login')}>
        Уже есть аккаунт? Войти
      </Text>
    </View>
  );
};

// Используйте те же стили что и в LoginScreen
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

export default RegisterScreen;