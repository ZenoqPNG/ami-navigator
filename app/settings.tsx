import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomNav from '../src/components/BottomNav';
import { loadSettings, saveSettings } from '../src/utils/storage';

const isNight = new Date().getHours() > 19 || new Date().getHours() < 7;
const Theme = {
  bg: isNight ? '#000000' : '#F8F9FA',
  card: isNight ? '#1C1C1E' : '#FFFFFF',
  text: isNight ? '#FFFFFF' : '#1C1C1E',
  subText: isNight ? '#AEAEB2' : '#8E8E93',
  btn: isNight ? '#2C2C2E' : '#F2F2F7',
};

export default function SettingsScreen() {
  const [soh, setSoh] = useState(100);
  const [showCredits, setShowCredits] = useState(false);

  useEffect(() => {
    loadSettings().then(s => setSoh(s.soh));
  }, []);

  const updateSoh = async (newSoh: number) => {
    Haptics.selectionAsync();
    setSoh(newSoh);
    await saveSettings({ soh: newSoh });
  };

  return (
    <View style={[styles.container, { backgroundColor: Theme.bg }]}>
      <StatusBar style={isNight ? "light" : "dark"} />
      <View style={[styles.header, { backgroundColor: Theme.card }]}>
        <Text style={[styles.headerTitle, { color: Theme.text }]}>Réglages</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.card, { backgroundColor: Theme.card }]}>
          <View style={styles.settingRow}>
            <View>
              <Text style={[styles.settingLabel, { color: Theme.text }]}>Santé batterie (SOH)</Text>
              <Text style={[styles.settingSub, { color: Theme.subText }]}>Capacité réelle de l'Ami</Text>
            </View>
            <View style={[styles.counter, { backgroundColor: Theme.btn }]}>
              <TouchableOpacity onPress={() => updateSoh(Math.max(50, soh - 1))} style={styles.btnAction}><Ionicons name="remove" size={20} color="#007AFF" /></TouchableOpacity>
              <Text style={styles.val}>{soh}%</Text>
              <TouchableOpacity onPress={() => updateSoh(Math.min(100, soh + 1))} style={styles.btnAction}><Ionicons name="add" size={20} color="#007AFF" /></TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity style={[styles.card, { backgroundColor: Theme.card }, styles.creditsBtn]} onPress={() => setShowCredits(true)}>
          <Ionicons name="information-circle-outline" size={22} color={Theme.text} />
          <Text style={[styles.creditsBtnText, { color: Theme.text }]}>Crédits & Infos</Text>
          <Ionicons name="chevron-forward" size={18} color={Theme.subText} />
        </TouchableOpacity>

        <Text style={styles.versionText}>Version 1.0.9</Text>
      </ScrollView>

      {/* Modal crédits (simplifié pour le dark mode) */}
      <Modal visible={showCredits} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
           <View style={[styles.modalContent, { backgroundColor: Theme.card }]}>
              <Text style={[styles.modalTitle, { color: Theme.text }]}>RecyTech</Text>
              <Text style={[styles.teamName, { color: Theme.text }]}>Enzo & Renan</Text>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setShowCredits(false)}>
                <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>Fermer</Text>
              </TouchableOpacity>
           </View>
        </View>
      </Modal>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 25, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerTitle: { fontSize: 26, fontWeight: '900' },
  content: { flex: 1, padding: 20 },
  card: { borderRadius: 20, padding: 20, marginBottom: 15, elevation: 2 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  settingLabel: { fontSize: 16, fontWeight: '700' },
  settingSub: { fontSize: 12, marginTop: 2 },
  counter: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 4 },
  val: { fontSize: 16, fontWeight: '900', marginHorizontal: 15, color: '#007AFF', minWidth: 40, textAlign: 'center' },
  btnAction: { backgroundColor: 'white', width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  creditsBtn: { flexDirection: 'row', alignItems: 'center' },
  creditsBtnText: { flex: 1, marginLeft: 12, fontSize: 16, fontWeight: '600' },
  versionText: { textAlign: 'center', color: '#8E8E93', fontSize: 12, marginTop: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', borderRadius: 30, padding: 30, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  teamName: { fontSize: 16, marginBottom: 20 },
  closeBtn: { marginTop: 10, padding: 10 }
});