import { useEffect } from 'react';
import { View, Text, Alert } from 'react-native';

export const PingComponent = () => {
  const pingServer = async () => {
    try {
      const response = await fetch('http://10.0.2.2:8000/api/ping/', { 
      // const response = await fetch('http://localhost:8000/api/ping/', {
        method: 'GET',
      });
      
      if (response.ok) {
        Alert.alert('Success', 'Server is available');
      } else {
        Alert.alert('Error', `Status: ${response.status}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to connect to the server');
    }
  };

  useEffect(() => {
    pingServer();
  }, []);

  return (
    <View>
      <Text>Test</Text>
    </View>
  );
};