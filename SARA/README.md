# SARA - AI Government Services Assistant 🤖

<div align="center">
  <img src="https://img.shields.io/badge/Expo-54.0.0-000020?style=for-the-badge&logo=expo" />
  <img src="https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5.9.2-3178C6?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/RTL_Support-✓-success?style=for-the-badge" />
</div>

<br />

**SARA** (السارا) is a modern, AI-powered mobile application designed to help Saudi citizens access government services through an intelligent conversational interface. Built with Expo and React Native, featuring a beautiful Arabic-first UI with full RTL support.

---

## ✨ Features

- 🤖 **AI Chat Assistant** - Powered by Groq API for intelligent responses
- 🎙️ **Voice Input** - Record and send voice messages
- 🔊 **Text-to-Speech** - Arabic TTS for AI responses
- 📱 **Government Services** - Track and manage your services
- 👤 **User Profile** - Personal information and statistics
- 🌍 **RTL Support** - Full Arabic language support
- 🎨 **Modern UI** - Beautiful gradients, animations, and smooth transitions
- 📊 **Service Tracking** - Monitor active and expired services
- 🔔 **Notifications** - Stay updated with important alerts

---

## 🚀 Quick Start

### Prerequisites
- Node.js (LTS version 16+)
- npm or yarn
- Expo Go app on your phone (iOS/Android)

### Installation

```bash
# Navigate to project directory
cd SARA

# Install dependencies
npm install

# Start Expo development server
npm start
```

### Running the App

After starting the server:
1. **iOS**: Scan QR code with Camera app
2. **Android**: Scan QR code with Expo Go app
3. **Web**: Press `w` in terminal

**Alternative commands:**
```bash
npm run ios      # Open in iOS simulator
npm run android  # Open in Android emulator
npm run web      # Open in web browser
```

---

## 📱 Screenshots & Features

### Home Screen 🏠
- Modern dashboard with AI wave animation
- Quick stats for services and notifications
- Service cards with status indicators
- Floating action button for quick chat access
- Gradient cards with beautiful shadows

### Chat Screen 💬
- Real-time AI conversation with Groq
- Voice recording support
- Text-to-speech for responses
- Loading indicators
- Empty state with helpful guidance
- Auto-play toggle for TTS

### Services Screen 📋
- Searchable services list
- Filter by status (All, Active, Expired)
- Beautiful service cards with icons
- Empty state for no results
- Real-time search filtering

### Profile Screen 👤
- User information cards
- Statistics overview
- Settings menu
- Logout functionality
- Avatar with user initial
- Gradient stat cards

---

## 🎨 Design System

### Color Palette
```
Primary:    #0D7C66 (Teal)
Secondary:  #FFB800 (Yellow)
Accent:     #8B5CF6 (Purple)
Success:    #10B981 (Green)
Error:      #EF4444 (Red)
Background: #F5F7FA (Light Gray)
```

### Typography
- **Font**: Tajawal (Arabic-optimized)
- **Weights**: Regular (400), Bold (700)
- **RTL Support**: Full right-to-left layout

### Components
- Gradient buttons with animations
- Cards with shadows and elevation
- Smooth transitions
- Touch feedback on all interactive elements

---

## 🏗️ Architecture

### Project Structure
```
SARA/
├── src/
│   ├── components/       # Reusable UI components
│   ├── screens/         # Main app screens
│   ├── navigation/      # Navigation setup
│   ├── services/        # API integrations
│   ├── constants/       # Colors, config, mock data
│   └── types/          # TypeScript definitions
├── App.tsx             # App entry point
├── app.config.js       # Expo configuration
└── package.json        # Dependencies
```

### Tech Stack
- **Framework**: Expo SDK 54
- **Language**: TypeScript
- **UI**: React Native
- **Navigation**: React Navigation v6
- **State**: React Hooks
- **API**: Groq AI API
- **Fonts**: Google Fonts (Tajawal)
- **Icons**: Material Icons

---

## 🔧 Configuration

### API Keys
Set your Groq API key in `app.config.js`:
```javascript
export default {
  extra: {
    GROQ_API_KEY: process.env.GROQ_API_KEY || 'your_api_key_here'
  }
};
```

### Environment Variables (Optional)
Create a `.env` file:
```
GROQ_API_KEY=your_groq_api_key
GROQ_CHAT_MODEL=mixtral-8x7b
```

---

## 📚 Documentation

- **[UI/UX Improvements](./UI_UX_IMPROVEMENTS.md)** - Detailed changelog of all improvements
- **[Development Guide](./DEVELOPMENT_GUIDE.md)** - Quick reference for developers

---

## 🧪 Testing

### Development Server
```bash
npm start
```

### Clear Cache
```bash
npm start -- --clear
```

### TypeScript Check
```bash
npx tsc --noEmit
```

---

## 🚢 Deployment

### Build for Production
```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

---

## ⚠️ Important Notes

- **RTL Support**: The app is RTL-first (Arabic). `I18nManager.forceRTL(true)` is set in `App.tsx`
- **API Keys**: Never commit API keys to version control. Use environment variables in production
- **Audio Adapter**: Uses `expo-audio` with `expo-av` fallback for compatibility
- **Expo Go**: Fully compatible with Expo Go (no custom native modules)
- **TypeScript**: Strict mode enabled for better type safety

---

## 🐛 Troubleshooting

### Fonts not loading
Ensure fonts are properly loaded before rendering:
```typescript
const [fontsLoaded] = useFonts({ Tajawal_400Regular, Tajawal_700Bold });
if (!fontsLoaded) return null;
```

### RTL issues
Make sure RTL is enabled in App.tsx and reload the app.

### Keyboard covering input
Use `KeyboardAvoidingView` with proper platform behavior.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

MIT License - feel free to use this project for your own purposes.

---

## 👥 Team

Built with ❤️ for Saudi Arabia's digital transformation initiative.

---

## 🙏 Acknowledgments

- **Groq**: For providing the AI API
- **Expo**: For the amazing development platform
- **React Native Community**: For continuous support

---

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check the documentation
- Review the development guide

---

**Made with ❤️ in Saudi Arabia 🇸🇦**

*Last Updated: November 27, 2025*