import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';
import { MotiView, useAnimationState } from 'moti';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

SplashScreen.preventAutoHideAsync();

interface AnimatedSplashScreenProps {
  children?: React.ReactNode;
}

export default function AnimatedSplashScreen({ children }: AnimatedSplashScreenProps) {
  const [isSplashAnimationFinished, setIsSplashAnimationFinished] = useState(false);

  // 1. Animation du Logo (Effet Rebond Spring)
  const logoAnimation = useAnimationState({
    from: { opacity: 0, scale: 0.5, translateY: 20 },
    to: { opacity: 1, scale: 1, translateY: 0 },
    exit: { opacity: 0, scale: 1.5 },
  });

  // 2. Animation de la barre de chargement
  const loadingBarAnimation = useAnimationState({
    from: { width: 0 },
    to: { width: width * 0.6 }, // 60% de la largeur de l'écran
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Temps d'attente pour laisser l'animation se jouer (3 secondes)
        // C'est ici que tu peux ajuster la durée totale
        await new Promise(resolve => setTimeout(resolve, 3000)); 
      } catch (e) {
        console.warn(e);
      } finally {
        // Une fois le temps écoulé, on cache le splash natif et on switch
        await SplashScreen.hideAsync();
        setIsSplashAnimationFinished(true);
      }
    }

    prepare();
    
    // On lance les animations d'entrée immédiatement
    logoAnimation.transitionTo('to');
    loadingBarAnimation.transitionTo('to');
  }, []);

  if (!isSplashAnimationFinished) {
    return (
      <LinearGradient
        colors={['#007AFF', '#0047AB']} 
        style={styles.container}
      >
        <MotiView
          state={logoAnimation}
          transition={{ 
            type: 'spring', 
            damping: 7,      // Plus bas = plus de rebond
            stiffness: 120,  // Plus haut = plus rapide
            mass: 0.8 
          }}
          style={styles.logoContainer}
        >
          <Image 
            source={require('../../assets/images/splash.png')} 
            style={styles.logo} 
            resizeMode="contain" 
          />
          <Text style={styles.appName}>MiniWay</Text>
        </MotiView>
        
        <View style={styles.loaderWrapper}>
            <MotiView
              state={loadingBarAnimation}
              transition={{ 
                type: 'timing', 
                duration: 2500, // La barre met 2.5s à se remplir
                delay: 200 
              }}
              style={styles.loadingBarBackground}
            >
              <LinearGradient
                colors={['#FFFFFF', '#E0E0E0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.loadingBarFill}
              />
            </MotiView>
            <Text style={styles.loadingText}>Chargement des systèmes...</Text>
        </View>
      </LinearGradient>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logo: {
    width: 180,
    height: 180,
  },
  appName: {
    fontSize: 32,
    fontWeight: '900',
    color: 'white',
    marginTop: 10,
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 5
  },
  loaderWrapper: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
  },
  loadingBarBackground: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  loadingBarFill: {
    height: '100%',
    width: '100%',
  },
  loadingText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 10,
    letterSpacing: 1,
    textTransform: 'uppercase'
  }
});