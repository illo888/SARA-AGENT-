import { GROQ_API_KEY, GROQ_BASE_URL, GROQ_CHAT_MODEL } from '../constants/config';

export async function sendMessageToGroq(userMessage: string, model?: string): Promise<string> {
  try {
    const usedModel = model || GROQ_CHAT_MODEL;
    const response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: usedModel,
        messages: [
          {
            role: 'system',
            content:
              'أنت سارا، مساعدة ذكية للخدمات الحكومية السعودية. ساعد المواطنين في الوصول إلى خدمات أبشر بطريقة سهلة ومفهومة.'
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();
    // If the API returns an error indicating that the model is unavailable, try fallback model
    if (data?.error && /model|not supported|deprecated|decommission|is not available|is not a valid model/i.test(String(data.error?.message || data.error || ''))) {
      // If a custom model was provided and failed, try the default chat model
      const fallbackModel = GROQ_CHAT_MODEL || 'mixtral-8x7b';
      if (usedModel !== fallbackModel) {
        console.warn(`Groq model ${usedModel} failed, retrying with fallback model ${fallbackModel}`);
        return await sendMessageToGroq(userMessage, fallbackModel);
      }
    }
    // Normalize the response: return a string if possible, otherwise extract message if error object
    const content = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text;
    if (typeof content === 'string' && content.trim() !== '') return content as string;
    if (data?.error) {
      if (typeof data.error === 'string') return data.error;
      if (data.error?.message) return String(data.error.message);
      return JSON.stringify(data.error);
    }
    return 'عذراً، لم أتلقَ ردًا';
  } catch (error) {
    console.error('Groq API Error:', error);
    return 'عذراً، حدث خطأ في الاتصال';
  }
}
