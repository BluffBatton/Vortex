// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { onLogin, onGoogleLogin } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Fill every field');
      return;
    }

    setLoading(true);
    try {
      const result = await onLogin!(email, password);
      if (result?.error) {
        Alert.alert('Login error', result.message);
      } 
      } catch (error) {
        Alert.alert('Error', 'Unable to log in: ' + error);
      } finally {
        setLoading(false);
      }
    };

    const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      const result = await onGoogleLogin!();
      if (result?.error) {
        Alert.alert('Google Login Error', result.message);
      } 

      } catch {
        Alert.alert('Error', 'Google login failed');
      } finally {
        setIsSubmitting(false);
      }
    };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome to Vortex</Text>
      <Text style={styles.underWelcome}>Gas stations platform</Text>
      <Text style={styles.title}>Log in your account</Text>
      
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

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Loading' : 'Login'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleGoogleSignIn}
        disabled={isSubmitting}
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? 'Please wait…' : 'Sign in with Google'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#135452'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#ffffff'
  },
  input: {
    height: 50,
    borderColor: '#f0f0f0',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#ffffff'
  },
  button: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'f0f0f0',
    fontWeight: 'bold',
  },
  link: {
    color: '#ffffff',
    textAlign: 'center',
    textDecorationLine: 'underline'
  },
  welcome:{
    textAlign: 'center',
    fontSize: 40,
    paddingBottom: 5,
    color: '#ffffff'
  },
  underWelcome:{
    textAlign: 'center',
    fontSize: 20,
    color: '#ffffff',
    paddingBottom: 50
  }
});

export default LoginScreen;