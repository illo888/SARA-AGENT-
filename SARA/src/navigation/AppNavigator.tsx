import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { SafeGateScreen } from '../screens/SafeGateScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { ElderModeScreen } from '../screens/ElderModeScreen';
import { GuestHelpScreen } from '../screens/GuestHelpScreen';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

const Tab = createBottomTabNavigator();

export function AppNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Onboarding"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontFamily: 'Tajawal_700Bold',
          fontSize: 11,
          marginTop: -4,
          marginBottom: Platform.OS === 'ios' ? 0 : 4
        },
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 88 : 65,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: 'absolute'
        },
        tabBarItemStyle: {
          paddingVertical: 4
        }
      })}
    >
      {/* Hidden Onboarding - initial route but not shown in tab bar */}
      <Tab.Screen 
        name="Onboarding" 
        component={OnboardingScreen} 
        options={{ tabBarButton: () => null }} 
      />
      
      {/* Main navigation tabs - Chat in the middle */}
      <Tab.Screen
        name="SafeGate"
        component={SafeGateScreen}
        options={{
          tabBarLabel: 'البوابة الآمنة',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="vpn-lock" size={focused ? 28 : 24} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarLabel: 'سارا',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons 
              name="smart-toy"
              size={focused ? 32 : 28} 
              color={color} 
            />
          )
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'حسابي',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons 
              name={focused ? 'person' : 'person-outline'} 
              size={focused ? 28 : 24} 
              color={color} 
            />
          )
        }}
      />
      
      {/* Hidden routes for scenario flows */}
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarButton: () => null }} />
      <Tab.Screen name="ElderMode" component={ElderModeScreen} options={{ tabBarButton: () => null }} />
      <Tab.Screen name="GuestHelp" component={GuestHelpScreen} options={{ tabBarButton: () => null }} />
    </Tab.Navigator>
  );
}
