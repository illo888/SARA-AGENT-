// audioAdapter.ts
// This adapter prefers `expo-audio` if available; otherwise falls back to `expo-av`.
// Exposes a small subset of the Audio API used by the SARA app: Sound helpers and Recording helpers.

// We use dynamic require() style to avoid static bundling errors if a package does not exist.

let AudioImpl: any = null;
try {
  // Prefer the new package
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  AudioImpl = require('expo-audio');
} catch (err) {
  try {
    // fallback to expo-av
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    AudioImpl = require('expo-av');
  } catch (err2) {
    // No implementation available
    AudioImpl = null;
    console.warn('audioAdapter: no audio implementation found; ensure expo-audio or expo-av is installed.');
  }
}

export const Audio = AudioImpl?.Audio || AudioImpl || null;

// Small helper to create an Audio.Sound from a base64 audio (mp3/wav) string
export async function createSoundFromBase64(base64: string, format: string = 'mp3') {
  if (!Audio) throw new Error('Audio module not available');
  
  // For expo-audio (new API)
  if (AudioImpl && !AudioImpl.Audio) {
    try {
      const uri = `data:audio/${format};base64,${base64}`;
      const player = await AudioImpl.createAudioPlayer({ uri });
      return player;
    } catch (err) {
      console.error('expo-audio createAudioPlayer error:', err);
      throw err;
    }
  }
  
  // For expo-av (legacy API)
  if (Audio && Audio.Sound) {
    const uri = `data:audio/${format};base64,${base64}`;
    const result = await Audio.Sound.createAsync({ uri } as any);
    return result?.sound;
  }
  
  throw new Error('No audio implementation available');
}

export async function playSound(sound: any) {
  if (!sound) return;
  try {
    // expo-audio uses .play(), expo-av uses .playAsync()
    if (sound.play && typeof sound.play === 'function') {
      await sound.play();
    } else if (sound.playAsync && typeof sound.playAsync === 'function') {
      await sound.playAsync();
    }
  } catch (err) {
    console.warn('audioAdapter.playSound error', err);
  }
}

export async function stopSound(sound: any) {
  if (!sound) return;
  try {
    // expo-audio uses .pause() + .remove(), expo-av uses .stopAsync()
    if (sound.pause && typeof sound.pause === 'function') {
      await sound.pause();
      if (sound.remove && typeof sound.remove === 'function') {
        await sound.remove();
      }
    } else if (sound.stopAsync && typeof sound.stopAsync === 'function') {
      await sound.stopAsync();
    }
  } catch (err) {
    console.warn('audioAdapter.stopSound error', err);
  }
}

export function setOnPlaybackStatusUpdate(sound: any, handler: (status: any) => void) {
  if (!sound) return;
  try {
    sound.setOnPlaybackStatusUpdate(handler);
  } catch (err) {
    // Some builds might not export setOnPlaybackStatusUpdate; fallback noop
  }
}

// Recording utilities
export async function requestRecordingPermissions() {
  if (!Audio) return { status: 'denied' };
  try {
    // audio permission call differs between modules. For backwards compat we attempt both.
    if (Audio.requestPermissionsAsync) {
      return await Audio.requestPermissionsAsync();
    }

    if (Audio.getPermissionsAsync) {
      return await Audio.getPermissionsAsync();
    }

    // Some audio modules expose a different permission flow, return granted for demo
    return { status: 'granted' };
  } catch (err) {
    console.warn('audioAdapter.requestRecordingPermissions error', err);
    return { status: 'denied' };
  }
}

export async function setAudioModeAsync(opts: any) {
  if (!Audio) return;
  try {
    if (Audio.setAudioModeAsync) {
      await Audio.setAudioModeAsync(opts);
    }
  } catch (err) {
    console.warn('audioAdapter.setAudioModeAsync error', err);
  }
}

export function createRecording() {
  if (!Audio) throw new Error('Audio module not available');
  // return a new Recording instance
  try {
    return new (Audio.Recording as any)();
  } catch (err) {
    console.warn('audioAdapter.createRecording failed', err);
    return null;
  }
}

export default {
  Audio,
  createSoundFromBase64,
  playSound,
  stopSound,
  setOnPlaybackStatusUpdate,
  requestRecordingPermissions,
  setAudioModeAsync,
  createRecording
};