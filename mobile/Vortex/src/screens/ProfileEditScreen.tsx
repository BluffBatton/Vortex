// src/screens/ProfileEditScreen.tsx
import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, ScrollView } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import { useAuth, API_URL } from '../context/AuthContext'

export default function ProfileEditScreen() {
  const { authState } = useAuth()
  const navigation = useNavigation<any>()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    axios
      .get(`${API_URL}/api/user/profile/`, {
        headers: { Authorization: `Bearer ${authState?.token}` },
      })
      .then(res => {
        const u = res.data
        setFirstName(u.first_name || '')
        setLastName(u.last_name || '')
        setPhoneNumber(u.phone_number || '')
        setEmail(u.email || '')
      })
      .catch(err => {
        console.error(err)
        Alert.alert('Error', 'Unable to load profile')
        navigation.goBack()
      })
      .finally(() => setLoading(false))
  }, [authState])

const handleSave = () => {
  const payload: any = {
    first_name: firstName,
    last_name: lastName,
    phone_number: phoneNumber,
    email,
  }
  if (password.trim().length) {
    payload.password = password
  }

  setSaving(true)
  axios
    .patch(`${API_URL}/api/user/profile/`, payload, {
      headers: { Authorization: `Bearer ${authState?.token}` },
    })
    .then(() => {
      Alert.alert('Success', 'Data has been saved')
      navigation.goBack()
    })
    .catch(err => {
      console.error(err)
      Alert.alert('Error', 'Unable to save changes')
    })
    .finally(() => setSaving(false))
}


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={28} color="#135452" />
        </TouchableOpacity>
        <Text style={styles.title}>Profile{'\n'}Data</Text>
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="First Name"
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Last Name"
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="+380000000000"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="email@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveTxt}>Save changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  backBtn: { marginRight: 8 },
  title: {
    fontSize: 28,
    lineHeight: 34,
    marginTop: 50,
    fontWeight: '400',
    color: '#135452',
  },

  form: {
    padding: 16,
  },
  label: {
    marginTop: 12,
    marginBottom: 4,
    color: '#333',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#fff',
  },

  saveBtn: {
    marginTop: 24,
    backgroundColor: '#135452',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveTxt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})
