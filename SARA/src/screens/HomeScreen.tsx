import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { mockUserData } from '../constants/mockData';
import { colors } from '../constants/colors';
import { ServiceCard } from '../components/ServiceCard';
import { MaterialIcons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { User } from '../types';
import AIWave from '../components/AIWave';
import { AnimatedButton } from '../components/AnimatedButton';

export function HomeScreen() {
  const navigation = useNavigation();
  const user: User = mockUserData;

  return (
    <LinearGradient colors={[colors.background, '#E8F8F3']} style={[styles.container, { paddingTop: 54 }]}>
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.welcome}>مرحباً {user.name} 👋</Text>
      </View>
      <View style={styles.aiContainer}>
        <AIWave size={240} />
        <View style={styles.actionCenter}>
          <AnimatedButton title="ابدأ محادثة" onPress={() => navigation.navigate('Chat' as never)} />
          <TouchableOpacity style={styles.heart} onPress={() => console.log('Liked!')}>
            <FontAwesome name="heart" size={18} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.heart, { marginLeft: 8 }]} onPress={() => Linking.openURL(`tel:${user.phone || '800123456'}`)}>
            <FontAwesome name="phone" size={14} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.cardBg }]}
        >
          <Text style={styles.statTitle}>الخدمات</Text>
          <Text style={styles.statNumber}>{user.services.length}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.cardBg }]}
        >
          <Text style={styles.statTitle}>التنبيهات</Text>
          <Text style={styles.statNumber}>{user.notifications.length}</Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: 16, paddingTop: 18 }}>
        <Text style={{ textAlign: 'right', marginBottom: 12, fontWeight: '700' }}>خدماتك</Text>
        <FlatList
          data={user.services}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <ServiceCard service={item} />}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Chat' as never)}
      >
        <MaterialIcons name="chat" size={24} color="#fff" />
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  aiContainer: {
    marginTop: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  },
  heart: {
    marginTop: 12,
    backgroundColor: colors.secondary,
    padding: 8,
    borderRadius: 20
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 8
  },
  welcome: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Tajawal_700Bold',
    color: colors.text,
    textAlign: 'right'
  },
  statsContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8
  },
  statCard: {
    flex: 1,
    marginHorizontal: 6,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  statTitle: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'right'
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'right'
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: colors.primary,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5
  }
});
