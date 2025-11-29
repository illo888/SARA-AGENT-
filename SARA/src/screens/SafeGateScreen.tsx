import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../constants/colors';
import { MaterialIcons } from '@expo/vector-icons';

// Emergency Saudi hotline numbers
const SAUDI_EMERGENCY_NUMBERS = {
  general: '112', // General emergency in Saudi Arabia
  police: '999',
  ambulance: '997',
  civilDefense: '998',
  safeGateSupport: '920003344' // Mock support number for Safe Gate service
};

export function SafeGateScreen() {
  const [otpRegistered, setOtpRegistered] = useState(false);
  const [vpnEnabled, setVpnEnabled] = useState(false);

  function registerOTP() {
    setOtpRegistered(true);
    Alert.alert('تم التسجيل', 'تم ربط رقمك السعودي بخدمة OTP الآمنة');
  }

  function enableVPN() {
    setVpnEnabled(true);
    Alert.alert('تم التفعيل', 'تم تفعيل VPN السعودي الاستثنائي للبنوك والتطبيقات الحكومية');
  }

  function criticalCall() {
    Alert.alert(
      'اتصال طارئ لمدة 10 دقائق',
      'سيتم فتح اتصال مباشر داخل السعودية. اختر الرقم:',
      [
        {
          text: 'الطوارئ العامة (112)',
          onPress: () => makeCall(SAUDI_EMERGENCY_NUMBERS.general)
        },
        {
          text: 'دعم البوابة الآمنة',
          onPress: () => makeCall(SAUDI_EMERGENCY_NUMBERS.safeGateSupport)
        },
        {
          text: 'الشرطة (999)',
          onPress: () => makeCall(SAUDI_EMERGENCY_NUMBERS.police)
        },
        {
          text: 'إلغاء',
          style: 'cancel'
        }
      ],
      { cancelable: true }
    );
  }

  async function makeCall(phoneNumber: string) {
    const url = `tel:${phoneNumber}`;
    const canOpen = await Linking.canOpenURL(url);
    
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      Alert.alert('خطأ', 'لا يمكن إجراء المكالمة من هذا الجهاز');
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.primary, '#0A6B58']} style={styles.header}>
        <Text style={styles.title}>Saudi Safe Security Gate 🇸🇦</Text>
        <Text style={styles.subtitle}>بوابة آمنة للسعوديين خارج المملكة</Text>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>مزايا البوابة</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <MaterialIcons name="password" size={22} color={colors.primary} />
            <Text style={styles.cardText}>إدارة رموز OTP للتطبيقات السعودية</Text>
          </View>
          <View style={styles.row}>
            <MaterialIcons name="vpn-lock" size={22} color={colors.primary} />
            <Text style={styles.cardText}>VPN سعودي استثنائي للبنوك والخدمات</Text>
          </View>
          <View style={styles.row}>
            <MaterialIcons name="call" size={22} color={colors.primary} />
            <Text style={styles.cardText}>اتصال طارئ لمدة 10 دقائق داخل السعودية</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>الإجراءات</Text>

        <TouchableOpacity style={styles.actionBtn} onPress={registerOTP} activeOpacity={0.8}>
          <LinearGradient colors={[colors.primary, colors.accent]} style={styles.actionGrad}>
            <MaterialIcons name="password" size={20} color="#fff" />
            <Text style={styles.actionText}>{otpRegistered ? 'تم ربط OTP' : 'ربط OTP الآمن'}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={enableVPN} activeOpacity={0.8}>
          <LinearGradient colors={[colors.primary, colors.accent]} style={styles.actionGrad}>
            <MaterialIcons name="vpn-lock" size={20} color="#fff" />
            <Text style={styles.actionText}>{vpnEnabled ? 'VPN مفعّل' : 'تفعيل VPN السعودي'}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={criticalCall} activeOpacity={0.8}>
          <LinearGradient colors={['#DC2626', '#B91C1C']} style={styles.actionGrad}>
            <MaterialIcons name="call" size={22} color="#fff" />
            <Text style={styles.actionText}>اتصال طارئ مباشر (LIVE) 🔴</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <View style={styles.liveCallNote}>
          <MaterialIcons name="phone-in-talk" size={18} color="#DC2626" />
          <Text style={styles.liveCallText}>
            المكالمة مباشرة وحقيقية - سيتم فتح تطبيق الهاتف للاتصال بالأرقام الطارئة السعودية
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>الاشتراك</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>الخدمة باشتراك شهري 29 ريال لتغطية التشغيل</Text>
          <Text style={styles.cardText}>التسجيل الأول عبر السعودية ومن خلال توكلنا</Text>
          <Text style={styles.cardText}>يجب تفعيل رقمك السعودي قبل السفر</Text>
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
  section: { paddingHorizontal: 16, marginTop: 16 },
  sectionTitle: { fontSize: 16, fontFamily: 'Tajawal_700Bold', color: colors.text, textAlign: 'right', marginBottom: 10 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  row: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8, marginBottom: 8 },
  cardText: { fontSize: 14, fontFamily: 'Tajawal_400Regular', color: colors.text, textAlign: 'right' },
  actionBtn: { marginTop: 10 },
  actionGrad: { height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row-reverse', gap: 8 },
  actionText: { color: '#fff', fontFamily: 'Tajawal_700Bold' },
  liveCallNote: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#FCA5A5'
  },
  liveCallText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
    color: '#991B1B',
    textAlign: 'right'
  }
});
