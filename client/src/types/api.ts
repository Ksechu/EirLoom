// client/src/types/api.ts

export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  role: MessageRole;
  content: string;
}

export interface ApiResponse {
  choices: Array<{
    message: Message;
    index: number;
    finish_reason: string;
  }>;
}

export interface GenerationSettings {
  temperature: number;
  top_p: number;
  top_k: number;
  repetition_penalty: number;
}

export interface ApiSettings {
  provider: string;
  apiKey: string;
  model: string;
  providerUrl: string;
}

export interface CharacterSettings {
  world: string;
  characterPersona: string;
  userPersona: string;
  exampleDialogues: string;
  firstMessage: string;
  photoUrl: string;
}