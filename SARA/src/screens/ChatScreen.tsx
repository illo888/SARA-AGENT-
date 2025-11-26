import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { colors } from '../constants/colors';
import { ChatBubble } from '../components/ChatBubble';
import { VoiceRecorder } from '../components/VoiceRecorder';
import { sendMessageToGroq } from '../services/groqAPI';
import { convertTextToSpeech } from '../services/voiceTTS';
import { MaterialIcons } from '@expo/vector-icons';
import audioAdapter from '../services/audioAdapter';
import { Message } from '../types';

export function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [autoPlay, setAutoPlay] = useState(true);
  const flatRef = useRef<any>(null);
  const soundRef = useRef<any>(null);
  const [playingId, setPlayingId] = useState<number | null>(null);

  async function sendText() {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), role: 'user', text };
    setMessages((m) => [userMsg, ...m]);
    setText('');

    const reply = String(await sendMessageToGroq(userMsg.text));
    const aiMsg: Message = { id: Date.now() + 1, role: 'assistant', text: reply };
    setMessages((m) => [aiMsg, ...m]);
    if (autoPlay) {
      const sound = await convertTextToSpeech(aiMsg.text);
      if (sound) {
        soundRef.current = sound;
        setPlayingId(aiMsg.id);
        // clear after playback (best-effort)
        audioAdapter.setOnPlaybackStatusUpdate(sound, (status: any) => {
          if (status && status.didJustFinish) {
            setPlayingId(null);
            sound.unloadAsync?.();
          }
        });
      }
    }
  }

  async function playTTS(textToPlay: string, id?: number) {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
      } catch (_) {}
      soundRef.current = null;
    }
    const sound = await convertTextToSpeech(textToPlay);
    if (sound) {
      soundRef.current = sound;
      setPlayingId(id ?? null);
      audioAdapter.setOnPlaybackStatusUpdate(sound, (status: any) => {
        if (status && status.didJustFinish) {
          setPlayingId(null);
          sound.unloadAsync?.();
        }
      });
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <FlatList
        ref={flatRef}
        data={messages}
        inverted
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ChatBubble message={item} onPlay={() => playTTS(item.text, item.id)} isPlaying={playingId === item.id} />
        )}
        contentContainerStyle={{ padding: 16 }}
      />

      <View style={styles.controls}>
        <TouchableOpacity onPress={() => setAutoPlay((p) => !p)} style={styles.autoPlayBtn}>
          <MaterialIcons name={autoPlay ? 'volume-up' : 'volume-off'} size={20} color={colors.primary} />
        </TouchableOpacity>
        <VoiceRecorder onFinished={(uri) => console.log('Recorded:', uri)} />
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="اكتب رسالتك"
          style={styles.input}
          placeholderTextColor={colors.textLight}
        />
        <TouchableOpacity onPress={sendText} style={styles.sendBtn}>
          <MaterialIcons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  controls: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: colors.cardBg
  },
  input: {
    flex: 1,
    marginHorizontal: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    textAlign: 'right'
  },
  sendBtn: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 18
  }
  ,
  autoPlayBtn: {
    marginHorizontal: 8
  }
});
