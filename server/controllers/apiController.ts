// server\controllers\apiController.ts
import { Request, Response } from 'express';
import axios from 'axios';
import { GenerationSettings, Message } from '../types/api';

export const generateTextController = async (req: Request, res: Response) => {
  const { messages, settings, apiKey, model, providerUrl, systemPrompt } = req.body;

  try {
    // Создаем новый массив сообщений.
    // Копируем все сообщения из чата.
    const payloadMessages: Message[] = [...messages];

    // Если системный промпт существует, добавляем его в конец массива сообщений.
    if (systemPrompt) {
      payloadMessages.push({
        role: 'system',
        content: systemPrompt
      });
    }

    const payload = {
      model: model,
      messages: payloadMessages, // Отправляем обновленный массив
      ...settings,
    };

    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };

    console.log('[Бэкенд]: Отправка запроса к API...');
    console.log('[Бэкенд]: URL:', providerUrl);
    console.log('[Бэкенд]: Модель:', model);
    console.log('[Бэкенд]: Системный промпт:', systemPrompt || 'Отсутствует');
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