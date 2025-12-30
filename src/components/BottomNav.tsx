import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { name: 'Carte', icon: 'map', path: '/' },
    { name: 'Favoris', icon: 'heart', path: '/favorites' },
    { name: 'Réglages', icon: 'settings', path: '/settings' },
  ];

  const navigateTo = (path: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(path as any);
  };

  return (
    <View style={styles.outerContainer}>
      <BlurView intensity={90} tint="light" style={styles.container}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab.path} style={styles.tab} onPress={() => navigateTo(tab.path)}>
            <Ionicons name={pathname === tab.path ? (tab.icon as any) : `${tab.icon}-outline`} size={22} color={pathname === tab.path ? '#007AFF' : '#8E8E93'} />
            <Text style={[styles.label, { color: pathname === tab.path ? '#007AFF' : '#8E8E93' }]}>{tab.name}</Text>
          </TouchableOpacity>
        ))}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: { position: 'absolute', bottom: 30, left: 20, right: 20, zIndex: 100 },
  container: { flexDirection: 'row', width: '100%', height: 65, borderRadius: 30, justifyContent: 'space-around', alignItems: 'center', overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)', elevation: 15 },
  tab: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  label: { fontSize: 10, marginTop: 2, fontWeight: '700' }
});