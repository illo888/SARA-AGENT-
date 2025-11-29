import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';

export function ProfileScreen() {
  const navigation = useNavigation();
  const { userData, clearUserData } = useUser();
  
  // If no user data, redirect to onboarding
  if (!userData) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="person-off" size={64} color={colors.textLight} />
        <Text style={styles.emptyText}>لم يتم تسجيل الدخول</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Onboarding' as never)}>
          <Text style={styles.emptyLink}>تسجيل الدخول</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const handleLogout = () => {
    Alert.alert(
      'تسجيل الخروج',
      'هل أنت متأكد من رغبتك في تسجيل الخروج؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'تسجيل الخروج', 
          style: 'destructive', 
          onPress: () => {
            clearUserData();
            navigation.navigate('Onboarding' as never);
          }
        }
      ]
    );
  };
  
  const scenarioLabels = {
    safe_gate: 'بوابة آمنة (مغترب)',
    in_saudi: 'داخل السعودية',
    elder: 'كبار السن',
    guest: 'ضيف'
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={[colors.primary, '#0A6B58']}
        style={styles.header}
      >
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={['#fff', '#E8F8F3']}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>{userData.name[0]}</Text>
          </LinearGradient>
        </View>
        <Text style={styles.headerName}>{userData.name}</Text>
        <Text style={styles.headerSubtitle}>سعودي • {userData.city}</Text>
        <View style={styles.scenarioBadge}>
          <Text style={styles.scenarioText}>{scenarioLabels[userData.scenario]}</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>المعلومات الشخصية</Text>
          
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>الهوية الوطنية</Text>
                <Text style={styles.infoValue}>{userData.saudiId}</Text>
              </View>
              <View style={styles.iconContainer}>
                <MaterialIcons name="badge" size={22} color={colors.primary} />
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.infoRow}>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>رقم الجوال</Text>
                <Text style={styles.infoValue}>{userData.phone}</Text>
              </View>
              <View style={styles.iconContainer}>
                <MaterialIcons name="phone" size={22} color={colors.primary} />
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.infoRow}>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>المدينة</Text>
                <Text style={styles.infoValue}>{userData.city}</Text>
              </View>
              <View style={styles.iconContainer}>
                <MaterialIcons name="location-on" size={22} color={colors.primary} />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>النظام</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={[colors.primary, '#0A6B58']}
                style={styles.statGradient}
              >
                <MaterialIcons name="smart-toy" size={28} color="#fff" />
                <Text style={styles.statNumber}>100%</Text>
                <Text style={styles.statLabel}>نظام ذكي</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.statGradient}
              >
                <MaterialIcons name="check-circle" size={28} color="#fff" />
                <Text style={styles.statNumber}>متصل</Text>
                <Text style={styles.statLabel}>الحالة</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={['#FFB800', '#FFA000']}
                style={styles.statGradient}
              >
                <MaterialIcons name="verified" size={28} color="#fff" />
                <Text style={styles.statNumber}>موثق</Text>
                <Text style={styles.statLabel}>نفاذ</Text>
              </LinearGradient>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الإعدادات</Text>
          
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <MaterialIcons name="chevron-left" size={24} color={colors.textLight} />
            <Text style={styles.menuText}>تعديل الملف الشخصي</Text>
            <MaterialIcons name="edit" size={22} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <MaterialIcons name="chevron-left" size={24} color={colors.textLight} />
            <Text style={styles.menuText}>الإشعارات</Text>
            <MaterialIcons name="notifications-active" size={22} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <MaterialIcons name="chevron-left" size={24} color={colors.textLight} />
            <Text style={styles.menuText}>الأمان والخصوصية</Text>
            <MaterialIcons name="security" size={22} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <MaterialIcons name="chevron-left" size={24} color={colors.textLight} />
            <Text style={styles.menuText}>المساعدة والدعم</Text>
            <MaterialIcons name="help" size={22} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, styles.logoutItem]} 
            activeOpacity={0.7}
            onPress={handleLogout}
          >
            <MaterialIcons name="chevron-left" size={24} color="#EF4444" />
            <Text style={[styles.menuText, styles.logoutText]}>تسجيل الخروج</Text>
            <MaterialIcons name="logout" size={22} color="#EF4444" />
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>الإصدار 1.0.0</Text>
        <View style={{ height: 30 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F7FA' 
  },
  header: {
    paddingTop: 54,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center'
  },
  avatarContainer: {
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#fff'
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    fontFamily: 'Tajawal_700Bold',
    color: colors.primary
  },
  headerName: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Tajawal_700Bold',
    color: '#fff',
    textAlign: 'center'
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: 'Tajawal_400Regular',
    color: '#fff',
    opacity: 0.85,
    marginTop: 2,
    textAlign: 'center'
  },
  scenarioBadge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12
  },
  scenarioText: {
    fontSize: 12,
    fontFamily: 'Tajawal_700Bold',
    color: '#fff'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    padding: 40
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Tajawal_700Bold',
    color: colors.text,
    marginTop: 16,
    textAlign: 'center'
  },
  emptyLink: {
    fontSize: 16,
    fontFamily: 'Tajawal_700Bold',
    color: colors.primary,
    marginTop: 12
  },
  content: {
    paddingHorizontal: 16,
    marginTop: -10
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Tajawal_700Bold',
    color: colors.text,
    textAlign: 'right',
    marginBottom: 12,
    marginTop: 8
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3
  },
  infoRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E8F8F3',
    alignItems: 'center',
    justifyContent: 'center'
  },
  infoContent: {
    flex: 1,
    alignItems: 'flex-end',
    marginLeft: 12
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
    color: colors.textLight,
    marginBottom: 4
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Tajawal_700Bold',
    color: colors.text
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4
  },
  statGradient: {
    padding: 14,
    alignItems: 'center'
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Tajawal_700Bold',
    color: '#fff',
    marginTop: 8
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Tajawal_400Regular',
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
    textAlign: 'center'
  },
  menuItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Tajawal_400Regular',
    color: colors.text,
    textAlign: 'right',
    marginLeft: 12
  },
  logoutItem: {
    marginTop: 8
  },
  logoutText: {
    color: '#EF4444'
  },
  version: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 16
  }
});
