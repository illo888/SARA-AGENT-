import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { mockUserData } from '../constants/mockData';
import { colors } from '../constants/colors';
import { ServiceCard } from '../components/ServiceCard';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { User } from '../types';
import { AIWave } from '../components/AIWave';
import { AnimatedButton } from '../components/AnimatedButton';

export function HomeScreen() {
  const navigation = useNavigation();
  const user: User = mockUserData;
  const scrollY = new Animated.Value(0);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.8],
    extrapolate: 'clamp'
  });

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={['#FFFFFF', '#E8F8F3']} 
        style={StyleSheet.absoluteFillObject}
      />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => navigation.navigate('Profile' as never)}>
              <MaterialIcons name="person-outline" size={28} color={colors.primary} />
            </TouchableOpacity>
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeLabel}>مرحباً بك</Text>
              <Text style={styles.welcome}>{user.name.split(' ')[0]} 👋</Text>
            </View>
            <TouchableOpacity onPress={() => Linking.openURL(`tel:${user.phone || '800123456'}`)}>
              <MaterialIcons name="phone" size={28} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View style={styles.aiContainer}>
          <AIWave size={220} />
          <View style={styles.actionCenter}>
            <AnimatedButton title="ابدأ محادثة مع سارا" onPress={() => navigation.navigate('Chat' as never)} />
            <TouchableOpacity 
              style={styles.heart} 
              activeOpacity={0.7}
              onPress={() => console.log('Liked!')}
            >
              <FontAwesome name="heart" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <TouchableOpacity 
            style={styles.statCard}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Services' as never)}
          >
            <LinearGradient
              colors={[colors.primary, '#0A6B58']}
              style={styles.statGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MaterialIcons name="widgets" size={24} color="#fff" />
              <Text style={styles.statTitle}>الخدمات النشطة</Text>
              <Text style={styles.statNumber}>{user.services.filter(s => s.status === 'نشط').length}</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.statCard}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['#FFB800', '#FFA000']}
              style={styles.statGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MaterialIcons name="notifications" size={24} color="#fff" />
              <Text style={styles.statTitle}>التنبيهات</Text>
              <Text style={styles.statNumber}>{user.notifications.length}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.servicesSection}>
          <View style={styles.sectionHeader}>
            <TouchableOpacity onPress={() => navigation.navigate('Services' as never)}>
              <Text style={styles.seeAll}>عرض الكل ←</Text>
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>خدماتك</Text>
          </View>
          {user.services.map((item) => (
            <ServiceCard key={item.id} service={item} />
          ))}
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Chat' as never)}
      >
        <LinearGradient
          colors={[colors.primary, colors.accent]}
          style={styles.fabGradient}
        >
          <MaterialIcons name="chat" size={26} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 20
  },
  headerTop: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  welcomeContainer: {
    alignItems: 'center',
    flex: 1
  },
  welcomeLabel: {
    fontSize: 12,
    color: colors.textLight,
    fontFamily: 'Tajawal_400Regular'
  },
  welcome: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Tajawal_700Bold',
    color: colors.text,
    marginTop: 4
  },
  aiContainer: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  },
  heart: {
    marginTop: 16,
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 24,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4
  },
  statsContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  statCard: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5
  },
  statGradient: {
    padding: 20,
    alignItems: 'flex-end'
  },
  statTitle: {
    fontSize: 13,
    color: '#fff',
    marginTop: 8,
    fontFamily: 'Tajawal_400Regular'
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginTop: 4,
    fontFamily: 'Tajawal_700Bold'
  },
  servicesSection: {
    paddingHorizontal: 16
  },
  sectionHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Tajawal_700Bold',
    color: colors.text
  },
  seeAll: {
    fontSize: 14,
    color: colors.primary,
    fontFamily: 'Tajawal_400Regular'
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    overflow: 'hidden'
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
