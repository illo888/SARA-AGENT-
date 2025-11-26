import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { mockUserData } from '../constants/mockData';
import { colors } from '../constants/colors';
import { User } from '../types';

export function ProfileScreen() {
  const user: User = mockUserData;
  return (
    <View style={styles.container}>
      <View style={styles.idCard}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.subtitle}>{user.nationality} • {user.city}</Text>
        <View style={styles.row}>
          <View>
            <Text style={styles.label}>الهوية الوطنية</Text>
            <Text style={styles.value}>{user.nationalId}</Text>
          </View>
          <View>
            <Text style={styles.label}>تاريخ الميلاد</Text>
            <Text style={styles.value}>{user.birthDate}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  idCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4
  },
  name: { fontSize: 20, fontWeight: '800', textAlign: 'right' },
  subtitle: { fontSize: 14, color: colors.textLight, textAlign: 'right', marginBottom: 12 },
  row: { flexDirection: 'row-reverse', justifyContent: 'space-between' },
  label: { fontSize: 12, color: colors.textLight },
  value: { fontSize: 14, fontWeight: '700', textAlign: 'right' }
});
