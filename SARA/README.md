# SARA - AI Government Services Assistant (Expo)

This is a minimal Expo + React Native TypeScript starter for the SARA app — an Arabic (RTL) AI assistant to access Saudi government services.

## Quick Start

Prerequisites:
- Node.js (LTS) installed
- `npm` or `yarn` installed

Commands:

```bash
cd SARA
npm install
# Install recommended Expo packages for this template
npx expo install expo-linear-gradient expo-audio expo-av @react-navigation/native @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context @expo/vector-icons @expo-google-fonts/tajawal expo-font
npx expo install @react-navigation/native-stack
npx expo start
# Or use: npm run android | npm run ios
# Scan the QR code with Expo Go on iOS/Android
```

Also install `expo-asset` (required for `expo-audio`):
```bash
npx expo install expo-asset
```

## Notes
- The app is RTL-first (Arabic). We set `I18nManager.forceRTL(true)` in `App.tsx` for demo purposes.
- Groq API key is included as a placeholder in `src/services/groqAPI.ts`. In production, set environment variables and do not commit credentials.
 - Groq API key is included as a placeholder in `src/services/groqAPI.ts`. In production, set environment variables and do not commit credentials.
 - Groq model: if a model becomes deprecated (e.g. `mixtral-8x7b-32768`), update the model used by chat via `app.config.js` or `.env` as `GROQ_CHAT_MODEL`. The `groqAPI` service includes a fallback retry that will automatically attempt to use a configured fallback model when the primary model is unavailable.
 - To configure local secrets, copy `.env.example` to `.env` and populate `GROQ_API_KEY`. With Expo, you can also use `app.config.js` to inject `extra` settings.
- If `.expo/` was previously committed, remove it from the repo and commit again to apply `.gitignore`:
	```bash
	git rm -r --cached .expo
	git commit -m "chore: remove .expo from repo"
	```
 - To load Arabic fonts (Tajawal), install the Google font package and expo-font:
	```bash
	npm install @expo-google-fonts/tajawal expo-font
	# or with Expo CLI
	npx expo install @expo-google-fonts/tajawal expo-font
	## Audio library migration

	The project uses an `audioAdapter` wrapper to support the modern `expo-audio` library while keeping a `expo-av` fallback during migration. `expo-av` is deprecated in newer SDKs and will be removed later, so please install `expo-audio` as follows:

	```bash
	npx expo install expo-audio
	```

	You can remove `expo-av` once you verify everything works with `expo-audio`.

	Our `audioAdapter` handles:
	- creating and playing audio from base64 TTS responses
	- requesting recording permissions and creating a recording instance
	- switching to `expo-audio` when available

	If you want me to fully remove `expo-av` references and update the code with `expo-audio`-specific APIs only, I can do that next. This adapter approach keeps the code compatible across SDKs and avoids breaking older build setups.

	```
- Voice TTS uses `convertTextToSpeech` in `src/services/voiceTTS.ts` — demo implementation uses base64 audio returned from the TTS endpoint and plays it with `expo-av`.
- This project is Expo Go compatible (no native custom modules) and uses TypeScript.

## Project Structure

- `App.tsx`: Entry point (RTL + Navigation)
- `src/navigation`: AppNavigator with bottom tabs
- `src/screens`: Home, Chat, Services, Profile
- `src/components`: ServiceCard, ChatBubble, VoiceRecorder, AnimatedButton
- `src/services`: `groqAPI.ts` and `voiceTTS.ts`
- `src/constants`: `colors.ts`, `mockData.ts`, `config.ts`

## Development
- Use the app in Expo Go without building native binaries.

## Testing
- The current code is a starter; to test the Groq API and TTS features, ensure the API key is valid and your account supports the endpoints used.

## License
- MIT (customize as needed)

---

If you'd like, I can also add:
- TypeScript types for components
- A basic theme provider
- Unit tests
- CI workflow for the hackathon

Let me know which you'd like next! 🚀