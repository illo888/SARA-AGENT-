import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '../constants/colors';

type AIWaveState = 'idle' | 'welcoming' | 'answering' | 'thinking' | 'listening';

interface AIWaveProps {
  size?: number;
  state?: AIWaveState;
}

const STATE_COLORS = {
  idle: colors.primary,        // Blue - default
  welcoming: '#10B981',        // Green - welcoming/greeting
  answering: '#10B981',        // Green - providing answer
  thinking: '#EF4444',         // Red - processing/thinking
  listening: '#F59E0B'         // Amber - listening to voice
};

const STATE_SPEEDS = {
  idle: 1600,
  welcoming: 1200,    // Faster for welcoming
  answering: 1400,    // Medium speed for answering
  thinking: 800,      // Very fast for thinking
  listening: 1000     // Fast for listening
};

export const AIWave = ({ size = 180, state = 'idle' }: AIWaveProps) => {
  const waves = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];
  const waveColor = STATE_COLORS[state];
  const baseDuration = STATE_SPEEDS[state];

  useEffect(() => {
    const animations = waves.map((w, i) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(w, { toValue: 1, duration: baseDuration + i * 300, useNativeDriver: true }),
          Animated.timing(w, { toValue: 0, duration: 0, useNativeDriver: true })
        ])
      );
    });
    Animated.stagger(180, animations).start();
    return () => animations.forEach((a) => a.stop());
  }, [state, baseDuration]);

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
              backgroundColor: waveColor,
              transform: [{ scale: w.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1.7] }) }],
              opacity: w.interpolate({ inputRange: [0, 1], outputRange: [0.45 - idx * 0.13, 0] })
            }
          ]}
        />
      ))}
      <View style={[styles.center, { width: size * 0.4, height: size * 0.4, borderRadius: (size * 0.4) / 2, backgroundColor: waveColor }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  wave: { position: 'absolute' },
  center: { alignItems: 'center', justifyContent: 'center' }
});
