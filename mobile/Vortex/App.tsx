// App.tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Toast from 'react-native-toast-message';

export default function App() {
    useEffect(() => {
      GoogleSignin.configure({
            scopes: ['https://www.googleapis.com/auth/drive'],
            webClientId: '24222004042-agsts84ummsmrvq30j7mcm51ha2hqe74.apps.googleusercontent.com',
            iosClientId: 'iosClientId for iOS, nothing special here',
            offlineAccess: true,
            forceCodeForRefreshToken: true,
            profileImageSize: 120
      });
  })
  return (
      <SafeAreaProvider>
        <AuthProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
        <Toast />
          </AuthProvider>
      </SafeAreaProvider>
  );
}