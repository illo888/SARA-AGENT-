import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '../constants/colors';

export const AIWave = ({ size = 180 }: { size?: number }) => {
  const waves = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];

  useEffect(() => {
    const animations = waves.map((w, i) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(w, { toValue: 1, duration: 1600 + i * 350, useNativeDriver: true }),
          Animated.timing(w, { toValue: 0, duration: 0, useNativeDriver: true })
        ])
      );
    });
    Animated.stagger(200, animations).start();
    return () => animations.forEach((a) => a.stop());
  }, []);

  return (
    <View style={[styles.container, { width: size, height: size }]}> 
      {waves.map((w, idx) => (
        <Animated.View
          key={idx}
          style={[
            styles.wave,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              transform: [{ scale: w.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1.7] }) }],
              opacity: w.interpolate({ inputRange: [0, 1], outputRange: [0.4 - idx * 0.12, 0] })
            }
          ]}
        />
      ))}
      <View style={[styles.center, { width: size * 0.4, height: size * 0.4, borderRadius: (size * 0.4) / 2 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  wave: { position: 'absolute', backgroundColor: colors.primary },
  center: { backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }
});

export default AIWave;
