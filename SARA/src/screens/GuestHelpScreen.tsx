import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { matchRelativeMock, sendContactRequestMock, openSecureChannelMock, checkTravelRecordMock } from '../services/mockBackend';

export function GuestHelpScreen() {
  const [id, setId] = useState('');
  const [relativeName, setRelativeName] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  async function requestHelp() {
    setStatus('');
    if (!id.trim()) {
      setStatus('الرجاء إدخال رقم الهوية');
      return;
    }
    setLoading(true);
    const travel = await checkTravelRecordMock(id);
    if (!travel.outside) {
      setStatus('يبدو أنك داخل السعودية. يمكنك استخدام نفاذ/توكلنا للوصول الكامل.');
      setLoading(false);
      return;
    }
    if (!relativeName.trim()) {
      setStatus('الرجاء إدخال اسم قريب من الدرجة الأولى أو الثانية');
      setLoading(false);
      return;
    }
    const match = await matchRelativeMock(id, relativeName);
    if (!match.matched) {
      setStatus('لم نجد مطابقات للاسم. الرجاء التأكد من الاسم الكامل.');
      setLoading(false);
      return;
    }
    const contact = await sendContactRequestMock(id, relativeName);
    if (!contact.accepted) {
      setStatus('رفض القريب الطلب. جرّب شخصاً آخر أو اطلب المساعدة من السفارة.');
      setLoading(false);
      return;
    }
    const channel = await openSecureChannelMock(id, relativeName);
    setStatus(`تم فتح قناة تواصل آمنة مع ${relativeName}. رقم القناة: ${channel.channelId}`);
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.primary, '#0A6B58']} style={styles.header}>
        <Text style={styles.title}>مساعدة محدودة للزوار</Text>
        <Text style={styles.subtitle}>سنساعدك بالوصول المحدود في الحالات الطارئة</Text>
      </LinearGradient>

      <View style={styles.form}>
        <Text style={styles.label}>رقم الهوية الوطنية</Text>
        <View style={styles.inputRow}>
          <MaterialIcons name="badge" size={20} color={colors.textLight} />
          <TextInput value={id} onChangeText={setId} placeholder="1XXXXXXXXX" keyboardType="number-pad" maxLength={10} style={styles.input} textAlign="right" />
        </View>

        <Text style={[styles.label, { marginTop: 10 }]}>اسم قريب من الدرجة الأولى/الثانية</Text>
        <View style={styles.inputRow}>
          <MaterialIcons name="person" size={20} color={colors.textLight} />
          <TextInput value={relativeName} onChangeText={setRelativeName} placeholder="اكتب الاسم الكامل" style={styles.input} textAlign="right" />
        </View>

        <TouchableOpacity onPress={requestHelp} style={styles.cta} disabled={loading}>
          <LinearGradient colors={[colors.primary, colors.accent]} style={styles.ctaGradient}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.ctaText}>طلب المساعدة</Text>}
          </LinearGradient>
        </TouchableOpacity>

        {!!status && (
          <View style={styles.statusBox}>
            <Text style={styles.statusText}>{status}</Text>
          </View>
        )}

        <View style={styles.helpBox}>
          <Text style={styles.helpTitle}>بدون وصول؟</Text>
          <Text style={styles.helpText}>يمكننا تزويدك بأرقام ومواقع سفارات السعودية بالخارج، أو مساعدتك للوصول المحدود عبر أقاربك.</Text>
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
  form: { paddingHorizontal: 16, paddingTop: 18 },
  label: { fontSize: 13, color: colors.textLight, textAlign: 'right', fontFamily: 'Tajawal_400Regular' },
  inputRow: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, height: 48, marginTop: 6 },
  input: { flex: 1, fontSize: 15, fontFamily: 'Tajawal_400Regular', color: colors.text },
  cta: { marginTop: 18 },
  ctaGradient: { height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  ctaText: { color: '#fff', fontFamily: 'Tajawal_700Bold' },
  statusBox: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginTop: 12 },
  statusText: { fontFamily: 'Tajawal_400Regular', textAlign: 'right', color: colors.text },
  helpBox: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginTop: 12 },
  helpTitle: { fontFamily: 'Tajawal_700Bold', textAlign: 'right', color: colors.text },
  helpText: { fontFamily: 'Tajawal_400Regular', textAlign: 'right', color: colors.textLight, marginTop: 4 }
});
