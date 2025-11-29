import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export function ElderModeScreen() {
  const nav = useNavigation();

  function callAgent() {
    Alert.alert('اتصال بوكيل سارة', 'سيتم التواصل مع وكيل سارة لتقديم المساعدة (محاكاة)');
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.primary, '#0A6B58']} style={styles.header}>
        <Text style={styles.title}>وضع كبار السن</Text>
        <Text style={styles.subtitle}>واجهة مبسطة للغاية</Text>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.question}>هل ترغب بالتواصل مع وكيل سارة؟</Text>
        <View style={styles.row}>
          <TouchableOpacity style={[styles.btn, styles.yes]} onPress={callAgent}>
            <MaterialIcons name="call" size={24} color="#fff" />
            <Text style={styles.btnText}>نعم</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.no]} onPress={() => nav.navigate('Chat' as never)}>
            <MaterialIcons name="close" size={24} color="#fff" />
            <Text style={styles.btnText}>لا</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: { paddingTop: 54, paddingBottom: 20, paddingHorizontal: 20 },
  title: { fontSize: 22, fontFamily: 'Tajawal_700Bold', color: '#fff', textAlign: 'center' },
  subtitle: { fontSize: 13, fontFamily: 'Tajawal_400Regular', color: '#fff', opacity: 0.9, textAlign: 'center', marginTop: 4 },
  content: { paddingHorizontal: 16, marginTop: 20, alignItems: 'center' },
  question: { fontSize: 20, fontFamily: 'Tajawal_700Bold', color: colors.text, textAlign: 'center' },
  row: { flexDirection: 'row', gap: 12, marginTop: 20 },
  btn: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 16, paddingVertical: 16, paddingHorizontal: 24 },
  yes: { backgroundColor: colors.success },
  no: { backgroundColor: colors.error },
  btnText: { color: '#fff', fontFamily: 'Tajawal_700Bold', fontSize: 18 }
});
