import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { Message } from '../types';

export const ChatBubble = ({ message, onPlay, isPlaying = false }: { message: Message; onPlay?: () => void; isPlaying?: boolean }) => {
  const isUser = message.role === 'user';
  return (
    <View style={[styles.wrapper, isUser ? styles.userWrapper : styles.aiWrapper]}>
      {isUser ? (
        <LinearGradient
          colors={[colors.primary, '#0A6B58']}
          style={[styles.container, styles.userBubble]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={[styles.text, styles.userText]}>
            {typeof message.text === 'string' ? message.text : JSON.stringify(message.text)}
          </Text>
        </LinearGradient>
      ) : (
        <View style={[styles.container, styles.aiBubble]}>
          <View style={styles.aiHeader}>
            <View style={styles.aiAvatar}>
              <MaterialIcons name="smart-toy" size={16} color={colors.primary} />
            </View>
            <Text style={styles.aiName}>سارا</Text>
          </View>
          <Text style={[styles.text, styles.aiText]}>
            {typeof message.text === 'string' ? message.text : JSON.stringify(message.text)}
          </Text>
          {onPlay && (
            <TouchableOpacity 
              style={styles.playBtn} 
              onPress={onPlay}
              activeOpacity={0.7}
            >
              <MaterialIcons 
                name={isPlaying ? 'pause-circle' : 'play-circle'} 
                size={24} 
                color={colors.primary} 
              />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 6,
    maxWidth: '80%'
  },
  userWrapper: {
    alignSelf: 'flex-start'
  },
  aiWrapper: {
    alignSelf: 'flex-end'
  },
  container: {
    padding: 14,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2
  },
  userBubble: {
    borderBottomLeftRadius: 4
  },
  aiBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomRightRadius: 4
  },
  aiHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 8
  },
  aiAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E8F8F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6
  },
  aiName: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Tajawal_700Bold',
    color: colors.primary
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: 'Tajawal_400Regular'
  },
  userText: {
    color: '#FFFFFF',
    textAlign: 'right'
  },
  aiText: {
    color: colors.text,
    textAlign: 'right'
  },
  playBtn: {
    marginTop: 10,
    alignSelf: 'flex-start'
  }
});
