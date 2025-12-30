import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import MapView from 'react-native-maps';

export default function App() {
  const [status, setStatus] = useState('Démarrage...');
  const [locationReady, setLocationReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setStatus('Vérification GPS...');
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setStatus('Erreur : GPS refusé');
          return;
        }
        
        setStatus('Localisation en cours...');
        await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setLocationReady(true);
        setStatus('MiniWay Prêt');
      } catch (e) {
        setStatus('Erreur de démarrage');
        console.log(e);
      }
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {locationReady ? (
        <MapView 
          style={styles.map}
          initialRegion={{
            latitude: 48.8566,
            longitude: 2.3522,
            latitudeDelta: 0.09,
            longitudeDelta: 0.04,
          }}
          showsUserLocation={true}
        />
      ) : (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={{ color: 'white', marginTop: 20 }}>{status}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  map: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1C1C1E' }
});