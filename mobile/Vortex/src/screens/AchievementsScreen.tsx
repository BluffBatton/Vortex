// src/screens/AchievementsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Share, TouchableOpacity, Linking } from 'react-native';
import { ACHIEVEMENTS, AchievementDef } from '../constants/achievements';
import axios from 'axios';
import { useAuth, API_URL } from '../context/AuthContext';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

type Tx = { amount: number; price: number };

export default function AchievementsScreen() {
  const isFocused = useIsFocused();
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
        const totalSum  = txs.reduce((sum, t) => sum + (Number(t.price) * Number(t.amount)), 0);
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
  }, [authState?.token, isFocused]);

    const shareOnTwitter = () => {
    const unlockedAchievements = defs.filter(d => d.unlocked);
    const baseText = `I use "Vortex" gas station system and unlocked ${unlockedAchievements.length} achievements!`;

    let tweetText = baseText;

    if (unlockedAchievements.length > 0) {
      tweetText += `\n\nMy achievements:`;
      unlockedAchievements.slice(0, 3).forEach(a => {
        tweetText += `\n🏆 ${a.title}`;
      });
      
      if (unlockedAchievements.length > 3) {
        tweetText += `\n+${unlockedAchievements.length - 3} more`;
      }
    }

    tweetText += `\n\nCheck out Vortex: https://vortex-fuel-app.com\n#VortexApp #FuelApp`;

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

    Linking.openURL(twitterUrl).catch(err => 
      console.error('Failed to open Twitter:', err)
    );
  };

  if (loading) {
    return <ActivityIndicator style={styles.center} size="large" />;
  }

  const unlockedCount = defs.filter(d => d.unlocked).length;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Achievements</Text>
          <TouchableOpacity onPress={shareOnTwitter} style={styles.shareButton}>
            <MaterialIcons name="share" size={24} color="#135452" />
          </TouchableOpacity>
      </View>
      
      <View style={styles.trophiesCard}>
        <MaterialCommunityIcons name="trophy" size={36} color="#2c3e50" />
        <Text style={styles.count}>{unlockedCount}</Text>
        <Text style={styles.countLabel}>Trophies count</Text>
      </View>

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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 50,
    paddingHorizontal: 20,
  },
  shareButton: {
    padding: 8,
    marginLeft: 8,
    left: 20
  },
  container: {
     flex: 1, 
     padding: 16, 
     backgroundColor: '#fff' 
  },
  center: { 
    flex: 1, 
    justifyContent: 'center' 
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    color: '#135452',
    marginTop: 0,
    right: 20
  },
  trophiesCard: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  count: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: '#135452' 
  },
  countLabel: { 
    color: '#135452' 
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    elevation: 2,
    marginBottom: 12,
  },
  locked: { 
    opacity: 0.5 
  },
  text: { 
    marginLeft: 12, 
    flex: 1 
  },
  title: { 
    fontSize: 16, 
    fontWeight: '600' 
  },
  desc: { 
    fontSize: 12, 
    color: '#666', 
    marginTop: 4 
  },
  textLocked: {
     color: '#aaa' 
  },
});
