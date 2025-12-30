import { useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import MapView, { UrlTile } from 'react-native-maps';
import { calculateVerdict } from './src/utils/rangeCalculator';

export default function App() {
  // State
  const [battery, setBattery] = useState(80);
  const [isRaining, setIsRaining] = useState(false);
  const [isCold, setIsCold] = useState(false);
  const [isRoundTrip, setIsRoundTrip] = useState(true);
  const [verdict, setVerdict] = useState(null);

  // Simulation de calcul après sélection sur la carte
  const handleCalculate = (distance) => {
    const res = calculateVerdict(battery, isRaining, isCold, distance, isRoundTrip);
    setVerdict(res);
  };

  return (
    <View style={styles.container}>
      {/* MAP - Utilisation de OpenStreetMap via UrlTile */}
      <MapView 
        style={styles.map}
        initialRegion={{
          latitude: 48.8566,
          longitude: 2.3522,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <UrlTile urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapView>

      {/* PANNEAU DE CONTROLE (UI Jeune) */}
      <View style={styles.panel}>
        <Text style={styles.title}>Configuration</Text>
        
        <View style={styles.row}>
          <Text>Batterie: {battery}%</Text>
          <View style={styles.btnRow}>
             <TouchableOpacity onPress={() => setBattery(Math.max(0, battery-10))} style={styles.miniBtn}><Text>-</Text></TouchableOpacity>
             <TouchableOpacity onPress={() => setBattery(Math.min(100, battery+10))} style={styles.miniBtn}><Text>+</Text></TouchableOpacity>
          </View>
        </View>

        <View style={styles.row}>
          <Text>Pluie 🌧️</Text>
          <Switch value={isRaining} onValueChange={setIsRaining} />
          <Text>Froid ❄️</Text>
          <Switch value={isCold} onValueChange={setIsCold} />
        </View>

        <TouchableOpacity 
          style={[styles.mainBtn, {backgroundColor: verdict ? verdict.color : '#007AFF'}]}
          onPress={() => handleCalculate(15)} // Distance de test 15km
        >
          <Text style={styles.btnText}>
            {verdict ? verdict.label : "Calculer l'itinéraire"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  panel: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  miniBtn: { backgroundColor: '#EEE', padding: 10, borderRadius: 10, marginHorizontal: 5 },
  mainBtn: { padding: 20, borderRadius: 15, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 18 }
});