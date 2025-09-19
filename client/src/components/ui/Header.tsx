// client/src/components/ui/Header.tsx
import React from 'react';
import { ActiveView } from '../../types/ui';

interface HeaderProps {
  onNavClick: (view: ActiveView) => void;
  onModalClick: (modalType: 'api-connect' | 'persona-settings') => void;
  onPanelClick: (panelType: 'prompt-settings') => void;
}

const Header: React.FC<HeaderProps> = ({ onNavClick, onModalClick, onPanelClick }) => {
  return (
    <header className="main-header">
      <h1>EirLoom</h1>
      <nav>
        <button onClick={() => onNavClick('chat')}>New Chat</button>
        <button onClick={() => onNavClick('chat-list')}>Chats</button>
        <button onClick={() => onPanelClick('prompt-settings')}>Settings</button>
        <button onClick={() => onModalClick('api-connect')}>API</button>
        <button onClick={() => onModalClick('persona-settings')}>Persona</button>
      </nav>
    </header>
  );
};

export default Header;