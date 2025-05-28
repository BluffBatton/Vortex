// App.tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GoogleSignin } from '@react-native-google-signin/google-signin';



export default function App() {
    useEffect(() => {
    GoogleSignin.configure({
    webClientId: '24222004042-agsts84ummsmrvq30j7mcm51ha2hqe74.apps.googleusercontent.com',
    offlineAccess: true
  })
  })
  return (
      <SafeAreaProvider>
        <AuthProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
          </AuthProvider>
      </SafeAreaProvider>
  );
}