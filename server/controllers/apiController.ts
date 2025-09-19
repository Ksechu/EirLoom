import { Request, Response } from 'express';
import axios from 'axios';
import { GenerationRequest } from '../types/api';

// Тестовый маршрут
export const testConnection = (req: Request, res: Response) => {
  res.json({ message: 'Backend is up and running!' });
};

// Маршрут для генерации текста
export const generateText = async (req: Request, res: Response) => {
  const { provider, apiKey, messages, settings }: GenerationRequest = req.body;

  let modelUrl = '';
  // Используем Record<string, string> для динамических ключей
  let headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  let payload: any = {};

  console.log(settings);

  if (provider === 'openrouter') {
    modelUrl = 'https://openrouter.ai/api/v1/chat/completions';
    headers['Authorization'] = `Bearer ${apiKey}`;
    payload = {
      model: settings.model,
      messages,
      temperature: settings.temperature,
      top_p: settings.top_p,
    };
  }

  try {
    const response = await axios.post(modelUrl, payload, { headers });
    res.json(response.data);
  } catch (error: any) {
    console.error('API Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to generate text from model.',
      details: error.response?.data || error.message
    });
  }
};