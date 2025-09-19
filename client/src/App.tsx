// client/src/App.tsx
import React, { useState } from 'react';
import Header from './components/ui/Header';
import Modal from './components/ui/Modal';
import ApiConnectModal from './components/modals/ApiConnectModal';
import PersonaSettingsModal from './components/modals/PersonaSettingsModal';
import PromptSettingsPanel from './components/panels/PromptSettingsPanel';
import CharacterPanel from './components/panels/CharacterPanel';
import ChatContainer from './components/chat/ChatContainer';
import { ActiveView, ModalType, PanelType } from './types/ui';
import { ApiSettings, Message, GenerationSettings } from './types/api';
import { generateText } from './utils/api';
import './App.css';

function App() {
  const [activeView, setActiveView] = useState<ActiveView>('chat');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // Состояние для хранения настроек API
  const [apiSettings, setApiSettings] = useState<ApiSettings>({ provider: 'openrouter', apiKey: '' });

  const handleSendMessage = async (text: string) => {
    // 1. Добавляем сообщение пользователя в чат
    const newMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, newMessage]);

    // 2. Отправляем запрос на генерацию
    try {
      // Пока что используем заглушки для настроек
      const settings: GenerationSettings = {
        model: 'deepseek/deepseek-chat-v3.1',
        temperature: 0.1,
        top_p: 0.9,
      };

      const response = await generateText(
        [...messages, newMessage], // Отправляем всю историю чата
        settings,
        apiSettings.apiKey,
        apiSettings.provider
      );

      // 3. Добавляем ответ бота в чат
      const botMessage: Message = response.choices[0].message;
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, something went wrong. Check your API settings." }]);
    }
  };

  const handleApiSave = (settings: ApiSettings) => {
    setApiSettings(settings);
    setActiveModal(null);
  };

  return (
    <div className="app-main-layout">
      <Header
        onNavClick={setActiveView}
        onModalClick={setActiveModal}
        onPanelClick={setActivePanel}
      />

      <main className="app-content">
        {activeView === 'chat' && (
          <>
            <div className="chat-area">
              <ChatContainer messages={messages} onSendMessage={handleSendMessage} />
            </div>
            {activePanel === 'character' && (
              <CharacterPanel onClose={() => setActivePanel(null)} />
            )}
          </>
        )}
        {activeView === 'chat-list' && (
          <div className="placeholder-view"><h1>Chats List</h1></div>
        )}

        {activePanel === 'prompt-settings' && (
          <PromptSettingsPanel onClose={() => setActivePanel(null)} />
        )}

        {activeModal === 'api-connect' && (
          <Modal onClose={() => setActiveModal(null)}>
            <ApiConnectModal
              onSave={handleApiSave}
              initialSettings={apiSettings}
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