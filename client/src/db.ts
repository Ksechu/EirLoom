// client/src/db.ts
import Dexie from 'dexie';
import { Api, Character, Prompt, Chat } from './types/data';

// Класс для нашей базы данных. Наследуемся от Dexie.
class AppDatabase extends Dexie {
  // Объявляем "таблицы" (stores) нашей базы данных.
  // Ключевая часть - это "схема", где мы определяем индексы.
  chats!: Dexie.Table<Chat, string>;
  characters!: Dexie.Table<Character, string>;
  prompts!: Dexie.Table<Prompt, string>;
  apis!: Dexie.Table<Api, string>;

  constructor() {
    super('EirLoomDatabase'); // Имя нашей базы данных
    this.version(4).stores({
      chats: 'id, createdAt, characterId',
      characters: 'id',
      prompts: 'id',
      apis: 'id',
    });
  }
}

// Создаем экземпляр базы данных, который будем экспортировать.
export const db = new AppDatabase();