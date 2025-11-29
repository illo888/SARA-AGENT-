import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { Service } from '../types';

export const ServiceCard = ({ service }: { service: Service }) => {
  const statusColor = service.status === 'نشط' ? colors.success : colors.error;
  const iconMap: Record<string, { family: 'fa5' | 'mc'; name: string }> = {
    badge: { family: 'mc', name: 'badge-account' },
    'id-card': { family: 'mc', name: 'badge-account' },
    car: { family: 'fa5', name: 'car' },
    passport: { family: 'fa5', name: 'passport' },
    folder: { family: 'mc', name: 'folder' }
  };
  const ico = iconMap[service.icon || 'folder'] || iconMap.folder;

  return (
    <TouchableOpacity 
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => console.log('Service pressed:', service.nameAr)}
    >
      <View style={styles.iconContainer}>
        {ico.family === 'fa5' ? (
          <FontAwesome5 name={ico.name as any} size={24} color={colors.primary} solid />
        ) : (
          <MaterialCommunityIcons name={ico.name as any} size={26} color={colors.primary} />
        )}
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.badge, { backgroundColor: statusColor }]}>
            <MaterialIcons 
              name={service.status === 'نشط' ? 'check-circle' : 'error'} 
              size={12} 
              color="#fff" 
            />
            <Text style={styles.badgeText}>{service.status}</Text>
          </View>
          <Text style={styles.name}>{service.nameAr}</Text>
        </View>
        
        <View style={styles.footer}>
          <MaterialIcons name="calendar-today" size={14} color={colors.textLight} />
          <Text style={styles.expire}>ينتهي في {service.expiryDate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6'
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#E8F8F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 14
  },
  content: {
    flex: 1
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Tajawal_700Bold',
    color: colors.text,
    flex: 1,
    textAlign: 'right',
    marginLeft: 8
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 4
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Tajawal_700Bold'
  },
  footer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6
  },
  expire: {
    fontSize: 13,
    fontFamily: 'Tajawal_400Regular',
    color: colors.textLight
  }
});
