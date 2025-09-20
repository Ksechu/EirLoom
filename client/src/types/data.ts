// client/src/types/data.ts
import {
  ApiSettings,
  GenerationSettings,
  CharacterSettings,
  Message,
} from './api';

/**
 * @description Интерфейс для сущности Api.
 * Содержит настройки подключения к API.
 */
export interface Api {
  id: string;
  name: string;
  settings: ApiSettings;
}

/**
 * @description Интерфейс для сущности Prompt.
 * Содержит настройки генерации и системный промпт.
 */
export interface Prompt {
  id: string;
  name: string;
  settings: GenerationSettings;
  systemPrompt: string;
}

/**
 * @description Интерфейс для сущности Character.
 * Содержит настройки персонажа.
 */
export interface Character {
  id: string;
  name: string;
  settings: CharacterSettings;
}

/**
 * @description Интерфейс для сущности Chat.
 * Представляет собой отдельную беседу и содержит ссылки на связанные сущности.
 */
export interface Chat {
  id: string;
  title: string;
  createdAt: number; // Время в формате timestamp
  messages: Message[];
  characterId: string; // Добавляем обязательную связь с персонажем
}

/**
 * @description Интерфейс для данных приложения.
 */
export interface AppData {
  apis: Api[];
  prompts: Prompt[];
  characters: Character[];
  chats: Chat[];
  activeChatId: string | null;
}