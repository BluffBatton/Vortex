// src/screens/StationsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import MapView, { MapPressEvent, Marker, Region } from 'react-native-maps';
import axios from 'axios';
import { useAuth, API_URL } from '../context/AuthContext';

type GasStation = {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  price92: number;
  price95: number;
  price100: number;
  priceGas: number;
  priceDiesel: number;
};

export default function StationsScreen() {
  const { authState } = useAuth();
  const [stations, setStations] = useState<GasStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<GasStation | null>(null);

  const initialRegion: Region = {
    latitude: 50.45,
    longitude: 30.52,
    latitudeDelta: 5,
    longitudeDelta: 5,
  };

  useEffect(() => {
    axios.get(`${API_URL}/api/gas-stations/`, {
      headers: { Authorization: `Bearer ${authState?.token}` },
    })
    .then(res => {
      const parsed: GasStation[] = res.data.map((s: any) => ({
        ...s,
        latitude:  parseFloat(s.latitude),
        longitude: parseFloat(s.longitude),
        price92:   parseFloat(s.price92),
        price95:   parseFloat(s.price95),
        price100:  parseFloat(s.price100),
        priceGas:  parseFloat(s.priceGas),
        priceDiesel: parseFloat(s.priceDiesel),
      }));
      setStations(parsed);
    })
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion} onPress={(e: MapPressEvent) => {
        setSelected(null);
      }}>
        {stations.map(s => (
          <Marker
            key={s.id}
            coordinate={{ latitude: s.latitude, longitude: s.longitude }}
            title={s.name}
            onPress={() => setSelected(s)}
          />
        ))}
      </MapView>

      {selected && (
        <View style={styles.bottomCard}>
          <Text style={styles.stationName}>{selected.name}</Text>
          <Text style={styles.address}>{selected.address}</Text>


          <View style={styles.pricesRow}>
            <View style={styles.priceBox}>
              <Text style={styles.fuelType}>92</Text>
              <Text style={styles.fuelPrice}>{selected.price92.toFixed(2)} ₴</Text>
            </View>
            <View style={styles.priceBox}>
              <Text style={styles.fuelType}>95</Text>
              <Text style={styles.fuelPrice}>{selected.price95.toFixed(2)} ₴</Text>
            </View>
            <View style={styles.priceBox}>
              <Text style={styles.fuelType}>100</Text>
              <Text style={styles.fuelPrice}>{selected.price100.toFixed(2)} ₴</Text>
            </View>
            <View style={styles.priceBox}>
              <Text style={styles.fuelType}>GAS</Text>
              <Text style={styles.fuelPrice}>{selected.priceGas.toFixed(2)} ₴</Text>
            </View>
            <View style={styles.priceBox}>
              <Text style={styles.fuelType}>DIS</Text>
              <Text style={styles.fuelPrice}>{selected.priceDiesel.toFixed(2)} ₴</Text>
            </View>
          </View>
          <View style={styles.buttonsRow}>
            <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              const url = `https://www.google.com/maps/search/?api=1&query=${selected.latitude},${selected.longitude}`;
              Linking.canOpenURL(url).then(ok => ok && Linking.openURL(url));
            }}
            >
              <Text style={styles.actionText}>Open in Google Maps</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: { flex:1, justifyContent:'center', alignItems:'center' },
  bottomCard: {
    position: 'absolute',
    bottom: 0,
    width,
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width:0, height:-2 },
    shadowOpacity: 0.1,
    elevation: 5,
  },
    address: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  stationName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  pricesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  priceBox: {
    alignItems: 'center',
    padding: 8,
  },
  fuelType: {
    fontSize: 16,
    color: '#666',
  },
  fuelPrice: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  closeButton: {
    marginTop: 12,
    alignSelf: 'center',
    padding: 6,
  },
  closeText: {
    color: '#135452',
  },
  buttonsRow: {
    marginTop: 12,
    alignItems: 'center'
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#135452',
    borderRadius: 6,
  },
  actionText: {
    color: '#fff',
    fontWeight: '600'
  }
});
