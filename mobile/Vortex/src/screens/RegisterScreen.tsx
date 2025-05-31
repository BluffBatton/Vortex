// src/screens/RegisterScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

const RegisterScreen = ({ navigation }: any) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { onRegister } = useAuth();

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhone = (phone: string): boolean => {
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 10) return false;
    const re = /^\+?[\d\s\-()]{10,}$/;
    return re.test(phone);
  };

  const validatePassword = (password: string): boolean => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // min 8 symb, 1 letter and 1 numb
    return re.test(password);
  };

  const handleRegister = async () => {
    if (!firstName || !lastName || !phone || !email || !password) {
      Alert.alert('Error', 'Fill every field!');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Invalid email address');
      return;
    }
    if (!validatePhone(phone)) {
      Alert.alert('Error', 'Invalid phone number');
      return;
    }
    if (!validatePassword(password)) {
      Alert.alert(
        'Error',
        'Password must contain at least 8 symbols, including 1 letter and 1 number'
      );
      return;
    }
    setLoading(true);
    try {
      const result = await onRegister!(firstName, lastName, phone, email, password);
      if (result?.error) {
        Alert.alert('Sign Up Error', result.message);
      } else {
        Alert.alert('Success', 'You signed up successfully!');
        navigation.navigate('Login');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.head}>Vortex</Text>
      <Text style={styles.title}>Enroll</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Text style={styles.passwordHint}>
        Password must contain at least 8 symbols, including 1 letter and 1 number
      </Text>

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Loading' : 'Sign Up'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  passwordHint: {
    color: '#d0d0d0',
    fontSize: 12,
    marginBottom: 15
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#135452'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: 'white'
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: 'white'
    
  },
  button: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  link: {
    color: '#ffffff',
    textAlign: 'center',
    textDecorationLine: 'underline'
  },
  head: {
    textAlign: 'center',
    color: 'white',
    fontSize: 40,
    marginBottom: 20
  }
});

export default RegisterScreen;