import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, PixelRatio, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375;
const s = (size: number) => Math.round(PixelRatio.roundToNearestPixel(size * scale));

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const isNight = new Date().getHours() > 19 || new Date().getHours() < 7;

  const tabs = [
    { name: 'Carte', icon: 'map', path: '/' },
    { name: 'Favoris', icon: 'heart', path: '/favorites' },
    { name: 'Réglages', icon: 'settings', path: '/settings' },
  ];

  const navigateTo = (path: string) => {
    if (pathname !== path) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push(path as any);
    }
  };

  return (
    <View style={styles.wrapper}>
      <BlurView intensity={90} tint={isNight ? "dark" : "light"} style={styles.container}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab.path} style={styles.tab} onPress={() => navigateTo(tab.path)}>
            <Ionicons 
                name={pathname === tab.path ? (tab.icon as any) : `${tab.icon}-outline`} 
                size={s(20)} 
                color={pathname === tab.path ? '#007AFF' : '#8E8E93'} 
            />
            <Text style={[styles.label, { color: pathname === tab.path ? '#007AFF' : '#8E8E93' }]}>{tab.name}</Text>
          </TouchableOpacity>
        ))}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  // PLUS DE POSITION ABSOLUTE ICI
  wrapper: { 
    width: '100%', 
    paddingHorizontal: s(20), 
    paddingBottom: s(15), // Marge avec le bas de l'écran
    backgroundColor: 'transparent'
  },
  container: { 
    flexDirection: 'row', 
    width: '100%', 
    height: s(60), 
    borderRadius: s(30), 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    overflow: 'hidden', 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.2)', 
    elevation: 10 
  },
  tab: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  label: { fontSize: s(10), marginTop: s(2), fontWeight: '700' }
});