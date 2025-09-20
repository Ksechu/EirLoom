// client\src\utils\api.ts
import {
  Message,
  GenerationSettings,
  ApiResponse,
  ApiSettings,
  CharacterSettings,
} from '../types/api';

const API_ENDPOINT = 'http://localhost:3001/api/generate';

/**
 * @description Отправляет запрос к API для генерации текста.
 * @param messages - Массив сообщений чата.
 * @param settings - Настройки генерации.
 * @param apiSettings - Настройки API (ключ, провайдер, URL).
 * @param characterSettings - Настройки персонажа.
 * @returns Промис с ответом от API.
 */
export const generateText = async (
  messages: Message[],
  generationSettings: GenerationSettings,
  apiSettings: ApiSettings,
  characterSettings: CharacterSettings,
): Promise<ApiResponse> => {
  const { apiKey, provider, model, providerUrl } = apiSettings;

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        settings: generationSettings,
        apiKey,
        provider,
        model,
        providerUrl,
        characterSettings,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Ошибка при запросе к API.');
    }

    return await response.json();
  } catch (error) {
    console.error('Ошибка в `generateText`:', error);
    throw error;
  }
};