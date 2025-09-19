// client/src/types/api.ts
export interface ApiSettings {
  provider: string;
  apiKey: string;
  model: string;
  providerUrl: string; // Добавляем URL провайдера
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface GenerationSettings {
  temperature: number;
  top_p: number;
  top_k?: number;
  repetition_penalty?: number;
}