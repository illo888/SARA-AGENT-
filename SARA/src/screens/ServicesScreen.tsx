import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Service } from '../types';
import { ServiceCard } from '../components/ServiceCard';
import { mockUserData } from '../constants/mockData';
import { colors } from '../constants/colors';
import { MaterialIcons } from '@expo/vector-icons';

type FilterType = 'all' | 'active' | 'expired';

export function ServicesScreen() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  let filtered: Service[] = mockUserData.services.filter((s) => 
    s.nameAr.includes(query) || (s.nameEn || '').toLowerCase().includes(query.toLowerCase())
  );

  if (filter === 'active') {
    filtered = filtered.filter(s => s.status === 'نشط');
  } else if (filter === 'expired') {
    filtered = filtered.filter(s => s.status === 'منتهية');
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, '#0A6B58']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>خدماتك الحكومية</Text>
        <Text style={styles.headerSubtitle}>إدارة جميع خدماتك في مكان واحد</Text>
        
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color={colors.textLight} style={styles.searchIcon} />
          <TextInput
            placeholder="ابحث عن خدمة..."
            value={query}
            onChangeText={setQuery}
            style={styles.search}
            placeholderTextColor={colors.textLight}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
              <MaterialIcons name="close" size={18} color={colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        <TouchableOpacity
          style={[styles.filterBtn, filter === 'all' && styles.filterBtnActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            الكل ({mockUserData.services.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterBtn, filter === 'active' && styles.filterBtnActive]}
          onPress={() => setFilter('active')}
        >
          <Text style={[styles.filterText, filter === 'active' && styles.filterTextActive]}>
            النشطة ({mockUserData.services.filter(s => s.status === 'نشط').length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterBtn, filter === 'expired' && styles.filterBtnActive]}
          onPress={() => setFilter('expired')}
        >
          <Text style={[styles.filterText, filter === 'expired' && styles.filterTextActive]}>
            المنتهية ({mockUserData.services.filter(s => s.status === 'منتهية').length})
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="folder-open" size={80} color={colors.textLight} />
          <Text style={styles.emptyTitle}>لا توجد خدمات</Text>
          <Text style={styles.emptySubtitle}>
            {query ? 'لم نجد نتائج لبحثك' : 'لا توجد خدمات في هذه الفئة'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <ServiceCard service={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F7FA' 
  },
  header: {
    paddingTop: 54,
    paddingBottom: 20,
    paddingHorizontal: 20
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Tajawal_700Bold',
    color: '#fff',
    textAlign: 'right',
    marginBottom: 4
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    color: '#fff',
    opacity: 0.9,
    textAlign: 'right',
    marginBottom: 16
  },
  searchContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48
  },
  searchIcon: {
    marginLeft: 8
  },
  search: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'right',
    color: colors.text
  },
  clearBtn: {
    padding: 4,
    marginRight: 4
  },
  filters: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 10
  },
  filterBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    marginRight: 8
  },
  filterBtnActive: {
    backgroundColor: colors.primary
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Tajawal_700Bold',
    color: colors.text
  },
  filterTextActive: {
    color: '#fff'
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Tajawal_700Bold',
    color: colors.text,
    marginTop: 16,
    textAlign: 'center'
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    color: colors.textLight,
    marginTop: 8,
    textAlign: 'center'
  }
});
