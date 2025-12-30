import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import * as ScreenOrientation from 'expo-screen-orientation';
import { StatusBar } from 'expo-status-bar';
import { AnimatePresence, MotiView } from 'moti';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Keyboard,
  PixelRatio,
  Platform,
  SafeAreaView, StyleSheet,
  Text, TextInput, TouchableOpacity, View
} from 'react-native';
import MapView, { Marker, Polyline, UrlTile } from 'react-native-maps';

// IMPORTS LOCAUX
import BottomNav from '../src/components/BottomNav';

// --- CONFIGURATION ÉCRAN & SCALE ---
const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');
const scale = Math.min(WINDOW_WIDTH, WINDOW_HEIGHT) / 375;
const s = (size: number) => Math.round(PixelRatio.roundToNearestPixel(size * scale));

const STADIA_API_KEY = "5f67ee63-5b2a-4c6d-9ded-491202c6fdd5";
const GRAPHHOPPER_KEY = "5deac046-27ea-4c1b-9169-40e2608a11b6";

const isNight = new Date().getHours() > 19 || new Date().getHours() < 7;
const Theme = {
  bg: isNight ? '#000000' : '#F8F9FA',
  card: isNight ? '#1C1C1E' : '#FFFFFF',
  text: isNight ? '#FFFFFF' : '#1C1C1E',
  subText: isNight ? '#AEAEB2' : '#8E8E93',
  accent: '#007AFF',
  navOrange: '#f39c12',
  navGreen: '#2ecc71'
};

export default function App() {
  const mapRef = useRef<MapView>(null);
  const [isReady, setIsReady] = useState(false);
  const [battery, setBattery] = useState("100");
  const [pointA, setPointA] = useState<any>(null);
  const [pointB, setPointB] = useState<any>(null);
  const [inputB, setInputB] = useState("");
  const [routeCoords, setRouteCoords] = useState<any[]>([]); 
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [travelTime, setTravelTime] = useState<number | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [verdict, setVerdict] = useState<any>(null);

  // --- LOGIQUE GPS & NAVIGATION ---
  useEffect(() => {
    let subscription: any;
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const loc = await Location.getCurrentPositionAsync({});
      setPointA({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });

      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, distanceInterval: 10 },
        (newLocation) => {
          const coords = { latitude: newLocation.coords.latitude, longitude: newLocation.coords.longitude };
          setPointA(coords);
          if (isNavigating) {
            mapRef.current?.animateCamera({ center: coords, pitch: 45, zoom: 17 }, { duration: 1000 });
          }
        }
      );
      setIsReady(true);
    })();
    return () => subscription?.remove();
  }, [isNavigating]);

  const toggleNavigation = async (status: boolean) => {
    setIsNavigating(status);
    if (status) {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    }
  };

  // --- RECHERCHE & ITINÉRAIRE ---
  const handleSearch = async (text: string) => {
    setInputB(text);
    if (text.length > 2) {
      try {
        const url = `https://graphhopper.com/api/1/geocode?q=${encodeURIComponent(text)}&locale=fr&limit=5&key=${GRAPHHOPPER_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        setSuggestions(data.hits || []);
      } catch (e) { console.error(e); }
    } else setSuggestions([]);
  };

  const getRoute = async (dest: any) => {
    if (!pointA) return;
    const url = `https://graphhopper.com/api/1/route?point=${pointA.latitude},${pointA.longitude}&point=${dest.latitude},${dest.longitude}&profile=car&locale=fr&points_encoded=false&key=${GRAPHHOPPER_KEY}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.paths) {
        setDistanceKm(data.paths[0].distance / 1000);
        setTravelTime(Math.round(data.paths[0].time / 60000));
        const coords = data.paths[0].points.coordinates.map((c: any) => ({ latitude: c[1], longitude: c[0] }));
        setRouteCoords(coords);
        mapRef.current?.fitToCoordinates(coords, { edgePadding: { top: s(50), right: s(50), bottom: s(250), left: s(50) } });
      }
    } catch (e) { console.error(e); }
  };

  const selectLocation = (item: any) => {
    const coords = { latitude: item.point.lat, longitude: item.point.lng };
    setPointB(coords);
    setInputB(item.name);
    setSuggestions([]);
    Keyboard.dismiss();
    getRoute(coords);
  };

  const addToFavorites = async (name: string, coords: any) => {
    try {
      const existingFavs = await AsyncStorage.getItem('favorites');
      const favs = existingFavs ? JSON.parse(existingFavs) : [];
      if (favs.some((f: any) => f.name === name)) return Alert.alert("Déjà en favoris");
      await AsyncStorage.setItem('favorites', JSON.stringify([...favs, { name, coords }]));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Favori ajouté", name);
    } catch (e) { console.error(e); }
  };

  const getArrivalTime = () => {
    if (!travelTime) return "--:--";
    const now = new Date();
    now.setMinutes(now.getMinutes() + travelTime);
    return now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  if (!isReady) return <View style={styles.loading}><ActivityIndicator color={Theme.accent} /></View>;

  return (
    <View style={styles.container}>
      <StatusBar style={isNight ? "light" : "dark"} />
      
      <MapView ref={mapRef} style={StyleSheet.absoluteFillObject} mapType="none" showsUserLocation>
        <UrlTile urlTemplate={`https://tiles.stadiamaps.com/tiles/${isNight ? 'alidade_smooth_dark' : 'osm_bright'}/{z}/{x}/{y}.png?api_key=${STADIA_API_KEY}`} zIndex={-1} />
        {routeCoords.length > 0 && <Polyline coordinates={routeCoords} strokeWidth={s(6)} strokeColor={Theme.accent} zIndex={10} />}
        {pointB && <Marker coordinate={pointB} pinColor="red" zIndex={11} />}
      </MapView>

      <SafeAreaView style={styles.uiOverlay} pointerEvents="box-none">
        
        {/* HEADER NAVIGATION (Orange) */}
        <AnimatePresence>
          {isNavigating && (
            <MotiView from={{ translateY: -100 }} animate={{ translateY: 0 }} exit={{ translateY: -100 }} style={styles.navHeader}>
              <View style={styles.navIconBox}><Ionicons name="navigate" size={s(30)} color="white" /></View>
              <View style={styles.navTextBox}>
                <Text style={styles.navDist}>{travelTime} min</Text>
                <Text style={styles.navStreet} numberOfLines={1}>Arrivée à {getArrivalTime()}</Text>
              </View>
            </MotiView>
          )}
        </AnimatePresence>

        {/* RECHERCHE */}
        {!isNavigating && (
          <View style={styles.topContainer} pointerEvents="box-none">
            <View style={[styles.searchBox, { backgroundColor: Theme.card }]}>
              <Ionicons name="search" size={20} color={Theme.subText} style={{marginLeft: 15}} />
              <TextInput style={[styles.input, { color: Theme.text }]} placeholder="Où va votre Ami ?" placeholderTextColor={Theme.subText} value={inputB} onChangeText={handleSearch} />
              {pointB && (
                  <TouchableOpacity onPress={() => addToFavorites(inputB, pointB)} style={{marginRight: 15}}>
                    <Ionicons name="heart-outline" size={24} color={Theme.accent} />
                  </TouchableOpacity>
              )}
            </View>
            {suggestions.length > 0 && (
              <View style={[styles.suggestions, { backgroundColor: Theme.card }]}>
                {suggestions.map((item, i) => (
                  <TouchableOpacity key={i} style={styles.suggestItem} onPress={() => selectLocation(item)}>
                    <Ionicons name="location-sharp" size={18} color={Theme.subText} />
                    <Text style={[styles.suggestText, { color: Theme.text }]} numberOfLines={1}>{item.name} ({item.city})</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        <View style={{ flex: 1 }} pointerEvents="none" />

        {/* ZONE BASSE (COMPACTE) */}
        <View style={styles.bottomArea} pointerEvents="box-none">
          <MotiView animate={{ height: isNavigating ? s(70) : s(135) }} style={[styles.widgetPanel, { backgroundColor: Theme.card }]}>
            <View style={styles.widgetContent}>
                {!isNavigating ? (
                  <>
                    <View style={styles.statsRow}>
                        <View><Text style={styles.label}>BAT %</Text><TextInput style={[styles.value, { color: Theme.text }]} value={battery} onChangeText={setBattery} keyboardType="numeric" /></View>
                        <View style={{alignItems: 'flex-end'}}><Text style={styles.label}>TEMPS EST.</Text><Text style={[styles.value, { color: Theme.text }]}>{travelTime || 0} MIN</Text></View>
                    </View>
                    <TouchableOpacity style={[styles.mainButton, { backgroundColor: Theme.accent }]} onPress={() => toggleNavigation(true)}>
                        <Text style={styles.btnText}>LANCER ({distanceKm?.toFixed(1)} KM)</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <View style={styles.navCompactRow}>
                    <View>
                      <Text style={styles.label}>ARRIVÉE ({travelTime} MIN)</Text>
                      <Text style={[styles.value, { color: Theme.navGreen, fontSize: s(20) }]}>{getArrivalTime()}</Text>
                    </View>
                    <TouchableOpacity style={styles.stopButton} onPress={() => toggleNavigation(false)}>
                        <Text style={styles.btnText}>QUITTER</Text>
                    </TouchableOpacity>
                  </View>
                )}
            </View>
          </MotiView>
          {!isNavigating && <BottomNav />}
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  uiOverlay: { flex: 1 },
  navHeader: {
    position: 'absolute', top: s(20), left: s(12), right: s(12),
    backgroundColor: Theme.navOrange, borderRadius: s(18), height: s(70),
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(20), elevation: 10
  },
  navIconBox: { width: s(40), alignItems: 'center' },
  navTextBox: { flex: 1, marginLeft: s(10) },
  navDist: { color: 'white', fontSize: s(22), fontWeight: '900' },
  navStreet: { color: 'white', fontSize: s(14), fontWeight: '600' },
  topContainer: { paddingHorizontal: s(15), paddingTop: Platform.OS === 'android' ? s(35) : s(10), zIndex: 100 },
  searchBox: { height: s(45), borderRadius: s(22), flexDirection: 'row', alignItems: 'center', elevation: 5 },
  input: { flex: 1, paddingHorizontal: 15, fontSize: s(14), fontWeight: '600' },
  suggestions: { marginTop: s(5), borderRadius: s(15), maxHeight: s(180), elevation: 10 },
  suggestItem: { flexDirection: 'row', alignItems: 'center', padding: s(12), borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.05)' },
  suggestText: { marginLeft: 10, fontSize: s(13), fontWeight: '600' },
  bottomArea: { width: '100%', justifyContent: 'flex-end' },
  widgetPanel: { marginHorizontal: s(15), marginBottom: s(8), borderRadius: s(22), padding: s(12), elevation: 8 },
  widgetContent: { flex: 1, justifyContent: 'center' },
  navCompactRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stopButton: { backgroundColor: '#FF3B30', paddingHorizontal: s(25), height: s(38), borderRadius: s(12), justifyContent: 'center' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: s(8) },
  label: { fontSize: s(8), fontWeight: 'bold', color: '#8E8E93' },
  value: { fontSize: s(18), fontWeight: 'bold' },
  mainButton: { height: s(40), borderRadius: s(12), justifyContent: 'center', alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: s(12) }
});