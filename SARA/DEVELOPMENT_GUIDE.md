# SARA - Quick Development Guide 🚀

## Project Structure

```
SARA/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AIWave.tsx      # Animated AI wave visualization
│   │   ├── AnimatedButton.tsx  # Gradient button with animation
│   │   ├── ChatBubble.tsx  # Chat message component
│   │   ├── ServiceCard.tsx # Service display card
│   │   └── VoiceRecorder.tsx # Voice recording component
│   │
│   ├── screens/            # Main app screens
│   │   ├── HomeScreen.tsx      # Dashboard/home
│   │   ├── ChatScreen.tsx      # AI chat interface
│   │   ├── ServicesScreen.tsx  # Services list
│   │   └── ProfileScreen.tsx   # User profile
│   │
│   ├── navigation/         # Navigation setup
│   │   └── AppNavigator.tsx    # Bottom tabs navigation
│   │
│   ├── services/           # API and services
│   │   ├── groqAPI.ts         # Groq AI integration
│   │   ├── voiceTTS.ts        # Text-to-speech
│   │   └── audioAdapter.ts    # Audio handling
│   │
│   ├── constants/          # App constants
│   │   ├── colors.ts          # Color palette
│   │   ├── config.ts          # API keys and config
│   │   └── mockData.ts        # Mock user data
│   │
│   └── types/              # TypeScript types
│       └── index.ts           # Type definitions
│
├── App.tsx                 # App entry point
├── app.config.js          # Expo configuration
├── package.json           # Dependencies
└── tsconfig.json          # TypeScript config
```

---

## 🎨 Design Tokens

### Colors
```typescript
// Primary palette
primary: '#0D7C66'      // Teal - main brand
secondary: '#FFB800'    // Yellow - accents
accent: '#8B5CF6'       // Purple - highlights

// Status colors
success: '#10B981'      // Green
error: '#EF4444'        // Red

// Neutrals
background: '#F5F7FA'   // Light gray
cardBg: '#FFFFFF'       // White
text: '#1A1A1A'         // Dark gray
textLight: '#6B7280'    // Medium gray
```

### Typography
```typescript
// Font families
fontRegular: 'Tajawal_400Regular'
fontBold: 'Tajawal_700Bold'

// Font sizes
h1: 24px
h2: 22px
h3: 20px
h4: 18px
body: 15px
caption: 13px
small: 11px
```

### Spacing Scale
```typescript
xs: 4px
sm: 8px
md: 12px
lg: 16px
xl: 20px
xxl: 24px
```

---

## 🔧 Common Tasks

### Adding a New Screen

1. Create screen file in `src/screens/`
2. Add navigation in `src/navigation/AppNavigator.tsx`
3. Import and use components from `src/components/`

Example:
```typescript
// src/screens/NewScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

export function NewScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  title: {
    fontSize: 24,
    fontFamily: 'Tajawal_700Bold',
    color: colors.text
  }
});
```

### Creating a Gradient Button

```typescript
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../constants/colors';

<TouchableOpacity onPress={handlePress}>
  <LinearGradient
    colors={[colors.primary, colors.accent]}
    style={styles.button}
  >
    <Text style={styles.buttonText}>Button Text</Text>
  </LinearGradient>
</TouchableOpacity>
```

### Adding Icons

```typescript
import { MaterialIcons } from '@expo/vector-icons';

<MaterialIcons name="home" size={24} color={colors.primary} />
```

### Creating Cards with Shadows

```typescript
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4  // Android shadow
  }
});
```

---

## 🌍 RTL Support

The app is RTL-first for Arabic. Key patterns:

```typescript
// Flexbox direction
flexDirection: 'row-reverse'  // Instead of 'row'

// Text alignment
textAlign: 'right'  // Default for Arabic

// Margins
marginLeft: 10  // Becomes right in RTL
marginRight: 10 // Becomes left in RTL
```

---

## 📡 API Integration

### Groq API (Chat)

```typescript
import { sendMessageToGroq } from '../services/groqAPI';

const response = await sendMessageToGroq('User message');
console.log(response); // AI response
```

### Text-to-Speech

```typescript
import { convertTextToSpeech } from '../services/voiceTTS';

const sound = await convertTextToSpeech('Arabic text');
// Sound auto-plays
```

---

## 🎭 Animation Patterns

### Spring Animation

```typescript
import { Animated } from 'react-native';

const scaleAnim = useRef(new Animated.Value(1)).current;

Animated.spring(scaleAnim, {
  toValue: 1.1,
  friction: 3,
  useNativeDriver: true
}).start();

// In render:
<Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
  {/* Content */}
</Animated.View>
```

### Fade Animation

```typescript
const fadeAnim = useRef(new Animated.Value(0)).current;

Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true
}).start();

<Animated.View style={{ opacity: fadeAnim }}>
  {/* Content */}
</Animated.View>
```

---

## 🧪 Testing

### Run Development Server
```bash
npm start
```

### Clear Cache
```bash
npm start -- --clear
```

### Check TypeScript
```bash
npx tsc --noEmit
```

---

## 📱 Platform-Specific Code

```typescript
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20
  }
});

// Or inline:
<View style={{
  marginTop: Platform.select({ ios: 20, android: 10 })
}}>
```

---

## 🔐 Environment Variables

Add to `app.config.js`:

```javascript
export default {
  extra: {
    GROQ_API_KEY: process.env.GROQ_API_KEY || 'default_key',
    GROQ_CHAT_MODEL: process.env.GROQ_CHAT_MODEL || 'mixtral-8x7b'
  }
};
```

Access in code:

```typescript
import Constants from 'expo-constants';

const apiKey = Constants.manifest?.extra?.GROQ_API_KEY;
```

---

## 🐛 Common Issues & Solutions

### 1. Fonts not loading
```typescript
// Make sure to load fonts in App.tsx
const [fontsLoaded] = useFonts({
  Tajawal_400Regular,
  Tajawal_700Bold
});

if (!fontsLoaded) return null;
```

### 2. Navigation TypeScript errors
```typescript
// Add proper typing
navigation.navigate('ScreenName' as never);
```

### 3. RTL not working
```typescript
// In App.tsx
import { I18nManager } from 'react-native';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);
```

### 4. Keyboard covering input
```typescript
import { KeyboardAvoidingView, Platform } from 'react-native';

<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : undefined}
  style={{ flex: 1 }}
>
  {/* Your content */}
</KeyboardAvoidingView>
```

---

## 📚 Key Components Usage

### ServiceCard
```typescript
<ServiceCard service={{
  id: 1,
  nameAr: 'تجديد الهوية',
  status: 'نشط',
  expiryDate: '2026-03-20',
  icon: 'badge'
}} />
```

### ChatBubble
```typescript
<ChatBubble
  message={{ id: 1, role: 'user', text: 'Hello' }}
  onPlay={() => playTTS(text)}
  isPlaying={false}
/>
```

### AnimatedButton
```typescript
<AnimatedButton
  title="ابدأ محادثة"
  onPress={() => console.log('Pressed')}
/>
```

---

## 🚀 Build for Production

```bash
# iOS
eas build --platform ios

# Android
eas build --platform android

# Both
eas build --platform all
```

---

## 📖 Useful Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native](https://reactnative.dev/)
- [Tajawal Font](https://fonts.google.com/specimen/Tajawal)
- [Material Icons](https://fonts.google.com/icons)

---

## 💡 Best Practices

1. **Always use TypeScript types**
2. **Test on both iOS and Android**
3. **Use constants for colors and spacing**
4. **Keep components small and focused**
5. **Use memo for expensive renders**
6. **Handle loading and error states**
7. **Test RTL layout thoroughly**
8. **Optimize images and assets**
9. **Use native driver for animations**
10. **Follow accessibility guidelines**

---

**Happy Coding! 🎉**
