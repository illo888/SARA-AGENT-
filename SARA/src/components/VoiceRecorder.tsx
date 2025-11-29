import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import audioAdapter from '../services/audioAdapter';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

export const VoiceRecorder = ({ onFinished }: { onFinished?: (uri: string) => void }) => {
  const [recording, setRecording] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const animRef = useRef<any>(null);

  async function startRecording() {
    try {
      const permission = await audioAdapter.requestRecordingPermissions();
      if (permission.status !== 'granted') {
        console.warn('Recording permission not granted');
        return;
      }

      await audioAdapter.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true
      });

      const recording = audioAdapter.createRecording();
      if (!recording) {
        console.warn('Could not create recording instance');
        return;
      }
      
      const preset = audioAdapter?.Audio?.RECORDING_OPTIONS_PRESET_HIGH_QUALITY || (audioAdapter?.Audio?.RECORDING_OPTIONS_PRESET_LOW_QUALITY || {});
      await recording.prepareToRecordAsync(preset);
      await recording.startAsync();

      setRecording(recording);
      setIsRecording(true);
      animRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, { toValue: 1.2, duration: 400, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1.0, duration: 400, useNativeDriver: true })
        ])
      );
      animRef.current.start();
    } catch (err) {
      console.error('Failed to start recording', err);
      setIsRecording(false);
    }
  }

  async function stopRecording() {
    try {
      if (!recording) return;
      await recording?.stopAndUnloadAsync();
      const uri = recording?.getURI();
      setIsRecording(false);
      animRef.current?.stop();
      animRef.current = null;
      setRecording(null);
      if (onFinished && uri) {
        onFinished(uri);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
      setIsRecording(false);
      setRecording(null);
    }
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPressIn={startRecording}
      onPressOut={stopRecording}
      style={styles.iconBtn}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <MaterialIcons 
          name={isRecording ? 'mic' : 'mic-none'} 
          size={24} 
          color={isRecording ? colors.error : colors.textLight} 
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    marginTop: 6,
    fontSize: 12,
    color: colors.textLight
  }
});
