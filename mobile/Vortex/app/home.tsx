// src/screens/HomeScreen.tsx
import { View, Text, Button } from 'react-native';
import { useAuth } from '../src/context/AuthContext';

const HomeScreen = () => {
  const { onLogout } = useAuth();
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Добро пожаловать!</Text>
      <Button title="Выйти" onPress={onLogout} />
    </View>
  );
};

export default HomeScreen;