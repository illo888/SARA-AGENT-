# 🧪 SARA App Testing Guide

## ✅ Quick Status Check

### ChatScreen Features (All Working):
- ✅ **Text Input Field**: Large text input at bottom for typing messages
- ✅ **Send Button**: Green gradient button with send icon
- ✅ **Voice Recorder Button**: Microphone icon button (inline in input bar)
- ✅ **Auto-play Toggle**: Volume icon to toggle TTS on/off
- ✅ **Welcome Message**: "مرحباً بك! أنا سارة..." appears on chat open
- ✅ **Groq API Integration**: Real AI responses using mixtral-8x7b
- ✅ **TTS Auto-play**: AI responses are spoken automatically
- ✅ **Message History**: Displays user and AI messages with differentiation
- ✅ **Loading States**: Shows "سارا تكتب..." while AI is thinking

### SafeGate Call Feature:
- ✅ **LIVE CALLING**: Real phone calls via device dialer
- ✅ **Emergency Numbers**: 112, 999, 997, 998, 920003344
- ✅ **Alert Dialog**: Shows list of numbers before calling
- ✅ **Device Integration**: Uses `Linking.openURL('tel:XXX')`

## 🎮 Demo Login IDs (Tap to Fill)

The onboarding screen now includes 4 clickable demo cards:

### 1. البوابة الآمنة (Safe Gate) 🔒
**ID**: `1000000000`
- Routes to: SafeGate screen
- Features: OTP, VPN, **LIVE Emergency Calling**
- For: Saudi citizens abroad

### 2. محادثة سارا (Sara Chat) 💬
**ID**: `1000000005`
- Routes to: Chat screen (main AI assistant)
- Features: Full chat with Groq AI, TTS, voice recording
- For: Regular users in Saudi Arabia

### 3. وضع كبار السن (Elder Mode) 👴
**ID**: `1000000007`
- Routes to: Elder Mode screen
- Features: Simplified yes/no interface
- For: Elderly users needing simple access

### 4. مساعدة ضيف (Guest Help) 🆘
**ID**: `1000000009`
- Routes to: Guest Help screen
- Features: Limited assistance, relative contact requests
- For: Users without authentication

## 📱 Complete Test Flow

### Step 1: Launch App
```
Open SARA app
    ↓
Splash Screen appears (2.5 seconds)
    - Shows "سارا" logo
    - Animated fade-in
    - Government badge
```

### Step 2: Onboarding
```
Onboarding Screen loads
    ↓
See 4 demo cards for quick testing
    ↓
Tap any card or manually enter ID
    ↓
Press "متابعة عبر نفاذ"
    ↓
Nafath simulation (3 seconds loading)
    ↓
Routes to appropriate screen
```

### Step 3: Navigation
```
Bottom Tab Bar (3 tabs visible):
    - البوابة الآمنة (Left)
    - سارا (Center - AI Chat) ⭐
    - حسابي (Right)
```

## 🧪 Testing Scenarios

### Test 1: Chat Functionality
1. Use ID: `1000000005`
2. Navigate to Chat (already there after onboarding)
3. **Verify**:
   - [ ] Welcome message appears
   - [ ] Text input field is visible and functional
   - [ ] Send button is visible (right side of input)
   - [ ] Voice recorder button (microphone icon)
   - [ ] Volume toggle button (auto-play TTS)
4. **Type** a message: "ما هي الخدمات المتاحة؟"
5. **Press** send button
6. **Verify**:
   - [ ] Message appears as user message (blue bubble)
   - [ ] Loading indicator shows "سارا تكتب..."
   - [ ] AI response appears (gray bubble)
   - [ ] TTS plays automatically (if auto-play on)

### Test 2: Live Calling (SafeGate)
1. Use ID: `1000000000`
2. Navigate to SafeGate screen
3. **Scroll** to "الإجراءات" section
4. **Press** "اتصال طارئ مباشر (LIVE) 🔴" button
5. **Verify**:
   - [ ] Alert dialog appears with emergency numbers
   - [ ] Select "الطوارئ العامة (112)"
   - [ ] Device phone dialer opens
   - [ ] Number 112 is pre-filled
   - [ ] User can confirm to make REAL call
6. **Note**: Red warning box explains calling is LIVE

### Test 3: Elder Mode
1. Use ID: `1000000007`
2. Routes to Elder Mode
3. **Verify**:
   - [ ] Simple interface with large buttons
   - [ ] "نعم، أحتاج مساعدة" button
   - [ ] "لا، شكرا" button
   - [ ] No complex navigation

### Test 4: Guest Help
1. Use ID: `1000000009`
2. Routes to Guest Help
3. **Verify**:
   - [ ] Can enter relative's Saudi ID
   - [ ] Can enter relative's name
   - [ ] "طلب المساعدة" button works
   - [ ] Mock backend simulates relative matching

## 🌐 RTL Verification

All screens should display properly in RTL (Right-to-Left):

- [ ] Text aligns to the right
- [ ] Icons appear on the right side of text
- [ ] Navigation flows right-to-left
- [ ] Input fields have right-side text alignment
- [ ] Buttons have icons on the right

## 🐛 Known Issues & Fixes

### ✅ FIXED: TTS Temperature Error
**Problem**: `unknown field 'temperature' in request body`
**Solution**: Removed `temperature` parameter from TTS API call

### ✅ FIXED: Navigation Structure
**Problem**: Home showing in tabs, Chat not centered
**Solution**: 
- Removed Home from visible tabs
- Moved Chat to center position
- Chat tab labeled "سارا" with smart-toy icon
- Hidden Onboarding from tabs but kept as initial route

### ✅ FIXED: Splash Screen
**Problem**: No splash screen on app start
**Solution**: Created SplashScreen component that shows before onboarding

### ✅ FIXED: Live Calling
**Problem**: Only alerts, no actual calls
**Solution**: Implemented `Linking.openURL('tel:')` for real phone calls

## 📊 Features Checklist

### Completed ✅
- [x] Splash screen with SARA branding
- [x] Onboarding with Saudi ID validation
- [x] Nafath verification simulation
- [x] Scenario-based routing (4 types)
- [x] Demo IDs for quick testing
- [x] Chat screen fully functional
- [x] Groq AI integration
- [x] TTS auto-play
- [x] Voice recording UI
- [x] Live emergency calling
- [x] Safe Gate features (OTP, VPN, Calls)
- [x] Elder Mode simplified interface
- [x] Guest Help with relative matching
- [x] RTL support throughout
- [x] Bottom tab navigation (3 visible tabs)
- [x] Chat centered in navigation

### In Development 🔄
- [ ] Speech-to-text for voice messages
- [ ] 300+ mock scenario dataset
- [ ] Subscription payment flow (29 SAR/month)
- [ ] Tawakkalna privilege verification
- [ ] Production emergency number validation

## 🚀 Running the App

```bash
cd /Users/tariq/ShadenAbshar/SARA
npx expo start
```

Then press:
- `i` for iOS Simulator
- `a` for Android Emulator
- Scan QR code with Expo Go app on physical device

## 📞 Emergency Numbers (Live Calling)

When testing live calling, these numbers will ACTUALLY dial:
- **112**: General Emergency (Saudi Arabia)
- **999**: Police
- **997**: Ambulance
- **998**: Civil Defense
- **920003344**: Safe Gate Support (mock number)

⚠️ **WARNING**: These are REAL calls. Use with caution on physical devices!

## 🎯 Expected Behavior Summary

### Scenario Matrix
| Last Digit | Scenario | Destination Screen | Key Feature |
|------------|----------|-------------------|-------------|
| 0, 1, 2 | Safe Gate | SafeGateScreen | Live calling |
| 3, 4, 5, 6 | In Saudi | ChatScreen | AI assistant |
| 7, 8 | Elder | ElderModeScreen | Simple UI |
| 9 | Guest | GuestHelpScreen | Relative help |

### Input Controls in ChatScreen
```
┌─────────────────────────────────────┐
│  [🔊] [Text Input Field...] [🎤] [📤] │
│   ↑         ↑              ↑      ↑   │
│  Volume   Typing        Voice  Send   │
│  Toggle   Area          Rec   Button  │
└─────────────────────────────────────┘
```

All 4 controls are visible and functional in the chat screen.

## 💡 Pro Tips

1. **Quick Scenario Testing**: Just tap the demo cards on onboarding
2. **Voice Toggle**: Tap volume icon to turn off TTS if needed
3. **Emergency Call**: Always shows alert before dialing
4. **Message History**: Swipe down to see older messages
5. **RTL**: All Arabic text flows naturally right-to-left

---

**Last Updated**: November 27, 2025
**Version**: 1.0.0
**Status**: ✅ All core features working
