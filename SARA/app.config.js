import 'dotenv/config';

export default ({ config }) => {
  return {
    ...config,
    extra: {
      GROQ_API_KEY: process.env.GROQ_API_KEY || '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'
    }
    ,android: {
      permissions: [
        "RECORD_AUDIO"
      ]
    },
    ios: {
      infoPlist: {
        NSMicrophoneUsageDescription: process.env.MIC_PERMISSION || 'This app requires microphone access to record voice for AI chat.'
      }
    }
  };
};
