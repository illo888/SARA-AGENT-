import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SaraLogoProps {
  size?: number;
  animated?: boolean;
}

export const SaraLogo = ({ size = 200, animated = true }: SaraLogoProps) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const waveAnim1 = useRef(new Animated.Value(0)).current;
  const waveAnim2 = useRef(new Animated.Value(0)).current;
  const waveAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animated) return;

    // Slow rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 25000,
        useNativeDriver: true
      })
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.08,
          duration: 1800,
          useNativeDriver: true
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true
        })
      ])
    ).start();

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true
        })
      ])
    ).start();

    // Wave animations
    [waveAnim1, waveAnim2, waveAnim3].forEach((wave, idx) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(idx * 300),
          Animated.timing(wave, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true
          }),
          Animated.timing(wave, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true
          })
        ])
      ).start();
    });
  }, [animated]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.6]
  });

  return (
    <View style={[styles.container, { width: size + 80, height: size + 120 }]}>
      {/* Main logo circle */}
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        {/* Outer glow rings */}
        {animated && (
          <>
            <Animated.View
              style={[
                styles.glowRing,
                {
                  width: size * 1.5,
                  height: size * 1.5,
                  borderRadius: size * 0.75,
                  opacity: glowOpacity,
                  borderColor: '#0D7C66',
                  borderWidth: 2
                }
              ]}
            />
            <Animated.View
              style={[
                styles.glowRing,
                {
                  width: size * 1.3,
                  height: size * 1.3,
                  borderRadius: size * 0.65,
                  opacity: glowOpacity,
                  borderColor: '#41B8A7',
                  borderWidth: 3
                }
              ]}
            />
          </>
        )}

        {/* Rotating outer decorative ring */}
        <Animated.View
          style={{
            position: 'absolute',
            width: size * 1.1,
            height: size * 1.1,
            transform: [{ rotate: animated ? rotate : '0deg' }]
          }}
        >
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x = Math.cos(angle) * (size * 0.55);
            const y = Math.sin(angle) * (size * 0.55);
            return (
              <View
                key={i}
                style={{
                  position: 'absolute',
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: i % 3 === 0 ? '#41B8A7' : '#0D7C66',
                  opacity: 0.6,
                  left: size * 0.55 + x - 2,
                  top: size * 0.55 + y - 2
                }}
              />
            );
          })}
        </Animated.View>

        {/* Main gradient circle with logo */}
        <Animated.View
          style={{
            width: size,
            height: size,
            transform: [{ scale: animated ? scaleAnim : 1 }]
          }}
        >
          <LinearGradient
            colors={['#0D7C66', '#41B8A7', '#BDE8CA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#0D7C66',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.4,
              shadowRadius: 20,
              elevation: 15
            }}
          >
            {/* Inner decorative ring */}
            <View
              style={{
                position: 'absolute',
                width: size * 0.7,
                height: size * 0.7,
                borderRadius: (size * 0.7) / 2,
                borderWidth: 2,
                borderColor: '#fff',
                opacity: 0.2
              }}
            />

            {/* Wave visualization */}
            <View style={{ position: 'absolute', flexDirection: 'row', gap: 4 }}>
              {[waveAnim1, waveAnim2, waveAnim3].map((wave, idx) => {
                const waveScale = wave.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1.2]
                });
                const waveOpacity = wave.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 0]
                });
                return (
                  <Animated.View
                    key={idx}
                    style={{
                      width: 6,
                      height: 40,
                      backgroundColor: '#fff',
                      borderRadius: 3,
                      transform: [{ scaleY: waveScale }],
                      opacity: waveOpacity
                    }}
                  />
                );
              })}
            </View>

            {/* Arabic text سارا */}
            <Text
              style={{
                fontSize: size * 0.22,
                fontWeight: '900',
                color: '#fff',
                textShadowColor: 'rgba(0,0,0,0.3)',
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 4,
                letterSpacing: 2
              }}
            >
              سارا
            </Text>

            {/* Center AI indicator dot */}
            <View
              style={{
                position: 'absolute',
                bottom: size * 0.15,
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: '#fff',
                shadowColor: '#fff',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 6,
                elevation: 5
              }}
            />
          </LinearGradient>
        </Animated.View>
      </View>

      {/* English text below */}
      <View style={styles.textContainer}>
        <Animated.Text
          style={[
            styles.englishText,
            {
              opacity: animated ? glowOpacity.interpolate({ inputRange: [0.2, 0.6], outputRange: [0.8, 1] }) : 1
            }
          ]}
        >
          SARA
        </Animated.Text>
        <Text style={styles.arabicSubtext}>المساعد الذكي</Text>
        <Animated.Text
          style={[
            styles.subText,
            {
              opacity: animated ? glowOpacity.interpolate({ inputRange: [0.2, 0.6], outputRange: [0.5, 0.8] }) : 0.7
            }
          ]}
        >
          Smart AI Assistant
        </Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  glowRing: {
    position: 'absolute',
    borderWidth: 2,
    borderStyle: 'solid'
  },
  textContainer: {
    marginTop: 24,
    alignItems: 'center',
    gap: 6
  },
  englishText: {
    fontSize: 42,
    fontWeight: '900',
    color: '#0D7C66',
    letterSpacing: 12,
    textShadowColor: '#41B8A7',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 10
  },
  arabicSubtext: {
    fontSize: 18,
    fontWeight: '700',
    color: '#41B8A7',
    letterSpacing: 1
  },
  subText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#888',
    letterSpacing: 2,
    textTransform: 'uppercase'
  }
});
