// // ../app/login.tsx
import {View, Image, Button, StyleSheet, Text, TextInput } from 'react-native';
import React, { useEffect, useState} from 'react';
import { API_URL, useAuth } from '@/context/auth/authProvider';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [first_name, setFirstName] = React.useState('');
  const [last_name, setLastName] = React.useState('');
  const [phone_number, setPhoneNumber] = React.useState('');
  const { onLogin, onRegister } = useAuth();

  useEffect(() => {
    const testCall = async () => {
      const result = await axios.get(`${API_URL}/api/user/wallet/`);
      
    }
    testCall();
  }, [])

  const login = async () => {
    const result = await onLogin!(email, password);
    if(result && result.error) {
      alert(result.message);
    }
  }

  const register = async () => {
    const result = await onRegister!(first_name, last_name, phone_number, email, password);
    if(result && result.error) {
      alert(result.message);
    }
    else{
      login();
    }
  }

  return (
    <View style={styles.container}>
        <Image source={require('../assets/logo.png')} style={styles.image} />
        <View style = {styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={first_name}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={last_name}
            onChangeText={setLastName}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phone_number}
            onChangeText={setPhoneNumber}
          />
          <Button title="Login" onPress={login} />
          <Button title="Register" onPress={register} />
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  image:{
    width: '50%',
    height: '50%',
    resizeMode: 'contain',
  },
  form:{
    gap: 10,
    width: '60%',
  },
  input:{
    height: 44,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
  },
  container:{
    alignItems: 'center',
    width: '100%',
  }
});

export default Login;