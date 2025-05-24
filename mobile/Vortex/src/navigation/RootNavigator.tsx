// src/navigation/RootNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import WalletScreen from '../screens/WalletScreen';
import PurchaseFuelScreen from '../screens/PurchaseFuelScreen';
import LiqPayScreen from '../screens/LiqPayScreen';
import SpendFuelScreen from '../screens/SpendFuelScreen';
import ProfileScreen from '../screens/ProfileScreen';
import StationsScreen from '../screens/StationsScreen';
import AchievementsScreen from '../screens/AchievementsScreen';
import TransactionHistoryScreen from '../screens/TransactionHistoryScreen';
//import { RootStackParamList } from './types';   // <— импорт

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Заглушки для других экранов
//const StationsScreen = () => null;
//const AchievementsScreen = () => null;
//const ProfileScreen = () => null;

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2c3e50',
        tabBarInactiveTintColor: '#95a5a6',
        tabBarStyle: {
          paddingVertical: 8,
          height: 60,
        },
        headerShown: false
      }}
    >
            {/* Заглушки для будущих экранов */}
            <Tab.Screen 
        name="Stations" 
        component={StationsScreen}
        options={{
          tabBarLabel: 'Stations',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="local-gas-station" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Wallet" 
        component={WalletScreen}
        options={{
          tabBarLabel: 'Wallet',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="account-balance-wallet" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Achievements" 
        component={AchievementsScreen}
        options={{
          tabBarLabel: 'Achievements',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="stars" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={26} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { authState } = useAuth();
  
  return authState?.authenticated ? (
    <Stack.Navigator>
      {/* 1) Главная вкладочная навигация */}
      <Stack.Screen
        name="Main"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      {/* 2) Экран покупки топлива */}
      <Stack.Screen
        name="PurchaseFuel"
        component={PurchaseFuelScreen}
        options={{ title: 'Purchase Fuel' }}
      />
      {/* 3) Экран платежей LiqPay */}
      <Stack.Screen
        name="LiqPay"
        component={LiqPayScreen}
        options={{ title: 'LiqPay Payment' }}
      />
      <Stack.Screen
      name = "SpendFuel"
      component={SpendFuelScreen}
      options={{title: 'Spend Fuel'}}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <Stack.Screen
      name="TransactionHistory"
      component={TransactionHistoryScreen}
      options={{ title: 'History', headerShown: false }}
      />
    </Stack.Navigator>
  ) : (
    <Stack.Navigator>
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{ title: 'Registration' }}
      />
    </Stack.Navigator>
  );
}