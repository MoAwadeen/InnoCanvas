import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Check for required environment variables
const googleAIKey = process.env.GOOGLE_AI_API_KEY;

if (!googleAIKey) {
  throw new Error('Missing GOOGLE_AI_API_KEY environment variable. Please check your .env.local file.');
}

export const ai = genkit({
  plugins: [googleAI({ apiKey: googleAIKey })],
  model: 'googleai/gemini-2.0-flash',
});

// Helper function to handle AI generation errors
export const handleAIError = (error: any, defaultMessage: string = 'AI generation failed') => {
  console.error('AI error:', error);
  
  if (error?.message) {
    return error.message;
  }
  
  if (error?.code) {
    switch (error.code) {
      case 'INVALID_API_KEY':
        return 'Invalid API key. Please check your Gemini API configuration.';
      case 'QUOTA_EXCEEDED':
        return 'API quota exceeded. Please try again later.';
      case 'RATE_LIMITED':
        return 'Rate limit exceeded. Please wait a moment and try again.';
      default:
        return defaultMessage;
    }
  }
  
  return defaultMessage;
};
