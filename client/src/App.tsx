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

  const [apiSettings, setApiSettings] = useState<ApiSettings>({ provider: 'openrouter', apiKey: '', model: '', providerUrl: '' });
  const [promptSettings, setPromptSettings] = useState<GenerationSettings>({
    temperature: 0.1,
    top_p: 0.9,
    top_k: 0,
    repetition_penalty: 1.0,
  });
  const [systemPrompt, setSystemPrompt] = useState<string>('');

  const handleSendMessage = async (text: string) => {
    const newMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, newMessage]);

    try {
      const response = await generateText(
        [...messages, newMessage],
        promptSettings,
        apiSettings.apiKey,
        apiSettings.provider,
        apiSettings.model,
        apiSettings.providerUrl,
        systemPrompt,
      );

      const botMessage: Message = response.choices[0].message;
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Ошибка:', error);
      console.error("Произошла ошибка при отправке запроса. Проверьте консоль для деталей.");
    }
  };

  const handleApiSave = (settings: ApiSettings) => {
    setApiSettings(settings);
    setActiveModal(null);
  };
  
  const handlePromptSave = (settings: GenerationSettings, prompt: string) => {
    setPromptSettings(settings);
    setSystemPrompt(prompt);
  };
  
  const handlePromptCancel = () => {
    setActivePanel(null);
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
            {/* В будущем здесь добавится панель с ботами, которая будет заменять CharacterPanel */}
          </>
        )}
        {activeView === 'chat-list' && (
          <div className="placeholder-view"><h1>Список чатов</h1></div>
        )}

        {activePanel === 'prompt-settings' && (
          <PromptSettingsPanel
            onClose={() => setActivePanel(null)}
            onSave={handlePromptSave}
            onCancel={handlePromptCancel}
            initialSettings={promptSettings}
            initialPrompt={systemPrompt}
          />
        )}

        {activeModal === 'api-connect' && (
          <Modal onClose={() => setActiveModal(null)}>
            <ApiConnectModal
              onClose={() => setActiveModal(null)}
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