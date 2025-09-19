export interface ApiSettings {
  provider: string;
  apiKey: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface GenerationSettings {
  model: string;
  temperature: number;
  top_p: number;
}