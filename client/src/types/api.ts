// client/src/types/api.ts
export interface ApiSettings {
  provider: string;
  apiKey: string;
  model: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface GenerationSettings {
  temperature: number;
  top_p: number;
  top_k?: number;
  repetition_penalty?: number;
}