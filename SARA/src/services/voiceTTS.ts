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
        temperature: 0,
        response_format: 'base64'
      })
    });

    const data = await response.json();
    const base64Audio = data?.audio || data?.result || data?.data?.audio;
    if (!base64Audio) {
      console.warn('TTS: No audio returned from TTS API, response:', { status: response.status, data });
      return;
    }

    const uri = `data:audio/wav;base64,${base64Audio}`;
    const sound = await audioAdapter.createSoundFromBase64(base64Audio);
    await audioAdapter.playSound(sound);
    return sound;
  } catch (error) {
    console.error('TTS Error:', error);
  }
}
