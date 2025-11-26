import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { Service } from '../types';

export const ServiceCard = ({ service }: { service: Service }) => {
  const statusColor = service.status === 'نشط' ? colors.success : colors.error;
  const iconMap: Record<string, { family: 'fa5' | 'mc'; name: string }> = {
    badge: { family: 'mc', name: 'id-badge' },
    'id-card': { family: 'mc', name: 'id-badge' },
    car: { family: 'fa5', name: 'car' },
    passport: { family: 'fa5', name: 'passport' },
    folder: { family: 'mc', name: 'folder' }
  };
  const ico = iconMap[service.icon || 'folder'] || iconMap.folder;

  return (
    <View style={styles.card}>
      <View style={styles.left}>
        {/* Use a mapping to render an icon from FontAwesome5 or MaterialCommunityIcons */}
        {ico.family === 'fa5' ? (
          <FontAwesome5 name={ico.name as any} size={22} color={colors.primary} solid />
        ) : (
          <MaterialCommunityIcons name={ico.name as any} size={22} color={colors.primary} />
        )}
      </View>
      <View style={styles.right}>
        <Text style={styles.name}>{service.nameAr}</Text>
        <Text style={styles.expire}>تاريخ الانتهاء: {service.expiryDate}</Text>
      </View>
      <View style={[styles.badge, { backgroundColor: statusColor }]}>
        <Text style={styles.badgeText}>{service.status}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    padding: 12,
    marginTop: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2
  },
  left: {
    marginLeft: 12,
    marginRight: 8
  },
  right: {
    flex: 1,
    alignItems: 'flex-end'
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Tajawal_700Bold',
    color: colors.text
  },
  expire: {
    fontSize: 12,
    color: colors.textLight
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700'
  }
});
