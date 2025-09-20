import React, { useState } from 'react';
import Header from './components/ui/Header';
import Modal from './components/ui/Modal';
import ApiConnectModal from './components/modals/ApiConnectModal';
import PersonaSettingsModal from './components/modals/PersonaSettingsModal';
import PromptSettingsPanel from './components/panels/PromptSettingsPanel';
import CharacterPanel from './components/panels/CharacterPanel';
import ChatContainer from './components/chat/ChatContainer';
import { ActiveView, ModalType, PanelType } from './types/ui';
import { ApiSettings, Message, GenerationSettings, CharacterSettings } from './types/api';
import { generateText } from './utils/api';
import './App.css';

function App() {
  const [activeView, setActiveView] = useState<ActiveView>('chat');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [isCharacterPanelOpen, setIsCharacterPanelOpen] = useState(false);
  const [isPromptPanelOpen, setIsPromptPanelOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  // Передаем в ApiSettings начальные значения
  const [apiSettings, setApiSettings] = useState<ApiSettings>({ provider: 'openrouter', apiKey: '', model: '', providerUrl: '' });
  const [promptSettings, setPromptSettings] = useState<GenerationSettings>({
    temperature: 0.1,
    top_p: 0.9,
    top_k: 0,
    repetition_penalty: 1.0,
  });
  const [systemPrompt, setSystemPrompt] = useState<string>('');
  
  const [characterSettings, setCharacterSettings] = useState<CharacterSettings>({
    world: '',
    characterPersona: '',
    userPersona: '',
    exampleDialogues: '',
    firstMessage: '',
    photoUrl: ''
  });

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
        characterSettings
      );

      const botMessage: Message = response.choices[0].message;
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Ошибка:', error);
      console.error("Произошла ошибка при отправке запроса. Проверьте консоль для деталей.");
    }
  };

  const handleApiSave = (settings: ApiSettings) => {
    // Сохраняем все настройки, включая provider
    setApiSettings(settings);
    setActiveModal(null);
  };
  
  const handlePromptSave = (settings: GenerationSettings, prompt: string) => {
    setPromptSettings(settings);
    setSystemPrompt(prompt);
    setIsPromptPanelOpen(false);
  };
  
  const handleCharacterSave = (settings: CharacterSettings) => {
    setCharacterSettings(settings);
    setIsCharacterPanelOpen(false);
  };

  const handleTogglePanel = (panelType: 'character' | 'prompt-settings') => {
    if (panelType === 'character') {
      setIsCharacterPanelOpen(prev => !prev);
    } else if (panelType === 'prompt-settings') {
      setIsPromptPanelOpen(prev => !prev);
    }
  };

  const handlePanelClose = (panel: 'character' | 'prompt-settings') => {
    if (panel === 'character') setIsCharacterPanelOpen(false);
    if (panel === 'prompt-settings') setIsPromptPanelOpen(false);
  };

  return (
    <div className="app-main-layout">
      <Header
        onNavClick={setActiveView}
        onModalClick={setActiveModal}
        onPanelToggle={handleTogglePanel}
      />

      <main className="app-content">
        {activeView === 'chat' && (
          <>
            <div className="chat-area">
              <ChatContainer messages={messages} onSendMessage={handleSendMessage} />
            </div>
            {isCharacterPanelOpen && (
              <CharacterPanel
                onClose={() => handlePanelClose('character')}
                onSave={handleCharacterSave}
                initialSettings={characterSettings}
              />
            )}
            {isPromptPanelOpen && (
              <PromptSettingsPanel
                onClose={() => handlePanelClose('prompt-settings')}
                onSave={handlePromptSave}
                onCancel={() => handlePanelClose('prompt-settings')}
                initialSettings={promptSettings}
                initialPrompt={systemPrompt}
              />
            )}
          </>
        )}
        {activeView === 'chat-list' && (
          <div className="placeholder-view"><h1>Список чатов</h1></div>
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