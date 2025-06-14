// src/screens/TransactionHistoryScreen.tsx
import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native'
import axios from 'axios'
import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useAuth, API_URL } from '../context/AuthContext'
import { Header } from '../components/Header'

type Transaction = {
  id: number
  fuel_type: string
  amount: number
  price: number
  date: string 
  transaction_type: string
}

export default function TransactionHistoryScreen() {
  const { authState } = useAuth()
  const [data, setData] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const navigation = useNavigation<any>()

  useEffect(() => {
    if (!authState?.token) return
    axios
      .get<Transaction[]>(`${API_URL}/api/fuel-transactions/`, {
        headers: { Authorization: `Bearer ${authState.token}` },
      })
      .then(res => setData(res.data.reverse()))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [authState])

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

const renderItem = ({ item }: { item: Transaction }) => {
  const date = new Date(item.date).toLocaleDateString()
  const priceNum = Number(item.price);
  return (
    <View style={styles.item}>
      <View style={styles.row}>
        <View>
          <Text style={styles.fuelText}>
            Fuel {item.fuel_type}, {item.amount}L
          </Text>
          <Text style={styles.dateText}>{date}</Text>
        </View>
        <View style={styles.rightColumn}>
          <Text style={styles.priceText}>{priceNum.toFixed(1)} ₴</Text>
          <Text style={styles.typeText}>{item.transaction_type}</Text>
        </View>
      </View>
      <View style={styles.separator} />
    </View>
  )
}

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <MaterialIcons name="arrow-back" size={28} color="#135452" />
        </TouchableOpacity>
        <Text style={styles.title}>
          Transaction{'\n'}history
        </Text>
      </View>
    
      <FlatList
        data={data}
        keyExtractor={i => String(i.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  rightColumn: { 
    alignItems: 'flex-end',
  },
  typeText: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  backBtn: { 
    marginRight: 8 
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    marginTop: 50,
    fontWeight: '400',
    color: '#135452',
  },
  list: { 
    paddingTop: 16 
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fuelText: {
    fontSize: 16,
    color: '#000',
  },
  priceText: {
    fontSize: 16,
    color: '#000',
  },
  dateText: {
    marginTop: 4,
    fontSize: 14,
    color: '#555',
  },
  separator: {
    marginTop: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
})
