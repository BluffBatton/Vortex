// src/screens/ProfileScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { useAuth, API_URL } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
type ProfileData = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
};

export default function ProfileScreen() {
  const { authState, onLogout } = useAuth();
  const nav = useNavigation<any>();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) return;
    axios
      .get<ProfileData>(`${API_URL}/api/user/profile/`, {
        headers: { Authorization: `Bearer ${authState?.token}` },
      })
      .then(res => setProfile(res.data))
      .catch(err => {
        console.error(err);
        Alert.alert('Ошибка', 'Не удалось загрузить профиль');
      })
      .finally(() => setLoading(false));
  }, [isFocused]);

  if (loading || !profile) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const { first_name, last_name, email, phone_number } = profile;
  // Пример номера карты (можно брать из API)
  const cardNumber = '2132 5243 2342 3213';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile</Text>
          <View style={{ marginBottom: 24 }}>
      </View>
      {/* Карточка пользователя */}
      <View style={styles.card}>
        <Text style={styles.name}>
          {first_name} {last_name}
        </Text>
        <Text style={styles.info}>{email}</Text>
        <Text style={styles.info}>{phone_number}</Text>
        <Text style={styles.cardNumber}>{cardNumber}</Text>
      </View>

      {/* Меню */}
      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => nav.navigate('TransactionHistory')}
        >
          <FontAwesome5 name="history" size={24} color="#2c3e50" />
          <View style={styles.menuText}>
            <Text style={styles.menuTitle}>Transaction History</Text>
            <Text style={styles.menuSubtitle}>View your transaction history</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => nav.navigate('ProfileEdit')}
        >
          <MaterialIcons name="person-outline" size={24} color="#2c3e50" />
          <View style={styles.menuText}>
            <Text style={styles.menuTitle}>Profile Data</Text>
            <Text style={styles.menuSubtitle}>Change your personal info</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            onLogout && onLogout();
            nav.reset({ index: 0, routes: [{ name: 'Login' }] });
          }}
        >
          <MaterialIcons name="logout" size={24} color="#c0392b" />
          <View style={styles.menuText}>
            <Text style={[styles.menuTitle, { color: '#c0392b' }]}>
              Log Out
            </Text>
            <Text style={styles.menuSubtitle}>Log out from your account </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 0, marginTop: 50, color: '#135452' },
  card: {
    backgroundColor: '#135452',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  name: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  info: {
    color: '#ecf0f1',
    fontSize: 14,
    marginBottom: 4,
  },
  cardNumber: {
    color: '#bdc3c7',
    fontSize: 16,
    marginTop: 12,
    letterSpacing: 2,
  },
  menu: {
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  menuText: {
    marginLeft: 12,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#135452',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#135452',
  },
});
