import React, { useEffect } from 'react';
import { I18nManager } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useFonts, Tajawal_400Regular, Tajawal_700Bold } from '@expo-google-fonts/tajawal';

// Enable RTL layout for Arabic (stay passive in dev)
if (!I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
  // Reload required after changing layout; in Expo this may not take effect instantly but it's ok for demo
}

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({ Tajawal_400Regular, Tajawal_700Bold });

  useEffect(() => {
    const timer = setTimeout(() => SplashScreen.hideAsync(), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!fontsLoaded) return null;

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
