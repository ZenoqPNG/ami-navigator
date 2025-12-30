import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AnimatedSplashScreen from '../src/components/AnimatedSplashScreen'; // Import du Splash

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* On enveloppe ici pour que l'animation se joue au démarrage */}
      <AnimatedSplashScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="favorites" />
          <Stack.Screen name="settings" />
        </Stack>
      </AnimatedSplashScreen>
    </GestureHandlerRootView>
  );
}