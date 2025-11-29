import audioAdapter from './audioAdapter';
import { GROQ_API_KEY, GROQ_BASE_URL } from '../constants/config';

export async function convertTextToSpeech(arabicText: string): Promise<any | void> {
  try {
    const response = await fetch(`${GROQ_BASE_URL}/audio/speech`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'playai-tts-arabic',
        voice: 'Amira-PlayAI',
        input: arabicText,
        response_format: 'mp3'
      })
    });

    // Check if response is ok
    if (!response.ok) {
      const errorData = await response.json();
      console.warn('TTS API Error:', errorData);
      return;
    }

    // Get audio as blob/buffer
    const audioBlob = await response.blob();
    if (!audioBlob || audioBlob.size === 0) {
      console.warn('TTS: No audio data returned');
      return;
    }

    // Convert blob to base64 for React Native Audio
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = async () => {
        try {
          const base64 = (reader.result as string).split(',')[1];
          const sound = await audioAdapter.createSoundFromBase64(base64, 'mp3');
          await audioAdapter.playSound(sound);
          resolve(sound);
        } catch (err) {
          console.error('TTS Play Error:', err);
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(audioBlob);
    });
  } catch (error) {
    console.error('TTS Error:', error);
  }
}
