// src/screens/HomeScreen.tsx
import { View, Text, Button } from 'react-native';
import { useAuth } from '../context/AuthContext';

const HomeScreen = () => {
  const { onLogout } = useAuth();
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome</Text>
      <Button title="Exit" onPress={onLogout} />
    </View>
  );
};

export default HomeScreen;