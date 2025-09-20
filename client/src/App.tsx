// client/src/App.tsx
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Header from './components/ui/Header';
import Modal from './components/ui/Modal';
import ApiConnectModal from './components/modals/ApiConnectModal';
import PersonaSettingsModal from './components/modals/PersonaSettingsModal';
import PromptSettingsPanel from './components/panels/PromptSettingsPanel';
import CharacterPanel from './components/panels/CharacterPanel';
import ChatContainer from './components/chat/ChatContainer';
import ChatList from './components/chat/ChatList';
import { ActiveView, ModalType, PanelType } from './types/ui';
import { ApiSettings, Message, GenerationSettings, CharacterSettings } from './types/api';
import { Api, Prompt, Character, Chat } from './types/data';
import { generateText } from './utils/api';
import { db } from './db';
import './App.css';

// Дефолтные настройки, которые не хранятся в БД.
// Их ID заданы жестко, чтобы всегда была одна версия.
const defaultApi: Api = { id: 'global_api', name: 'Default API', settings: { provider: 'openrouter', apiKey: '', model: '', providerUrl: '' } };
const defaultPrompt: Prompt = { id: 'global_prompt', name: 'Default Prompt', settings: { temperature: 0.1, top_p: 0.9, top_k: 0, repetition_penalty: 1.0 }, systemPrompt: '' };

// Дефолтный персонаж для нового чата. Его ID временный.
const defaultCharacter: Character = { id: 'temp_default', name: '', settings: { world: '', characterPersona: '', userPersona: '', exampleDialogues: '', firstMessage: '', photoUrl: '' } };

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>('chat');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [activePanels, setActivePanels] = useState<PanelType[]>([]);

  // Состояния для хранения актуальных данных.
  // Глобальные настройки (APIs, Prompts) и чаты с персонажами.
  const [globalApis, setGlobalApis] = useState<Api[]>([defaultApi]);
  const [globalPrompts, setGlobalPrompts] = useState<Prompt[]>([defaultPrompt]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Загружаем данные из IndexedDB при старте приложения
  useEffect(() => {
    const loadDataFromDb = async () => {
      try {
        const loadedApis = await db.apis.toArray();
        const loadedPrompts = await db.prompts.toArray();
        const loadedCharacters = await db.characters.toArray();
        const loadedChats = await db.chats.toArray();

        // Загружаем сохраненные настройки или оставляем дефолтные, если их нет.
        if (loadedApis.length > 0) {
          setGlobalApis(loadedApis);
        }
        if (loadedPrompts.length > 0) {
          setGlobalPrompts(loadedPrompts);
        }
        
        setCharacters(loadedCharacters);
        setChats(loadedChats);
        // При загрузке активируем последний созданный чат
        const lastChat = loadedChats.length > 0 ? loadedChats.sort((a: Chat, b: Chat) => b.createdAt - a.createdAt)[0] : null;
        setActiveChatId(lastChat?.id || null);

      } catch (err) {
        console.error('Failed to load data from IndexedDB:', err);
        setError('Failed to load data. Your browser might not support IndexedDB or the database is corrupted.');
      } finally {
        setLoading(false);
      }
    };

    loadDataFromDb();
  }, []);

  const handleNewChat = () => {
    // Сбрасываем активный чат. Новый чат будет создан при сохранении персонажа.
    setActiveChatId(null);
    setActiveView('chat');
    setActivePanels(['character', 'prompt-settings']); // Открываем обе панели для нового чата
  };

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    setActiveView('chat');
    setActivePanels(['character', 'prompt-settings']); // Открываем обе панели при выборе существующего чата
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      const chatToDelete = chats.find(chat => chat.id === chatId);
      if (!chatToDelete) return;

      // Удаляем чат и привязанного к нему персонажа из IndexedDB
      await db.chats.delete(chatId);
      await db.characters.delete(chatToDelete.characterId);
      
      // Обновляем состояния в React
      const newChats = chats.filter(chat => chat.id !== chatId);
      const newCharacters = characters.filter(char => char.id !== chatToDelete.characterId);
      setChats(newChats);
      setCharacters(newCharacters);
      
      // Если удаленный чат был активным, переключаемся на первый или сбрасываем состояние
      if (activeChatId === chatId) {
        setActiveChatId(newChats.length > 0 ? newChats[0].id : null);
        setActiveView('chat');
      }
    } catch (err) {
      console.error('Error deleting chat:', err);
    }
  };

  const handleSendMessage = async (text: string) => {
    // Отправка сообщения возможна только при наличии активного чата
    if (!activeChatId) {
      console.error("No active chat to send a message to.");
      return;
    }

    const currentChat = chats.find(chat => chat.id === activeChatId);
    if (!currentChat) return;

    // Создаем сообщение пользователя и обновляем состояние чата
    const userMessage: Message = { role: 'user', content: text };
    const newMessages = [...currentChat.messages, userMessage];
    const updatedChat = { ...currentChat, messages: newMessages };
    setChats(prev => prev.map(c => c.id === currentChat.id ? updatedChat : c));
    await db.chats.put(updatedChat);

    // Получаем настройки для генерации
    const apiSettings = globalApis[0]?.settings;
    const promptSettings = globalPrompts[0]?.settings;
    const systemPrompt = globalPrompts[0]?.systemPrompt;
    const characterData = characters.find(char => char.id === currentChat.characterId);
    const characterSettings = characterData?.settings;

    if (!apiSettings || !promptSettings || !characterSettings) {
      console.error("Missing settings for chat generation.");
      return;
    }

    try {
      const response = await generateText(
        newMessages,
        promptSettings,
        apiSettings,
        characterSettings,
        systemPrompt
      );

      // Обрабатываем ответ и обновляем состояние
      const botMessage: Message = response.choices[0].message;
      const finalMessages = [...newMessages, botMessage];
      const finalChat = { ...currentChat, messages: finalMessages };
      
      setChats(prev => prev.map(c => c.id === currentChat.id ? finalChat : c));
      await db.chats.put(finalChat);

    } catch (error) {
      console.error('Ошибка:', error);
      console.error("Произошла ошибка при отправке запроса. Проверьте консоль для деталей.");
    }
  };

  const handleApiSave = async (settings: ApiSettings) => {
    // ID задан жестко, чтобы всегда была только одна запись в БД.
    const apiToSave: Api = { id: 'global_api', name: 'User API', settings };
    await db.apis.put(apiToSave);
    setGlobalApis([apiToSave]);
    setActiveModal(null);
  };
  
  const handlePromptSave = async (settings: GenerationSettings, prompt: string) => {
    // ID задан жестко, чтобы всегда была только одна запись в БД.
    const promptToSave: Prompt = { id: 'global_prompt', name: 'User Prompt', settings, systemPrompt: prompt };
    await db.prompts.put(promptToSave);
    setGlobalPrompts([promptToSave]);
    // Панель остается открытой
  };
  
  const handleCharacterSave = async (settings: CharacterSettings) => {
    if (!activeChatId) {
      // Логика создания нового чата и персонажа
      const newChatId = uuidv4();
      const newCharacterId = uuidv4();

      const newCharacter: Character = {
        id: newCharacterId,
        name: settings.characterPersona || 'Unnamed Character',
        settings,
      };

      const newChat: Chat = {
        id: newChatId,
        title: settings.characterPersona || 'New Chat',
        createdAt: Date.now(),
        messages: settings.firstMessage ? [{ role: 'assistant', content: settings.firstMessage }] : [],
        characterId: newCharacterId,
      };

      await db.characters.add(newCharacter);
      await db.chats.add(newChat);

      setCharacters(prev => [...prev, newCharacter]);
      setChats(prev => [...prev, newChat]);
      setActiveChatId(newChat.id);

    } else {
      // Логика обновления существующего персонажа и чата
      const existingChat = chats.find(chat => chat.id === activeChatId);
      if (!existingChat) return;

      const updatedChat = { ...existingChat, title: settings.characterPersona || 'Unnamed Character' };
      
      // Найдем существующего персонажа по characterId
      const existingCharacter = characters.find(char => char.id === existingChat.characterId);
      if (!existingCharacter) return;

      const updatedCharacter = { ...existingCharacter, name: existingChat.title || 'Unnamed Character', settings };

      // Сохраняем обновленные данные
      await db.chats.put(updatedChat);
      await db.characters.put(updatedCharacter);

      // Обновляем состояния в React
      setChats(prev => prev.map(c => c.id === existingChat.id ? updatedChat : c));
      setCharacters(prev => prev.map(c => c.id === existingCharacter.id ? updatedCharacter : c));
    }
    // Панель остается открытой
  };
  
  const handlePanelToggle = (panelType: PanelType) => {
    setActivePanels(prev => {
      if (prev.includes(panelType)) {
        return prev.filter(p => p !== panelType);
      } else {
        return [...prev, panelType];
      }
    });
  };

  if (loading) {
    return <div>Loading application data...</div>;
  }
  
  const currentChat = activeChatId ? chats.find(chat => chat.id === activeChatId) : null;
  const currentCharacter = activeChatId ? characters.find(char => char.id === currentChat?.characterId) : defaultCharacter;
  const apiData = globalApis[0];
  const promptData = globalPrompts[0];
  
  const isCharacterPanelOpen = activePanels.includes('character');
  const isPromptPanelOpen = activePanels.includes('prompt-settings');

  return (
    <div className="app-main-layout">
      <Header
        onNavClick={setActiveView}
        onModalClick={setActiveModal}
        onPanelToggle={handlePanelToggle}
        onNewChat={handleNewChat}
        activeView={activeView}
        activePanels={activePanels}
      />

      <main className="app-content">
        {activeView === 'chat' && (
          <>
            <div className="chat-area">
              <ChatContainer
                // В зависимости от состояния, показываем сообщения чата или первое сообщение персонажа
                messages={currentChat?.messages || (currentCharacter?.settings?.firstMessage ? [{ role: 'assistant', content: currentCharacter.settings.firstMessage }] : [])}
                onSendMessage={handleSendMessage}
                // Поле ввода заблокировано, пока не выбран/создан чат
                disabled={!activeChatId || isCharacterPanelOpen}
              />
            </div>
            {isCharacterPanelOpen && currentCharacter && (
              <CharacterPanel
                onClose={() => handlePanelToggle('character')}
                onSave={handleCharacterSave}
                initialSettings={currentCharacter.settings}
              />
            )}
          </>
        )}
        {isPromptPanelOpen && promptData && (
          <PromptSettingsPanel
            onClose={() => handlePanelToggle('prompt-settings')}
            onSave={handlePromptSave}
            onCancel={() => handlePanelToggle('prompt-settings')}
            initialSettings={promptData.settings}
            initialPrompt={promptData.systemPrompt}
          />
        )}
        {activeView === 'chat-list' && (
          <ChatList 
            chats={chats} 
            onSelectChat={handleSelectChat} 
            activeChatId={activeChatId} 
            onDeleteChat={handleDeleteChat}
          />
        )}
        {activeModal === 'api-connect' && apiData && (
          <Modal onClose={() => setActiveModal(null)}>
            <ApiConnectModal
              onClose={() => setActiveModal(null)}
              onSave={handleApiSave}
              initialSettings={apiData.settings}
            />
          </Modal>
        )}
        {activeModal === 'persona-settings' && (
          <Modal onClose={() => setActiveModal(null)}>
            <PersonaSettingsModal />
          </Modal>
        )}
      </main>
    </div>
  );
}

export default App;