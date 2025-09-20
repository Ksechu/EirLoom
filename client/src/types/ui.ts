// client/src/types/ui.ts

/**
 * @description Определяет возможные виды отображения в приложении.
 */
export type ActiveView = 'chat' | 'chat-list';

/**
 * @description Определяет типы модальных окон.
 */
export type ModalType = 'api-connect' | 'persona-settings' | null;

/**
 * @description Определяет типы боковых панелей.
 */
export type PanelType = 'character' | 'prompt-settings';