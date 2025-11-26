import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native';
import { Service } from '../types';
import { ServiceCard } from '../components/ServiceCard';
import { mockUserData } from '../constants/mockData';
import { colors } from '../constants/colors';

export function ServicesScreen() {
  const [query, setQuery] = useState('');

  const filtered: Service[] = mockUserData.services.filter((s) => s.nameAr.includes(query) || (s.nameEn || '').includes(query));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TextInput
        placeholder="ابحث عن خدمة"
        value={query}
        onChangeText={setQuery}
        style={styles.search}
        placeholderTextColor={colors.textLight}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <ServiceCard service={item} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  search: {
    margin: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    textAlign: 'right'
  }
});
