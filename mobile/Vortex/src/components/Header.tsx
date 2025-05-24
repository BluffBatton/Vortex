// src/components/Header.tsx
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

export function Header({ title }: { title: string }) {
  const navigation = useNavigation<any>()
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <MaterialIcons name="arrow-back" size={28} color="#135452" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#fff',
    marginTop: 20,
  },
  backBtn: {
    marginRight: 8,
    marginTop: 4,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '400',
    color: '#135452',
    flexShrink: 1,
  },
})
