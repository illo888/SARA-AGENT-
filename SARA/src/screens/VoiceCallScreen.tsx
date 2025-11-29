import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Modal, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { AIWave } from '../components/AIWave';
import { transcribeAudio } from '../services/groqWhisper';
import { sendMessageToGroq } from '../services/groqAPI';
import { convertTextToSpeech } from '../services/voiceTTS';
import audioAdapter from '../services/audioAdapter';

interface VoiceCallScreenProps {
  visible: boolean;
  onClose: () => void;
}

type CallState = 'connecting' | 'listening' | 'processing' | 'speaking' | 'ended';

export function VoiceCallScreen({ visible, onClose }: VoiceCallScreenProps) {
  const [callState, setCallState] = useState<CallState>('connecting');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [callDuration, setCallDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const recordingRef = useRef<any>(null);
  const soundRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (visible) {
      // Entry animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start();

      // Start call sequence
      startCall();
    } else {
      fadeAnim.setValue(0);
      cleanup();
    }

    return () => cleanup();
  }, [visible]);

  useEffect(() => {
    // Pulse animation for active states
    if (callState === 'listening' || callState === 'speaking') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true
          })
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [callState]);

  useEffect(() => {
    // Call duration timer
    if (callState !== 'connecting' && callState !== 'ended') {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [callState]);

  async function startCall() {
    try {
      setCallState('connecting');
      setTranscript(['مرحباً! أنا سارا. كيف يمكنني مساعدتك؟']);

      // Simulate connection delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Speak welcome message
      setCallState('speaking');
      await convertTextToSpeech('مرحباً! أنا سارا. كيف يمكنني مساعدتك؟');

      // Start listening
      setCallState('listening');
      await startListening();
    } catch (error) {
      console.error('Start call error:', error);
      Alert.alert('خطأ في المكالمة', 'عذراً، حدث خطأ أثناء بدء المكالمة');
      endCall();
    }
  }

  async function startListening() {
    if (isMuted) return;

    try {
      setIsRecording(true);
      setCallState('listening');

      // Request permissions
      const permission = await audioAdapter.requestRecordingPermissions();
      if (permission.status !== 'granted') {
        Alert.alert('إذن مطلوب', 'يرجى السماح بالوصول إلى الميكروفون');
        return;
      }

      // Set audio mode for recording
      await audioAdapter.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true
      });

      // Create and start recording
      recordingRef.current = audioAdapter.createRecording();
      if (!recordingRef.current) {
        throw new Error('Failed to create recording');
      }

      await recordingRef.current.prepareToRecordAsync({
        isMeteringEnabled: true,
        android: {
          extension: '.m4a',
          outputFormat: 2,
          audioEncoder: 3,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000
        },
        ios: {
          extension: '.m4a',
          outputFormat: 'mpeg4aac',
          audioQuality: 127,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false
        }
      });

      await recordingRef.current.startAsync();

      // Auto-stop after 10 seconds (adjust as needed)
      setTimeout(() => {
        if (isRecording) {
          stopListening();
        }
      }, 10000);
    } catch (error) {
      console.error('Recording error:', error);
      setIsRecording(false);
      setCallState('listening');
    }
  }

  async function stopListening() {
    if (!recordingRef.current || !isRecording) return;

    try {
      setIsRecording(false);
      setCallState('processing');

      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();

      if (!uri) {
        throw new Error('No recording URI');
      }

      // Transcribe audio
      const transcribedText = await transcribeAudio(uri);
      setTranscript((prev) => [...prev, `أنت: ${transcribedText}`]);

      // Get AI response
      const aiResponse = await sendMessageToGroq(transcribedText);
      setTranscript((prev) => [...prev, `سارا: ${aiResponse}`]);

      // Speak response
      setCallState('speaking');
      await convertTextToSpeech(aiResponse);

      // Continue listening
      setCallState('listening');
      await startListening();
    } catch (error) {
      console.error('Stop listening error:', error);
      setCallState('listening');
      Alert.alert('خطأ', 'عذراً، حدث خطأ في معالجة الصوت');
    }
  }

  function toggleMute() {
    setIsMuted(!isMuted);
    if (!isMuted && isRecording) {
      stopListening();
    }
  }

  function toggleSpeaker() {
    setIsSpeakerOn(!isSpeakerOn);
    // Audio mode adjustment would go here
  }

  function endCall() {
    setCallState('ended');
    cleanup();
    setTimeout(() => {
      onClose();
    }, 500);
  }

  function cleanup() {
    if (recordingRef.current) {
      try {
        recordingRef.current.stopAndUnloadAsync();
      } catch (e) {
        console.warn('Cleanup recording error:', e);
      }
    }
    if (soundRef.current) {
      try {
        audioAdapter.stopSound(soundRef.current);
      } catch (e) {
        console.warn('Cleanup sound error:', e);
      }
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setCallDuration(0);
    setTranscript([]);
    setIsRecording(false);
  }

  function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function getWaveState() {
    switch (callState) {
      case 'connecting':
        return 'welcoming';
      case 'listening':
        return 'listening';
      case 'processing':
        return 'thinking';
      case 'speaking':
        return 'answering';
      default:
        return 'idle';
    }
  }

  function getStateText() {
    switch (callState) {
      case 'connecting':
        return 'جاري الاتصال...';
      case 'listening':
        return isRecording ? 'أستمع إليك...' : 'انقر للتحدث';
      case 'processing':
        return 'جاري المعالجة...';
      case 'speaking':
        return 'سارا تتحدث...';
      case 'ended':
        return 'انتهت المكالمة';
    }
  }

  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <LinearGradient
          colors={['#0D7C66', '#41B8A7', '#BDE8CA']}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />

        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.callStatus}>{getStateText()}</Text>
            <Text style={styles.duration}>{formatDuration(callDuration)}</Text>
          </View>

          {/* AI Wave Visualization */}
          <Animated.View style={[styles.waveContainer, { transform: [{ scale: pulseAnim }] }]}>
            <AIWave size={240} state={getWaveState()} />
          </Animated.View>

          {/* AI Name */}
          <View style={styles.nameContainer}>
            <Text style={styles.aiName}>سارا</Text>
            <Text style={styles.aiTitle}>المساعد الذكي</Text>
          </View>

          {/* Transcript Display (Last 3 messages) */}
          <View style={styles.transcriptContainer}>
            {transcript.slice(-3).map((text, idx) => (
              <Text key={idx} style={styles.transcriptText} numberOfLines={2}>
                {text}
              </Text>
            ))}
          </View>

          {/* Control Buttons */}
          <View style={styles.controls}>
            {/* Mute Button */}
            <TouchableOpacity
              style={[styles.controlButton, isMuted && styles.controlButtonActive]}
              onPress={toggleMute}
              activeOpacity={0.7}
            >
              <MaterialIcons name={isMuted ? 'mic-off' : 'mic'} size={32} color="#fff" />
              <Text style={styles.controlLabel}>{isMuted ? 'كتم' : 'ميكروفون'}</Text>
            </TouchableOpacity>

            {/* End Call Button */}
            <TouchableOpacity style={styles.endCallButton} onPress={endCall} activeOpacity={0.7}>
              <LinearGradient
                colors={['#EF4444', '#DC2626']}
                style={styles.endCallGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialIcons name="call-end" size={40} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>

            {/* Speaker Button */}
            <TouchableOpacity
              style={[styles.controlButton, isSpeakerOn && styles.controlButtonActive]}
              onPress={toggleSpeaker}
              activeOpacity={0.7}
            >
              <MaterialIcons name={isSpeakerOn ? 'volume-up' : 'volume-off'} size={32} color="#fff" />
              <Text style={styles.controlLabel}>{isSpeakerOn ? 'سماعة' : 'صامت'}</Text>
            </TouchableOpacity>
          </View>

          {/* Manual Talk Button (for push-to-talk) */}
          {callState === 'listening' && !isRecording && (
            <TouchableOpacity
              style={styles.talkButton}
              onPress={startListening}
              activeOpacity={0.8}
            >
              <Text style={styles.talkButtonText}>اضغط للتحدث</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D7C66'
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingVertical: 20
  },
  header: {
    alignItems: 'center',
    gap: 8
  },
  callStatus: {
    fontSize: 20,
    fontFamily: 'Tajawal_700Bold',
    color: '#fff',
    textAlign: 'center'
  },
  duration: {
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
    color: 'rgba(255,255,255,0.8)'
  },
  waveContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20
  },
  nameContainer: {
    alignItems: 'center',
    gap: 4
  },
  aiName: {
    fontSize: 36,
    fontFamily: 'Tajawal_700Bold',
    color: '#fff'
  },
  aiTitle: {
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
    color: 'rgba(255,255,255,0.9)'
  },
  transcriptContainer: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 16,
    minHeight: 100,
    maxHeight: 150,
    gap: 8
  },
  transcriptText: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    color: '#fff',
    textAlign: 'right'
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20
  },
  controlButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4
  },
  controlButtonActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.8)'
  },
  controlLabel: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
    color: '#fff'
  },
  endCallButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8
  },
  endCallGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center'
  },
  talkButton: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignSelf: 'center',
    marginTop: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)'
  },
  talkButtonText: {
    fontSize: 18,
    fontFamily: 'Tajawal_700Bold',
    color: '#fff'
  }
});
