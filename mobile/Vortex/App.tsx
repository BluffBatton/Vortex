// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '24222004042-0jqcc92htmgrken48a9hcjl0qglmen6m.apps.googleusercontent.com',
  offlineAccess: true
})

export default function App() {
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