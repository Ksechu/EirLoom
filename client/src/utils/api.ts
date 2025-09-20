// client/src/utils/api.ts
import { Message, GenerationSettings, CharacterSettings } from '../types/api';

export const generateText = async (
  messages: Message[],
  settings: GenerationSettings,
  apiKey: string,
  provider: string,
  model: string,
  providerUrl: string,
  systemPrompt: string,
  characterSettings: CharacterSettings // Принимаем данные персонажа
) => {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        settings,
        apiKey,
        provider,
        model,
        providerUrl,
        systemPrompt,
        characterSettings // Передаем данные персонажа на бэкенд
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Ошибка при генерации текста');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка в generateText:', error);
    throw error;
  }
};