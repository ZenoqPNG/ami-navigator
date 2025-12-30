import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';
import { MotiText, MotiView } from 'moti';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

// On empêche le splash natif de partir trop vite
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function AnimatedSplashScreen({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);

  useEffect(() => {
    // On simule le chargement des ressources (API, Storage, etc.)
    setTimeout(async () => {
      setIsReady(true);
      await SplashScreen.hideAsync();
      
      // On laisse l'animation se finir avant d'afficher l'app
      setTimeout(() => setAnimationFinished(true), 2500);
    }, 500);
  }, []);

  if (!animationFinished) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#007AFF', '#0055BB']}
          style={StyleSheet.absoluteFill}
        />
        
        {/* LOGO ANIMÉ */}
        <MotiView
          from={{ opacity: 0, scale: 0.5, translateY: 20 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 100 }}
          style={styles.content}
        >
          <Image 
            source={require('../../assets/images/splash.png')} // On change ami_logo.png par splash.png
            style={styles.logo} 
            resizeMode="contain" 
        />
          <MotiText 
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 500 }}
            style={styles.title}
          >
            MINIWAY
          </MotiText>
        </MotiView>

        {/* BARRE DE CHARGEMENT "TECH" */}
        <View style={styles.loaderBg}>
          <MotiView
            from={{ width: 0 }}
            animate={{ width: 180 }}
            transition={{ type: 'timing', duration: 2000 }}
            style={styles.loaderFill}
          />
        </View>

        <Text style={styles.footerText}>Initialisation des systèmes...</Text>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { alignItems: 'center' },
  logo: { width: 180, height: 180 },
  title: { 
    color: 'white', 
    fontSize: 22, 
    fontWeight: '900', 
    marginTop: 20, 
    letterSpacing: 4 
  },
  loaderBg: { 
    width: 180, 
    height: 4, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    borderRadius: 2, 
    marginTop: 40,
    overflow: 'hidden'
  },
  loaderFill: { height: '100%', backgroundColor: 'white' },
  footerText: { 
    position: 'absolute', 
    bottom: 50, 
    color: 'rgba(255,255,255,0.6)', 
    fontSize: 10, 
    fontWeight: '700', 
    textTransform: 'uppercase' 
  }
});