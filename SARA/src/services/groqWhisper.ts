import { GROQ_API_KEY, GROQ_BASE_URL } from '../constants/config';

/**
 * Transcribe audio to text using Groq Whisper API
 * @param audioUri - Local file URI of the audio recording
 * @returns Transcribed text in Arabic
 */
export async function transcribeAudio(audioUri: string): Promise<string> {
  try {
    // Read the audio file
    const response = await fetch(audioUri);
    const audioBlob = await response.blob();

    // Create form data for Whisper API
    const formData = new FormData();
    formData.append('file', audioBlob as any, 'audio.m4a');
    formData.append('model', 'whisper-large-v3');
    formData.append('language', 'ar'); // Arabic language
    formData.append('response_format', 'json');

    // Call Groq Whisper API
    const whisperResponse = await fetch(`${GROQ_BASE_URL}/audio/transcriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: formData
    });

    if (!whisperResponse.ok) {
      const errorData = await whisperResponse.json();
      console.error('Whisper API Error:', errorData);
      throw new Error('فشل في تحويل الصوت إلى نص');
    }

    const data = await whisperResponse.json();
    return data.text || '';
  } catch (error) {
    console.error('Whisper Transcription Error:', error);
    throw new Error('عذراً، حدث خطأ في معالجة الصوت');
  }
}

/**
 * Stream transcription for real-time voice (if supported in future)
 */
export async function streamTranscription(audioStream: any): Promise<AsyncGenerator<string>> {
  // Placeholder for future streaming implementation
  throw new Error('Streaming not yet implemented');
}
