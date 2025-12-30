import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomNav from '../src/components/BottomNav';

const isNight = new Date().getHours() > 19 || new Date().getHours() < 7;
const Theme = {
  bg: isNight ? '#000000' : '#F8F9FA',
  card: isNight ? '#1C1C1E' : '#FFFFFF',
  text: isNight ? '#FFFFFF' : '#1C1C1E',
  subText: isNight ? '#AEAEB2' : '#8E8E93',
};

export default function FavoritesScreen() {
  const favs = [
    { id: '1', name: 'Maison', address: '12 rue des Amis', icon: 'home' },
    { id: '2', name: 'Travail', address: 'Zone Industrielle', icon: 'briefcase' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Theme.bg }]}>
      <StatusBar style={isNight ? "light" : "dark"} />
      <View style={styles.header}><Text style={[styles.title, { color: Theme.text }]}>Mes Lieux</Text></View>
      <FlatList
        data={favs}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.item, { backgroundColor: Theme.card }]}>
            <View style={styles.iconBox}><Ionicons name={item.icon as any} size={20} color="#007AFF" /></View>
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={[styles.itemName, { color: Theme.text }]}>{item.name}</Text>
              <Text style={[styles.itemAddr, { color: Theme.subText }]}>{item.address}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Theme.subText} />
          </TouchableOpacity>
        )}
      />
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 25, paddingBottom: 10 },
  title: { fontSize: 28, fontWeight: '900' },
  item: { flexDirection: 'row', padding: 18, borderRadius: 20, marginBottom: 12, alignItems: 'center', elevation: 2 },
  iconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: isNight ? '#2C2C2E' : '#F2F2F7', justifyContent: 'center', alignItems: 'center' },
  itemName: { fontSize: 16, fontWeight: '700' },
  itemAddr: { fontSize: 13, marginTop: 2 }
});