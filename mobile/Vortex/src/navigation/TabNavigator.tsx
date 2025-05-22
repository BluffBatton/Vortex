// // src/navigation/TabNavigator.tsx
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { MaterialIcons } from '@expo/vector-icons';
// import WalletScreen from '../../app/WalletScreen';

// const Tab = createBottomTabNavigator();

// export default function TabNavigator() {
//   return (
//     <Tab.Navigator
//       screenOptions={{
//         tabBarActiveTintColor: '#007bff',
//         tabBarInactiveTintColor: '#8e8e93',
//         tabBarStyle: {
//           paddingVertical: 5,
//           height: 60,
//         },
//         tabBarLabelStyle: {
//           fontSize: 12,
//           marginBottom: 5,
//         },
//       }}
//     >
//       <Tab.Screen 
//         name="Wallet" 
//         component={WalletScreen}
//         options={{
//           title: 'Кошелек',
//           tabBarIcon: ({ color, size }) => (
//             <MaterialIcons name="account-balance-wallet" size={size} color={color} />
//           ),
//           headerShown: false
//         }}
//       />
//     </Tab.Navigator>
//   );
// }