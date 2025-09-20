// client\src\components\ui\Header.tsx
import React from 'react';
import { ActiveView } from '../../types/ui';

interface HeaderProps {
  onNavClick: (view: ActiveView) => void;
  onModalClick: (modalType: 'api-connect' | 'persona-settings') => void;
  onPanelToggle: (panelType: 'character' | 'prompt-settings') => void;
  onNewChat: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavClick, onModalClick, onPanelToggle, onNewChat }) => {
  return (
    <header className="main-header">
      <h1>EirLoom</h1>
      <nav>
        <button onClick={() => onPanelToggle('character')}>Character</button>
        <button onClick={onNewChat}>New Chat</button>
        <button onClick={() => onNavClick('chat-list')}>Chats</button>
        <button onClick={() => onPanelToggle('prompt-settings')}>Settings</button>
        <button onClick={() => onModalClick('api-connect')}>API</button>
        <button onClick={() => onModalClick('persona-settings')}>Persona</button>
      </nav>
    </header>
  );
};

export default Header;