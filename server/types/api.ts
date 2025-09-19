export interface GenerationSettings {
  model: string;
  temperature: number;
  top_p: number;
  // Добавьте другие параметры по мере необходимости
}

export interface GenerationRequest {
  provider: string;
  apiKey: string;
  messages: { role: string; content: string }[];
  settings: GenerationSettings;
}