import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { AnimatePresence, MotiView } from 'moti';
import React, { useEffect, useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomNav from '../src/components/BottomNav';
import { loadSettings, saveSettings } from '../src/utils/storage';

export default function SettingsScreen() {
  const [soh, setSoh] = useState(100);
  const [showCredits, setShowCredits] = useState(false);

  useEffect(() => {
    const load = async () => {
      const s = await loadSettings();
      if (s) setSoh(s.soh);
    };
    load();
  }, []);

  const updateSoh = async (newSoh: number) => {
    Haptics.selectionAsync();
    setSoh(newSoh);
    await saveSettings({ soh: newSoh });
  };

  const openCredits = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowCredits(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Réglages</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Section Batterie */}
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Santé batterie (SOH)</Text>
              <Text style={styles.settingSub}>Capacité réelle de votre Ami</Text>
            </View>
            <View style={styles.counter}>
              <TouchableOpacity onPress={() => updateSoh(Math.max(50, soh - 1))} style={styles.btn}>
                <Ionicons name="remove" size={20} color="#007AFF" />
              </TouchableOpacity>
              <Text style={styles.val}>{soh}%</Text>
              <TouchableOpacity onPress={() => updateSoh(Math.min(100, soh + 1))} style={styles.btn}>
                <Ionicons name="add" size={20} color="#007AFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Bouton Crédits */}
        <TouchableOpacity style={[styles.card, styles.creditsBtn]} onPress={openCredits}>
          <Ionicons name="information-circle-outline" size={22} color="#1C1C1E" />
          <Text style={styles.creditsBtnText}>Crédits & Infos</Text>
          <Ionicons name="chevron-forward" size={18} color="#8E8E93" />
        </TouchableOpacity>

        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>

      {/* POPUP DES CRÉDITS */}
      <Modal visible={showCredits} transparent={true} animationType="none">
        <Pressable style={styles.modalOverlay} onPress={() => setShowCredits(false)}>
          <AnimatePresence>
            {showCredits && (
              <MotiView
                from={{ opacity: 0, scale: 0.8, translateY: 40 }}
                animate={{ opacity: 1, scale: 1, translateY: 0 }}
                exit={{ opacity: 0, scale: 0.8, translateY: 40 }}
                style={styles.modalContent}
              >
                <View style={styles.recyTechBadge}>
                  <Text style={styles.recyTechText}>RecyTech</Text>
                </View>
                
                <Text style={styles.modalTitle}>Ami Navigator</Text>
                
                <View style={styles.teamSection}>
                  <Text style={styles.teamName}>Enzo & Renan</Text>
                  <Text style={styles.teamRole}>Designers & Développeurs</Text>
                </View>

                <View style={styles.divider} />

                <Text style={styles.loveText}>Fait avec ❤️ pour la communauté Citroën Ami</Text>

                <TouchableOpacity 
                  style={styles.closeBtn} 
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setShowCredits(false);
                  }}
                >
                  <Text style={styles.closeBtnText}>Fermer</Text>
                </TouchableOpacity>
              </MotiView>
            )}
          </AnimatePresence>
        </Pressable>
      </Modal>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { 
    paddingTop: Platform.OS === 'ios' ? 60 : 40, 
    paddingBottom: 20, 
    backgroundColor: 'white', 
    paddingHorizontal: 25, 
    borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 20, 
    elevation: 2 
  },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#1C1C1E' },
  content: { flex: 1, padding: 20 },
  card: { backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 15, elevation: 2 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  settingLabel: { fontSize: 16, fontWeight: '700', color: '#1C1C1E' },
  settingSub: { fontSize: 12, color: '#8E8E93', marginTop: 2 },
  counter: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F2F2F7', borderRadius: 12, padding: 4 },
  val: { fontSize: 16, fontWeight: '900', marginHorizontal: 15, color: '#007AFF', minWidth: 40, textAlign: 'center' },
  btn: { backgroundColor: 'white', width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  creditsBtn: { flexDirection: 'row', alignItems: 'center' },
  creditsBtnText: { flex: 1, marginLeft: 12, fontSize: 16, fontWeight: '600' },
  versionText: { textAlign: 'center', color: '#C7C7CC', fontSize: 12, marginTop: 10, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: 'white', borderRadius: 30, padding: 25, alignItems: 'center' },
  recyTechBadge: { backgroundColor: '#007AFF', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20, marginBottom: 15 },
  recyTechText: { color: 'white', fontWeight: '800', fontSize: 12, letterSpacing: 1 },
  modalTitle: { fontSize: 24, fontWeight: '900', color: '#1C1C1E', marginBottom: 20 },
  teamSection: { alignItems: 'center', marginBottom: 20 },
  teamName: { fontSize: 18, fontWeight: '700', color: '#1C1C1E' },
  teamRole: { fontSize: 14, color: '#8E8E93', marginTop: 4 },
  divider: { width: 40, height: 4, backgroundColor: '#F2F2F7', borderRadius: 2, marginBottom: 20 },
  loveText: { textAlign: 'center', fontSize: 14, color: '#48484A', fontStyle: 'italic', marginBottom: 25 },
  closeBtn: { backgroundColor: '#F2F2F7', paddingHorizontal: 40, paddingVertical: 12, borderRadius: 15 },
  closeBtnText: { color: '#007AFF', fontWeight: '700', fontSize: 16 }
});