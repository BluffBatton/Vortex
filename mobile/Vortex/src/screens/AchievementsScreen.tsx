// src/screens/AchievementsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { ACHIEVEMENTS, AchievementDef } from '../constants/achievements';
import axios from 'axios';
import { useAuth, API_URL } from '../context/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Tx = { amount: number; price: number };

export default function AchievementsScreen() {
  const { authState } = useAuth();
  const [defs, setDefs] = useState<AchievementDef[]>(ACHIEVEMENTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<Tx[]>(`${API_URL}/api/fuel-transactions/`, {
        headers: { Authorization: `Bearer ${authState?.token}` },
      })
      .then(res => {
        const txs = res.data;
        const count     = txs.length;
        const maxVolume = Math.max(...txs.map(t => t.amount), 0);
        const totalSum  = txs.reduce((sum, t) => sum + t.price, 0);

        // Отмечаем, какие ачивки выполнены
        const updated = ACHIEVEMENTS.map(def => {
          let unlocked = false;
          switch (def.code) {
            case 'first_fillup':
              unlocked = count >= 1;
              break;
            case 'big_spender':
              unlocked = maxVolume >= 100;
              break;
            case 'regular_client':
              unlocked = count >= 10;
              break;
            case 'rich_player':
              unlocked = totalSum >= 2000;
              break;
          }
          return { ...def, unlocked };
        });

        setDefs(updated);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [authState?.token]);

  if (loading) {
    return <ActivityIndicator style={styles.center} size="large" />;
  }

  // Сколько трофеев (ачивок) разблокировано
  const unlockedCount = defs.filter(d => d.unlocked).length;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Achievements</Text>

      {/* Карточка со счётчиком трофеев */}
      <View style={styles.trophiesCard}>
        <MaterialCommunityIcons name="trophy" size={36} color="#2c3e50" />
        <Text style={styles.count}>{unlockedCount}</Text>
        <Text style={styles.countLabel}>Trophies count</Text>
      </View>

      {/* Список ачивок */}
      <FlatList
        data={defs}
        keyExtractor={item => item.code}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={[styles.card, !item.unlocked && styles.locked]}>
            <MaterialCommunityIcons
              name={item.icon as any}
              size={28}
              color={item.unlocked ? '#2c3e50' : '#ccc'}
            />
            <View style={styles.text}>
              <Text style={[styles.title, !item.unlocked && styles.textLocked]}>
                {item.title}
              </Text>
              <Text style={[styles.desc, !item.unlocked && styles.textLocked]}>
                {item.description}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, padding: 16, backgroundColor: '#fff' },
  center:       { flex: 1, justifyContent: 'center' },
  heading:      { fontSize: 24, fontWeight: '600', marginBottom: 16, marginTop: 50, color: '#135452' },

  trophiesCard: {
    backgroundColor: '#f0f0f0',
    borderRadius:    8,
    padding:         20,
    alignItems:      'center',
    marginBottom:    16,
  },
  count:        { fontSize: 32, fontWeight: 'bold', color: '#135452' },
  countLabel:   { color: '#135452' },

  card:         {
    flexDirection:  'row',
    alignItems:     'center',
    backgroundColor:'#fff',
    padding:        12,
    borderRadius:   8,
    elevation:      2,
    marginBottom:   12,
  },
  locked:       { opacity: 0.5 },
  text:         { marginLeft: 12, flex: 1 },
  title:        { fontSize: 16, fontWeight: '600' },
  desc:         { fontSize: 12, color: '#666', marginTop: 4 },
  textLocked:   { color: '#aaa' },
});
