# SARA App Flow Documentation

## 📱 Complete User Flow

### 1. **Splash Screen** (First Thing User Sees)
- **Duration**: 2.5 seconds
- **Content**: 
  - Animated SARA logo with AI wave
  - Arabic title "سارا" (Sara)
  - English subtitle "Sara"
  - Tagline: "مساعدك الذكي في كل مكان" (Your smart assistant everywhere)
  - Government badge: "خدمة حكومية معتمدة 🇸🇦"
- **Animation**: Fade in + scale spring animation
- **Transitions to**: Onboarding Screen

### 2. **Onboarding Screen** (Initial Route)
- **Purpose**: Authenticate user with Saudi ID
- **Input**: 10-digit Saudi ID starting with 1
- **Process**:
  1. User enters Saudi ID
  2. Nafath verification simulation (3-4 seconds)
  3. System determines scenario based on ID last digit
- **Navigation**: 
  - NOT shown in bottom tab bar (hidden)
  - Routes to appropriate screen based on scenario
- **Scenarios**:
  - Last digit 0-2 → Safe Gate (Saudis abroad)
  - Last digit 3-6 → Chat (regular users in Saudi)
  - Last digit 7-8 → Elder Mode (simplified interface)
  - Last digit 9 → Guest Help (limited assistance)

### 3. **Main Navigation** (Bottom Tab Bar - 3 Tabs Only)

#### Tab 1: البوابة الآمنة (Safe Gate)
- **Icon**: vpn-lock
- **For**: Saudi citizens abroad
- **Features**:
  - ✅ OTP Management for Saudi apps
  - ✅ Saudi VPN activation for banks/government apps
  - ✅ **LIVE Emergency Calling** (10-minute access)
    - General Emergency: 112
    - Police: 999
    - Ambulance: 997
    - Civil Defense: 998
    - Safe Gate Support: 920003344
  - 💰 Subscription: 29 SAR/month
- **Live Call Implementation**: 
  - Uses native device calling via `Linking.openURL('tel:NUMBER')`
  - Alert dialog with multiple emergency numbers
  - Real phone call initiated when selected

#### Tab 2: سارا (Sara - AI Chat) **[CENTER/MIDDLE]**
- **Icon**: smart-toy (larger when focused: 32px)
- **Purpose**: Main AI assistant interaction
- **Features**:
  - ✅ Groq API integration (mixtral-8x7b model)
  - ✅ Welcome message on chat open
  - ✅ Message history with user/AI differentiation
  - ✅ Text-to-Speech (TTS) auto-play for responses
  - ✅ Voice recording capability
  - ✅ Loading states and error handling
- **Fixed**: Removed `temperature` parameter from TTS API (was causing 400 error)

#### Tab 3: حسابي (Profile)
- **Icon**: person / person-outline
- **Purpose**: User account and settings
- **Features**:
  - User information display
  - Settings management
  - Account preferences

### 4. **Hidden Screens** (Not in Tab Bar)
- **Home Screen**: Available but hidden from tabs
- **Elder Mode**: Simplified yes/no interface
- **Guest Help**: Limited assistance with relative contact system

## 🌐 RTL (Right-to-Left) Implementation

### Global RTL Settings (App.tsx)
```typescript
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);
```

### RTL Patterns Used Throughout:
1. **FlexDirection**: `flexDirection: 'row-reverse'` for horizontal layouts
2. **Text Alignment**: `textAlign: 'right'` for Arabic text
3. **Text Alignment**: `textAlign: 'center'` for centered content
4. **Icon Placement**: Icons appear on the right side in RTL layouts
5. **Navigation**: Tabs flow right-to-left

### Screens with RTL:
- ✅ Splash Screen: Centered content
- ✅ Onboarding: Right-aligned text inputs and labels
- ✅ Chat Screen: Right-aligned messages, centered empty states
- ✅ Safe Gate: Right-aligned text and rows with `flexDirection: 'row-reverse'`
- ✅ Elder Mode: Centered content
- ✅ Guest Help: Right-aligned text inputs
- ✅ Profile: Right-aligned settings and text
- ✅ Home: Right-aligned headers and content
- ✅ Services: Right-aligned service cards

## 📞 Live Calling Feature

### Implementation Details:
- **Location**: Safe Gate Screen
- **Trigger**: "طلب اتصال طارئ (10 دقائق)" button
- **Process**:
  1. Alert dialog shows with emergency number options
  2. User selects number
  3. Device native dialer opens with pre-filled number
  4. User confirms call in phone app
  5. Call is LIVE (not simulated)

### Emergency Numbers Available:
```typescript
{
  general: '112',           // General emergency
  police: '999',           // Police
  ambulance: '997',        // Ambulance
  civilDefense: '998',     // Civil Defense
  safeGateSupport: '920003344'  // Safe Gate support line
}
```

## 🎨 Visual Design

### Color Scheme:
- **Primary**: #0D9488 (Teal)
- **Accent**: #14B8A6
- **Secondary**: #F97316 (Orange)
- **Background**: #F5F7FA
- **Text**: #1F2937

### Typography:
- **Font**: Tajawal (Arabic-optimized Google Font)
- **Weights**: 400 (Regular), 700 (Bold)
- **Sizes**: 11-56px depending on context

### Animations:
- Splash screen fade-in and scale
- Tab bar icons scale on focus
- Button spring animations
- AI wave pulsing effect

## 🔧 Technical Stack

- **Framework**: Expo SDK 54.0.0
- **React Native**: 0.81.5
- **Navigation**: @react-navigation/bottom-tabs v6
- **AI Backend**: Groq API (mixtral-8x7b)
- **TTS**: Groq Audio API (playai-tts-arabic, Amira-PlayAI voice)
- **Audio**: expo-av / expo-audio adapter
- **Styling**: expo-linear-gradient
- **Icons**: @expo/vector-icons (MaterialIcons)

## 🧪 Test IDs

Mock IDs for testing scenarios (all valid):
```
1000000000 → Safe Gate (abroad)
1000000001 → Safe Gate (abroad)
1000000002 → Safe Gate (abroad)
1000000003 → Chat (in Saudi)
1000000004 → Chat (in Saudi)
1000000005 → Chat (in Saudi)
1000000006 → Chat (in Saudi)
1000000007 → Elder Mode
1000000008 → Elder Mode
1000000009 → Guest Help
```

## ✅ Recent Fixes

1. **Splash Screen Created**: Beautiful branded entry screen
2. **Navigation Reorganized**: Chat moved to center, Home removed from tabs
3. **TTS Error Fixed**: Removed unsupported `temperature` parameter
4. **Live Calling Implemented**: Real phone calls via Linking API
5. **RTL Verified**: All screens properly support right-to-left layout
6. **Onboarding Hidden**: No longer appears in tab bar but remains initial route

## 🚀 Launch Flow Summary

```
User opens app
    ↓
Splash Screen (2.5s)
    ↓
Onboarding Screen
    ↓
Enter Saudi ID
    ↓
Nafath verification
    ↓
Route to scenario
    ↓
Main app with 3-tab navigation
(Safe Gate | Sara (AI Chat) | Profile)
```
