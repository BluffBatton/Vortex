// // src/navigation/RootNavigator.tsx
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import LoginScreen from '../../app/LoginScreen';
// import RegisterScreen from '../../app/RegisterScreen';
// import { useAuth } from '../context/AuthContext';
// import HomeScreen from '../../app/HomeScreen';
// import WalletScreen from '../../app/WalletScreen';
// import TabNavigator from './TabNavigator';
// import { Button } from 'react-native';

// const Stack = createNativeStackNavigator();

// export default function RootNavigator() {
//   const { authState } = useAuth();

//   return authState?.authenticated ? (
//     <TabNavigator /> 
//   ) : (
//     <Stack.Navigator>
//       <Stack.Screen 
//         name="Login" 
//         component={LoginScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen 
//         name="Register" 
//         component={RegisterScreen}
//         options={{ title: 'Регистрация' }}
//       />
//     </Stack.Navigator>
//   );
// }

