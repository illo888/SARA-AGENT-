# SARA Flutter - Testing Guide 🧪

Comprehensive guide for testing the SARA Flutter application.

---

## 🎯 Testing Strategy

The SARA Flutter app uses a multi-layered testing approach:

1. **Unit Tests** - Test individual functions and business logic
2. **Widget Tests** - Test UI components and interactions
3. **Integration Tests** - Test complete user flows
4. **Golden Tests** - Visual regression testing (optional)

---

## 🚀 Quick Commands

```bash
# Run all tests
flutter test

# Run specific test file
flutter test test/widget_test.dart

# Run with coverage
flutter test --coverage

# Watch mode (re-run on changes)
flutter test --watch

# Run integration tests
flutter test integration_test/

# Verbose output
flutter test --verbose
```

---

## 📁 Test Structure

```
test/
├── unit/                 # Unit tests
│   ├── models/          # Model tests
│   ├── services/        # Service tests
│   └── providers/       # Provider tests
├── widget/              # Widget tests
│   ├── screens/         # Screen tests
│   └── components/      # Component tests
└── integration/         # Integration tests
    └── app_test.dart
```

---

## 🔬 Unit Testing

### Testing Models (Freezed)

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:sara_flutter/core/models/service_model.dart';

void main() {
  group('ServiceModel', () {
    test('creates model with required fields', () {
      final service = ServiceModel(
        id: 1,
        nameAr: 'خدمة اختبار',
        status: 'نشط',
        expiryDate: '2025-12-31',
      );

      expect(service.id, 1);
      expect(service.nameAr, 'خدمة اختبار');
      expect(service.status, 'نشط');
    });

    test('copyWith creates new instance with changes', () {
      final service = ServiceModel(
        id: 1,
        nameAr: 'خدمة',
        status: 'نشط',
        expiryDate: '2025-12-31',
      );

      final updated = service.copyWith(status: 'منتهية');

      expect(updated.status, 'منتهية');
      expect(updated.id, 1); // unchanged
    });

    test('equality comparison works', () {
      final service1 = ServiceModel(
        id: 1,
        nameAr: 'خدمة',
        status: 'نشط',
        expiryDate: '2025-12-31',
      );

      final service2 = ServiceModel(
        id: 1,
        nameAr: 'خدمة',
        status: 'نشط',
        expiryDate: '2025-12-31',
      );

      expect(service1, service2);
    });

    test('fromJson creates model from map', () {
      final json = {
        'id': 1,
        'nameAr': 'خدمة',
        'status': 'نشط',
        'expiryDate': '2025-12-31',
      };

      final service = ServiceModel.fromJson(json);

      expect(service.id, 1);
      expect(service.nameAr, 'خدمة');
    });
  });
}
```

### Testing Services

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:mockito/annotations.dart';
import 'package:dio/dio.dart';
import 'package:sara_flutter/core/services/groq_service.dart';

// Generate mocks
@GenerateMocks([Dio])
void main() {
  group('GroqService', () {
    late GroqService service;
    late MockDio mockDio;

    setUp(() {
      mockDio = MockDio();
      service = GroqService(dio: mockDio);
    });

    test('sendMessage returns response', () async {
      // Arrange
      when(mockDio.post(any, data: anyNamed('data')))
          .thenAnswer((_) async => Response(
                data: {'choices': [{'message': {'content': 'مرحبا'}}]},
                statusCode: 200,
                requestOptions: RequestOptions(path: ''),
              ));

      // Act
      final response = await service.sendMessage('مرحبا');

      // Assert
      expect(response, 'مرحبا');
      verify(mockDio.post(any, data: anyNamed('data'))).called(1);
    });

    test('sendMessage handles error', () async {
      // Arrange
      when(mockDio.post(any, data: anyNamed('data')))
          .thenThrow(DioException(
            requestOptions: RequestOptions(path: ''),
            type: DioExceptionType.connectionTimeout,
          ));

      // Act & Assert
      expect(
        () => service.sendMessage('مرحبا'),
        throwsA(isA<DioException>()),
      );
    });
  });
}
```

### Testing Providers (Riverpod)

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sara_flutter/core/providers/chat_provider.dart';

void main() {
  group('ChatProvider', () {
    test('initial state is empty', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final messages = container.read(chatProvider);

      expect(messages, isEmpty);
    });

    test('addMessage adds message to list', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final notifier = container.read(chatProvider.notifier);
      
      notifier.addMessage('مرحبا', isUser: true);

      final messages = container.read(chatProvider);
      expect(messages.length, 1);
      expect(messages.first.text, 'مرحبا');
      expect(messages.first.isUser, true);
    });

    test('clearMessages clears all messages', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final notifier = container.read(chatProvider.notifier);
      
      notifier.addMessage('مرحبا', isUser: true);
      notifier.clearMessages();

      final messages = container.read(chatProvider);
      expect(messages, isEmpty);
    });
  });
}
```

---

## 🎨 Widget Testing

### Testing Screens

```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sara_flutter/features/home/home_screen.dart';

void main() {
  testWidgets('HomeScreen displays welcome message', (tester) async {
    // Build the widget
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: HomeScreen(),
        ),
      ),
    );

    // Verify welcome text exists
    expect(find.text('مرحباً بك'), findsOneWidget);
  });

  testWidgets('HomeScreen displays start chat button', (tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: HomeScreen(),
        ),
      ),
    );

    expect(find.text('ابدأ محادثة مع سارا'), findsOneWidget);
  });

  testWidgets('Tapping chat button navigates', (tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: HomeScreen(),
        ),
      ),
    );

    // Find and tap the button
    await tester.tap(find.text('ابدأ محادثة مع سارا'));
    await tester.pumpAndSettle();

    // Verify navigation occurred
    // (implementation depends on your navigation setup)
  });
}
```

### Testing Widgets

```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:sara_flutter/widgets/service_card.dart';
import 'package:sara_flutter/core/models/service_model.dart';

void main() {
  group('ServiceCard', () {
    testWidgets('displays service information', (tester) async {
      final service = ServiceModel(
        id: 1,
        nameAr: 'خدمة اختبار',
        status: 'نشط',
        expiryDate: '2025-12-31',
      );

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: ServiceCard(service: service),
          ),
        ),
      );

      expect(find.text('خدمة اختبار'), findsOneWidget);
      expect(find.text('نشط'), findsOneWidget);
    });

    testWidgets('shows correct status color', (tester) async {
      final activeService = ServiceModel(
        id: 1,
        nameAr: 'خدمة',
        status: 'نشط',
        expiryDate: '2025-12-31',
      );

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: ServiceCard(service: activeService),
          ),
        ),
      );

      // Find status badge and verify color
      final statusBadge = find.text('نشط');
      expect(statusBadge, findsOneWidget);
    });

    testWidgets('calls onTap when tapped', (tester) async {
      bool tapped = false;
      final service = ServiceModel(
        id: 1,
        nameAr: 'خدمة',
        status: 'نشط',
        expiryDate: '2025-12-31',
      );

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: ServiceCard(
              service: service,
              onTap: () => tapped = true,
            ),
          ),
        ),
      );

      await tester.tap(find.byType(ServiceCard));
      expect(tapped, true);
    });
  });
}
```

---

## 🔗 Integration Testing

### Setup Integration Tests

Create `integration_test/app_test.dart`:

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:sara_flutter/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('End-to-end test', () {
    testWidgets('complete user flow', (tester) async {
      app.main();
      await tester.pumpAndSettle();

      // Wait for splash screen
      await tester.pumpAndSettle(const Duration(seconds: 3));

      // Verify home screen loaded
      expect(find.text('مرحباً بك'), findsOneWidget);

      // Navigate to chat
      await tester.tap(find.text('ابدأ محادثة مع سارا'));
      await tester.pumpAndSettle();

      // Verify chat screen
      expect(find.byType(TextField), findsOneWidget);

      // Type message
      await tester.enterText(find.byType(TextField), 'مرحبا');
      await tester.testTextInput.receiveAction(TextInputAction.done);
      await tester.pumpAndSettle();

      // Verify message sent
      expect(find.text('مرحبا'), findsOneWidget);
    });
  });
}
```

Run with:
```bash
flutter test integration_test/app_test.dart
```

---

## 📊 Test Coverage

### Generate Coverage Report

```bash
# Run tests with coverage
flutter test --coverage

# Generate HTML report (requires lcov)
genhtml coverage/lcov.info -o coverage/html

# Open report
open coverage/html/index.html
```

### Coverage Goals

- **Models**: 100% (should be easy with Freezed)
- **Services**: 80%+
- **Providers**: 80%+
- **Widgets**: 70%+
- **Overall**: 75%+

---

## 🎭 Mocking

### Using Mockito

1. Add dependency:
```yaml
dev_dependencies:
  mockito: ^5.4.0
  build_runner: ^2.4.0
```

2. Generate mocks:
```dart
@GenerateMocks([MyService, MyRepository])
import 'my_test.mocks.dart';

void main() {
  late MockMyService mockService;

  setUp(() {
    mockService = MockMyService();
  });

  test('example', () {
    when(mockService.getData()).thenAnswer((_) async => 'data');
    // test code
  });
}
```

3. Generate:
```bash
flutter pub run build_runner build
```

---

## ✅ Test Checklist

Before pushing code, ensure:

- [ ] All tests pass: `flutter test`
- [ ] No warnings: `flutter analyze`
- [ ] Code formatted: `dart format lib/ test/`
- [ ] Coverage acceptable: `flutter test --coverage`
- [ ] Integration tests pass (if applicable)

---

## 🐛 Debugging Tests

### Print Debug Info

```dart
test('debug example', () {
  final value = computeSomething();
  debugPrint('Value: $value');
  expect(value, 42);
});
```

### Use Debugger

```dart
test('debugger example', () {
  final value = computeSomething();
  // Add breakpoint here
  expect(value, 42);
});
```

Run with debugger in VS Code or Android Studio.

### Pump and Settle

```dart
testWidgets('wait for animations', (tester) async {
  await tester.pumpWidget(MyWidget());
  
  // Wait for all animations to complete
  await tester.pumpAndSettle();
  
  expect(find.text('Done'), findsOneWidget);
});
```

---

## 📚 Testing Resources

- [Flutter Testing Documentation](https://flutter.dev/docs/testing)
- [Widget Testing](https://flutter.dev/docs/cookbook/testing/widget)
- [Integration Testing](https://flutter.dev/docs/testing/integration-tests)
- [Mockito Documentation](https://pub.dev/packages/mockito)
- [Riverpod Testing](https://riverpod.dev/docs/essentials/testing)

---

## 💡 Best Practices

1. **Test Isolation**: Each test should be independent
2. **Descriptive Names**: Use clear test names
3. **AAA Pattern**: Arrange, Act, Assert
4. **Mock External Dependencies**: Don't make real API calls
5. **Test Edge Cases**: Not just happy paths
6. **Keep Tests Fast**: Use mocks to speed up tests
7. **Update Tests**: When fixing bugs, add tests first
8. **Golden Tests**: For critical UI components

---

**Last Updated: December 11, 2025**
