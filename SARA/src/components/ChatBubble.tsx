import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { Message } from '../types';

export const ChatBubble = ({ message, onPlay, isPlaying = false }: { message: Message; onPlay?: () => void; isPlaying?: boolean }) => {
  const isUser = message.role === 'user';
  return (
    <View style={[styles.container, isUser ? styles.userBubble : styles.aiBubble]}>
      <Text style={[styles.text, { textAlign: isUser ? 'right' : 'right' }]}>{
        typeof message.text === 'string' ? message.text : JSON.stringify(message.text)
      }</Text>
      {!isUser && (
        <TouchableOpacity style={styles.play} onPress={onPlay}>
          <MaterialIcons name={isPlaying ? 'pause' : 'play-arrow'} size={18} color={colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginVertical: 6,
    borderRadius: 12,
    maxWidth: '85%'
  },
  userBubble: {
    backgroundColor: '#E7F9F3',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 2
  },
  aiBubble: {
    backgroundColor: '#F3F4F6',
    alignSelf: 'flex-end'
  },
  text: {
    color: colors.text,
    fontSize: 14
    ,fontFamily: 'Tajawal_400Regular'
  },
  play: {
    marginTop: 8,
    alignSelf: 'flex-start'
  }
});
