# SARA Flutter - Development Guide 🛠️

Quick reference guide for developers working on the SARA Flutter application.

---

## 🚀 Quick Start Commands

### Initial Setup
```bash
# Clone and setup
git clone <repository-url>
cd sara_flutter

# Install dependencies
flutter pub get

# Generate code
flutter pub run build_runner build --delete-conflicting-outputs

# Run app
flutter run
```

### Development Commands
```bash
# Run on specific device
flutter run -d <device-id>

# Hot reload (during development)
# Press 'r' in terminal

# Hot restart
# Press 'R' in terminal

# List devices
flutter devices

# Run in release mode
flutter run --release
```

---

## 📁 Project Structure

```
lib/
├── features/              # Feature modules (screens)
│   ├── home/             # Home dashboard
│   ├── chat/             # AI chat interface
│   ├── services/         # Services management
│   ├── safe_gate/        # OTP management
│   ├── profile/          # User profile
│   ├── voice_call/       # Voice calling
│   ├── guest_help/       # Guest assistance
│   ├── elder_mode/       # Elder mode interface
│   ├── splash/           # Splash screen
│   └── onboarding/       # Onboarding flow
├── core/
│   ├── models/           # Data models (Freezed)
│   ├── services/         # API & business logic
│   ├── providers/        # Riverpod state providers
│   └── constants/        # Constants & mock data
├── widgets/              # Reusable widgets
├── config/
│   ├── theme/           # Colors & theme
│   └── routes/          # Navigation (GoRouter)
├── app.dart             # App widget
└── main.dart            # Entry point
```

---

## 🏗️ Code Generation

The app uses code generation for models and providers. Run after any changes to:
- `@freezed` annotated classes
- `@riverpod` annotated providers
- JSON serialization models

```bash
# One-time generation
flutter pub run build_runner build --delete-conflicting-outputs

# Watch mode (auto-regenerate)
flutter pub run build_runner watch --delete-conflicting-outputs

# Clean and rebuild
flutter pub run build_runner clean
flutter pub run build_runner build --delete-conflicting-outputs
```

---

## 📝 Creating New Features

### 1. Create a New Screen

```dart
// lib/features/my_feature/my_screen.dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class MyScreen extends StatelessWidget {
  const MyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Screen')),
      body: const Center(child: Text('Content')),
    );
  }
}
```

### 2. Add Route

```dart
// lib/config/routes/app_router.dart
import '../../features/my_feature/my_screen.dart';

GoRoute(
  path: '/my-screen',
  builder: (context, state) => const MyScreen(),
),
```

### 3. Create a Model

```dart
// lib/core/models/my_model.dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'my_model.freezed.dart';
part 'my_model.g.dart';

@freezed
class MyModel with _$MyModel {
  const factory MyModel({
    required String id,
    required String name,
  }) = _MyModel;

  factory MyModel.fromJson(Map<String, dynamic> json) =>
      _$MyModelFromJson(json);
}
```

Then run: `flutter pub run build_runner build --delete-conflicting-outputs`

### 4. Create a Provider

```dart
// lib/core/providers/my_provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'my_provider.g.dart';

@riverpod
class MyNotifier extends _$MyNotifier {
  @override
  MyState build() {
    return MyState.initial();
  }

  void updateData(String data) {
    state = state.copyWith(data: data);
  }
}
```

Then run: `flutter pub run build_runner build --delete-conflicting-outputs`

### 5. Use Provider in Widget

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';

class MyWidget extends ConsumerWidget {
  const MyWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final myState = ref.watch(myNotifierProvider);
    
    return Text(myState.data);
  }
}
```

---

## 🎨 Theming & Styling

### Using Colors

```dart
import '../../config/theme/colors.dart';

Container(
  color: AppColors.primary,
  // or use gradient
  decoration: BoxDecoration(
    gradient: AppColors.primaryGradient,
  ),
)
```

### Using Fonts

```dart
import 'package:google_fonts/google_fonts.dart';

Text(
  'النص بالعربية',
  style: GoogleFonts.tajawal(
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: AppColors.textDark,
  ),
)
```

### Common Widgets

```dart
// Gradient Button
ElevatedButton(
  onPressed: () {},
  style: ElevatedButton.styleFrom(
    backgroundColor: AppColors.primary,
    foregroundColor: Colors.white,
    padding: const EdgeInsets.symmetric(vertical: 16),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(12),
    ),
  ),
  child: Text('زر'),
)

// Card
Card(
  margin: const EdgeInsets.all(16),
  elevation: 2,
  shape: RoundedRectangleBorder(
    borderRadius: BorderRadius.circular(16),
  ),
  child: Padding(
    padding: const EdgeInsets.all(16),
    child: Text('محتوى'),
  ),
)
```

---

## 🧪 Testing

### Run Tests
```bash
# All tests
flutter test

# Specific test
flutter test test/widget_test.dart

# With coverage
flutter test --coverage

# Watch mode
flutter test --watch
```

### Writing Tests

```dart
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('MyWidget', () {
    testWidgets('displays text', (WidgetTester tester) async {
      await tester.pumpWidget(const MyApp());
      
      expect(find.text('Hello'), findsOneWidget);
    });
  });
}
```

---

## 🔍 Code Quality

### Analysis
```bash
# Analyze code
flutter analyze

# Fix all formatting
dart format lib/ test/

# Check for issues
flutter analyze --fatal-infos
```

### Linting Rules
See `analysis_options.yaml` for configured lints.

---

## 📱 Platform-Specific Configuration

### Android

**build.gradle** (`android/app/build.gradle`):
```gradle
android {
    compileSdkVersion 34
    minSdkVersion 21
    targetSdkVersion 34
}
```

**Permissions** (`android/app/src/main/AndroidManifest.xml`):
```xml
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.RECORD_AUDIO"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
```

### iOS

**Podfile** (`ios/Podfile`):
```ruby
platform :ios, '12.0'
```

**Permissions** (`ios/Runner/Info.plist`):
```xml
<key>NSMicrophoneUsageDescription</key>
<string>نحتاج للوصول إلى الميكروفون للرسائل الصوتية</string>
```

---

## 🚢 Building for Production

### Android
```bash
# APK
flutter build apk --release

# App Bundle (Google Play)
flutter build appbundle --release

# Output location
# build/app/outputs/flutter-apk/app-release.apk
```

### iOS
```bash
# Build
flutter build ios --release

# Open in Xcode
open ios/Runner.xcworkspace

# Then create archive in Xcode
```

### Web
```bash
flutter build web --release

# Output: build/web/
```

---

## 🐛 Common Issues & Solutions

### 1. Build Runner Errors
```bash
flutter clean
flutter pub get
flutter pub run build_runner clean
flutter pub run build_runner build --delete-conflicting-outputs
```

### 2. Gradle Build Failed (Android)
```bash
cd android
./gradlew clean
cd ..
flutter clean
flutter pub get
```

### 3. Pod Install Failed (iOS)
```bash
cd ios
pod deintegrate
pod install
cd ..
flutter clean
```

### 4. Hot Reload Not Working
- Try hot restart (R)
- Rebuild the app
- Check for syntax errors

### 5. Provider Not Updating
- Ensure using `ref.watch` not `ref.read`
- Check state is immutable with copyWith
- Verify code generation is up to date

---

## 📚 Useful Resources

### Flutter
- [Official Docs](https://flutter.dev/docs)
- [Widget Catalog](https://flutter.dev/docs/development/ui/widgets)
- [Cookbook](https://flutter.dev/docs/cookbook)

### Riverpod
- [Documentation](https://riverpod.dev)
- [Examples](https://github.com/rrousselGit/riverpod/tree/master/examples)

### GoRouter
- [Documentation](https://pub.dev/packages/go_router)
- [Examples](https://github.com/flutter/packages/tree/main/packages/go_router/example)

### Freezed
- [Documentation](https://pub.dev/packages/freezed)
- [Code Generation Guide](https://pub.dev/packages/build_runner)

---

## 🤝 Git Workflow

### Branch Naming
```
feature/description
bugfix/description
hotfix/description
```

### Commit Messages
```
feat: add new screen
fix: resolve navigation issue
docs: update readme
style: format code
refactor: improve state management
test: add widget tests
```

### Before Committing
```bash
# Format code
dart format lib/ test/

# Analyze
flutter analyze

# Run tests
flutter test
```

---

## 📞 Getting Help

- Check Flutter DevTools for debugging
- Use `flutter doctor` to diagnose issues
- Review error messages carefully
- Search Flutter GitHub issues
- Ask in Flutter Discord/Slack

---

**Last Updated: December 11, 2025**
