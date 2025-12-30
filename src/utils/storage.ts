import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = '@miniway_settings';

export const saveSettings = async (settings: { soh: number }) => {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error("Erreur sauvegarde");
  }
};

export const loadSettings = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(SETTINGS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : { soh: 100 };
  } catch (e) {
    return { soh: 100 };
  }
};