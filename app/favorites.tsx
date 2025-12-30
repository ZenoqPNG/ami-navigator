import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React, { useEffect, useState } from 'react';
import { FlatList, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomNav from '../src/components/BottomNav';
import { loadFavorites, saveFavorites } from '../src/utils/storage';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const favs = await loadFavorites();
      setFavorites(favs);
    };
    load();
  }, []);

  const deleteFavorite = async (label: string) => {
    const updated = favorites.filter(f => f.label !== label);
    setFavorites(updated);
    await saveFavorites(updated);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Animation d'entrée du titre */}
      <MotiView 
        from={{ opacity: 0, translateX: -20 }} 
        animate={{ opacity: 1, translateX: 0 }} 
        transition={{ type: 'timing', duration: 500 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Mes Lieux</Text>
      </MotiView>

      <View style={styles.content}>
        {favorites.length === 0 ? (
          <MotiView 
            from={{ opacity: 0, scale: 0.5 }} 
            animate={{ opacity: 1, scale: 1 }} 
            style={styles.empty}
          >
            <Ionicons name="heart-dislike-outline" size={50} color="#CCC" />
            <Text style={styles.emptyText}>Aucun favori enregistré</Text>
          </MotiView>
        ) : (
          <FlatList 
            data={favorites}
            keyExtractor={(item) => item.label}
            renderItem={({ item, index }) => (
              <MotiView 
                from={{ opacity: 0, translateX: -50 }} 
                animate={{ opacity: 1, translateX: 0 }} 
                transition={{ 
                    type: 'spring', 
                    damping: 15, 
                    delay: index * 100 // Effet de cascade
                }}
                style={styles.favCard}
              >
                <TouchableOpacity 
                  style={styles.favInfo}
                  onPress={() => router.push({ pathname: "/", params: { dest: JSON.stringify(item) } })}
                >
                  <View style={styles.iconCircle}>
                    <Ionicons name="location" size={18} color="#007AFF" />
                  </View>
                  <Text style={styles.favLabel} numberOfLines={1}>{item.label}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={() => deleteFavorite(item.label)} style={styles.deleteBtn}>
                  <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                </TouchableOpacity>
              </MotiView>
            )}
          />
        )}
      </View>
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { 
    paddingTop: Platform.OS === 'ios' ? 20 : 60, 
    paddingBottom: 20, 
    backgroundColor: 'white', 
    paddingHorizontal: 25,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 2
  },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#1C1C1E' },
  content: { flex: 1, padding: 20 },
  favCard: { 
    backgroundColor: 'white', 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 18, 
    borderRadius: 22, 
    marginBottom: 12, 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10
  },
  favInfo: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  iconCircle: { 
    width: 36, height: 36, borderRadius: 18, 
    backgroundColor: '#F0F7FF', justifyContent: 'center', alignItems: 'center' 
  },
  favLabel: { marginLeft: 15, fontSize: 16, fontWeight: '600', color: '#1C1C1E' },
  deleteBtn: { padding: 5 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { marginTop: 10, color: '#8E8E93', fontSize: 16, fontWeight: '500' }
});