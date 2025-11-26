import Constants from 'expo-constants';

// Preferred: set via app.config.js or expo app extras, otherwise fallback to process.env
export const GROQ_API_KEY =
  (Constants?.manifest as any)?.extra?.GROQ_API_KEY || process.env.GROQ_API_KEY ||
  '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';

export const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';
export const GROQ_CHAT_MODEL = (Constants?.manifest as any)?.extra?.GROQ_CHAT_MODEL || process.env.GROQ_CHAT_MODEL || 'mixtral-8x7b';

export default {
  GROQ_API_KEY,
  GROQ_BASE_URL
  ,GROQ_CHAT_MODEL
};
