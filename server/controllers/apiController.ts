import { Request, Response } from 'express';
import axios from 'axios';
import { GenerationSettings, Message, CharacterSettings } from '../types/api';

/**
 * @description Формирует промпт из настроек персонажа.
 * @param characterSettings - Объект с настройками персонажа.
 * @returns Полный системный промпт в виде строки.
 */
const buildSystemPrompt = (characterSettings: CharacterSettings): string => {
  const contextParts = [];

  // 1. Описание мира
  if (characterSettings.world) {
    contextParts.push(`**World:** ${characterSettings.world}`);
  }

  // 2. Личность персонажа
  if (characterSettings.characterPersona) {
    contextParts.push(`**Personality:** ${characterSettings.characterPersona}`);
  }

  // 3. Примеры диалогов
  if (characterSettings.exampleDialogues) {
    contextParts.push(`**Example dialogues:**\n${characterSettings.exampleDialogues}`);
  }

  // 4. Личность пользователя
  if (characterSettings.userPersona) {
    contextParts.push(`**User character:** ${characterSettings.userPersona}`);
  }

  return contextParts.join('\n\n');
};

/**
 * @description Формирует тело запроса для API OpenRouter.
 * @param messages - Массив сообщений чата.
 * @param settings - Настройки генерации.
 * @param model - Имя модели.
 * @returns Объект с телом запроса, готовый для отправки.
 */
const buildOpenRouterPayload = (messages: Message[], settings: GenerationSettings, model: string): any => {
  return {
    model: model,
    messages: messages,
    ...settings,
  };
};

/**
 * @description Контроллер для генерации текста.
 * @param req - Объект запроса.
 * @param res - Объект ответа.
 */
export const generateTextController = async (req: Request, res: Response) => {
  const { messages, settings, apiKey, model, provider, providerUrl, systemPrompt, characterSettings } = req.body;

  try {
    const fullContext = buildSystemPrompt(characterSettings);
    
    // Создаем новый массив сообщений для отправки.
    const payloadMessages: Message[] = [...messages];

    // Добавляем информацию бота в начало
    if (fullContext) {
      payloadMessages.unshift({
        role: 'system',
        content: fullContext
      });
    }

    // Добавляем промпт
    if (fullContext) {
      payloadMessages.unshift({
        role: 'system',
        content: systemPrompt
      });
      // payloadMessages.push({
      //   role: 'system',
      //   content: systemPrompt
      // });
    }

    let payload: any;
    
    // Логика переключения по провайдеру
    switch (provider) {
        case 'openrouter':
            payload = buildOpenRouterPayload(payloadMessages, settings, model);
            break;
        // Здесь можно добавить другие провайдеры, например:
        // case 'google':
        //     payload = buildGooglePayload(payloadMessages, settings, model);
        //     break;
        default:
            // throw new Error('Неизвестный провайдер API');
            payload = buildOpenRouterPayload(payloadMessages, settings, model);
            break;
    }

    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };

    console.log('[Бэкенд]: Отправка запроса к API...');
    console.log('[Бэкенд]: URL:', providerUrl);
    console.log('[Бэкенд]: Модель:', model);
    console.log('[Бэкенд]: Полный контекст:', fullContext || 'Отсутствует');
    console.log('[Бэкенд]: Настройки:', settings);

    const response = await axios.post(providerUrl, payload, { headers });

    console.log('[Бэкенд]: Ответ получен. Отправка на фронтенд.');
    res.json(response.data);

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('[Бэкенд - Ошибка Axios]:', error.message);
      if (error.response) {
        console.error('[Бэкенд - Ответ провайдера]:', error.response.data);
      }
      res.status(error.response?.status || 500).json({ error: 'Произошла ошибка при запросе к API. Проверьте ключ и настройки.' });
    } else {
      console.error('[Бэкенд - Неизвестная ошибка]:', error);
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  }
};