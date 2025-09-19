// client/src/utils/api.ts
import { Message, GenerationSettings } from '../types/api';

interface GenerateResponse {
  choices: { message: Message }[];
  // Добавьте другие поля по мере необходимости
}

export const generateText = async (
  messages: Message[],
  settings: GenerationSettings,
  apiKey: string,
  provider: string
): Promise<GenerateResponse> => {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      provider,
      apiKey,
      messages,
      settings,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Something went wrong');
  }

  return response.json();
};