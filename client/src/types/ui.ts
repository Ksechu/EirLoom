// client\src\types\ui.ts

// Определяем доступные "виды" для навигации
export type ActiveView = 'chat-list' | 'chat' | 'prompt-settings' | 'persona-settings';

// Типы для модальных окон
export type ModalType = 'api-connect' | 'persona-settings' | null;

// Типы для боковых панелей
export type PanelType = 'character' | 'prompt-settings' | null;