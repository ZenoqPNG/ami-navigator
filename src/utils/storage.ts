import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveSettings = async (settings: any) => {
  try {
    await AsyncStorage.setItem('@ami_settings', JSON.stringify(settings));
  } catch (e) { console.error("Erreur sauvegarde", e); }
};

export const loadSettings = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@ami_settings');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) { return null; }
};

export const saveFavorites = async (favs: any[]) => {
  try {
    await AsyncStorage.setItem('@ami_favs', JSON.stringify(favs));
  } catch (e) { console.error("Erreur favs", e); }
};

export const loadFavorites = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@ami_favs');
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) { return []; }
};