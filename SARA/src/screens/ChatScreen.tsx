import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Animated, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../constants/colors';
import { ChatBubble } from '../components/ChatBubble';
import { VoiceRecorder } from '../components/VoiceRecorder';
import { VoiceCallScreen } from './VoiceCallScreen';
import { sendMessageToGroq } from '../services/groqAPI';
import { convertTextToSpeech } from '../services/voiceTTS';
import { MaterialIcons } from '@expo/vector-icons';
import audioAdapter from '../services/audioAdapter';
import { Message } from '../types';
import { AIWave } from '../components/AIWave';

export function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [autoPlay, setAutoPlay] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [waveState, setWaveState] = useState<'idle' | 'welcoming' | 'answering' | 'thinking' | 'listening'>('idle');
  const [showVoiceCall, setShowVoiceCall] = useState(false);
  const flatRef = useRef<any>(null);
  const soundRef = useRef<any>(null);
  const [playingId, setPlayingId] = useState<number | null>(null);

  useEffect(() => {
    // Welcome message when chat opens
    setWaveState('welcoming');
    const welcomeMsg: Message = {
      id: Date.now(),
      role: 'assistant',
      text: 'مرحباً بك! أنا سارة، مساعدتك الذكية للخدمات الحكومية السعودية. كيف يمكنني مساعدتك اليوم؟'
    };
    setMessages([welcomeMsg]);
    setTimeout(() => setWaveState('idle'), 3000);
  }, []);

  async function sendText() {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { id: Date.now(), role: 'user', text: text.trim() };
    setMessages((m) => [userMsg, ...m]);
    const userText = text.trim();
    setText('');
    setIsLoading(true);
    setWaveState('thinking');

    try {
      const reply = await sendMessageToGroq(userText);
      setWaveState('answering');
      const aiMsg: Message = { id: Date.now() + 1, role: 'assistant', text: reply };
      setMessages((m) => [aiMsg, ...m]);
      
      if (autoPlay) {
        playTTS(aiMsg.text, aiMsg.id);
      } else {
        setTimeout(() => setWaveState('idle'), 2000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setWaveState('idle');
      const errorMsg: Message = {
        id: Date.now() + 2,
        role: 'assistant',
        text: 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.'
      };
      setMessages((m) => [errorMsg, ...m]);
    } finally {
      setIsLoading(false);
    }
  }

  async function playTTS(textToPlay: string, id?: number) {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
      } catch (_) {}
      soundRef.current = null;
      setPlayingId(null);
    }
    
    try {
      const sound = await convertTextToSpeech(textToPlay);
      if (sound) {
        soundRef.current = sound;
        setPlayingId(id ?? null);
        audioAdapter.setOnPlaybackStatusUpdate(sound, (status: any) => {
          if (status && status.didJustFinish) {
            setPlayingId(null);
            soundRef.current = null;
            setWaveState('idle');
          }
        });
      }
    } catch (error) {
      console.error('TTS Error:', error);
      setPlayingId(null);
      setWaveState('idle');
    }
  }

  async function handleVoiceRecording(uri: string) {
    // For now, just show a message that voice was recorded
    // In production, you'd transcribe this with a speech-to-text API
    setWaveState('listening');
    const voiceMsg: Message = {
      id: Date.now(),
      role: 'user',
      text: '[تم إرسال رسالة صوتية]'
    };
    setMessages((m) => [voiceMsg, ...m]);
    
    setTimeout(() => setWaveState('idle'), 2000);
    const response: Message = {
      id: Date.now() + 1,
      role: 'assistant',
      text: 'عذراً، معالجة الرسائل الصوتية قيد التطوير. يرجى استخدام الرسائل النصية حالياً.'
    };
    setMessages((m) => [response, ...m]);
  }

  function startVoiceCall() {
    setShowVoiceCall(true);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <LinearGradient
        colors={['#0D7C66', '#0A6B58']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={startVoiceCall} style={styles.callButton}>
            <MaterialIcons name="phone" size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <View style={styles.headerWaveContainer}>
              <AIWave size={50} state={waveState} />
            </View>
            <Text style={styles.headerTitle}>سارا 🤖</Text>
            <Text style={styles.headerSubtitle}>مساعدتك الذكية</Text>
          </View>
          
          <View style={styles.callButton} />
        </View>
      </LinearGradient>

      {/* Messages Area */}
      <FlatList
        ref={flatRef}
        data={messages}
        inverted
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ChatBubble 
            message={item} 
            onPlay={item.role === 'assistant' && item.id !== messages[messages.length - 1]?.id ? () => playTTS(item.text, item.id) : undefined}
            isPlaying={playingId === item.id} 
          />
        )}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
        style={styles.messageArea}
      />

      {/* Typing Indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <View style={styles.typingDots}>
            <View style={[styles.dot, styles.dot1]} />
            <View style={[styles.dot, styles.dot2]} />
            <View style={[styles.dot, styles.dot3]} />
          </View>
          <Text style={styles.loadingText}>سارا تكتب...</Text>
        </View>
      )}

      {/* Input Controls - ALWAYS VISIBLE */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.controlsWrapper}>
          <View style={styles.controls}>
            <View style={styles.inputRow}>
              {/* Send Button */}
              <TouchableOpacity 
                onPress={sendText} 
                style={[styles.sendBtn, (!text.trim() || isLoading) && styles.sendBtnDisabled]}
                disabled={!text.trim() || isLoading}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={text.trim() && !isLoading ? [colors.primary, colors.accent] : ['#ccc', '#aaa']}
                  style={styles.sendBtnGradient}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <MaterialIcons name="send" size={22} color="#fff" />
                  )}
                </LinearGradient>
              </TouchableOpacity>
              
              {/* Text Input */}
              <TextInput
                value={text}
                onChangeText={setText}
                placeholder="اكتب رسالتك هنا..."
                style={styles.input}
                placeholderTextColor={colors.textLight}
                multiline
                maxLength={500}
                returnKeyType="send"
                onSubmitEditing={sendText}
                editable={!isLoading}
              />
              
              {/* Voice Recorder */}
              <VoiceRecorder onFinished={handleVoiceRecording} />
              
              {/* Volume Toggle */}
              <TouchableOpacity 
                onPress={() => setAutoPlay((p) => !p)} 
                style={styles.iconBtn}
                activeOpacity={0.7}
              >
                <MaterialIcons 
                  name={autoPlay ? 'volume-up' : 'volume-off'} 
                  size={24} 
                  color={autoPlay ? colors.primary : colors.textLight} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Voice Call Screen */}
      <VoiceCallScreen visible={showVoiceCall} onClose={() => setShowVoiceCall(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F7FA'
  },
  header: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 16
  },
  headerContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center'
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerWaveContainer: {
    marginBottom: 6
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Tajawal_700Bold',
    color: '#fff',
    textAlign: 'center'
  },
  headerSubtitle: {
    fontSize: 11,
    fontFamily: 'Tajawal_400Regular',
    color: '#fff',
    opacity: 0.85,
    marginTop: 2,
    textAlign: 'center'
  },
  messageArea: {
    flex: 1
  },
  messageList: {
    padding: 16,
    paddingBottom: 16
  },
  loadingContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 8
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary
  },
  dot1: {
    opacity: 0.4
  },
  dot2: {
    opacity: 0.7
  },
  dot3: {
    opacity: 1
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Tajawal_700Bold',
    color: colors.primary,
    marginRight: 8
  },
  controlsWrapper: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
    paddingBottom: Platform.OS === 'ios' ? 34 : 0
  },
  controls: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'android' ? 12 : 0
  },
  inputRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 18,
    textAlign: 'right',
    fontFamily: 'Tajawal_400Regular',
    fontSize: 16,
    maxHeight: 120,
    minHeight: 50,
    borderWidth: 2,
    borderColor: '#E5E7EB'
  },
  sendBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5
  },
  sendBtnDisabled: {
    opacity: 0.5,
    shadowOpacity: 0
  },
  sendBtnGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconBtn: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB'
  }
});
