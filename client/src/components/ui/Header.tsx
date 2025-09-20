// client/src/components/ui/Header.tsx
import React from 'react';
import { ActiveView, ModalType, PanelType } from '../../types/ui';

interface HeaderProps {
    onNavClick: (view: ActiveView) => void;
    onModalClick: (modal: ModalType) => void;
    onPanelToggle: (panel: PanelType) => void;
    onNewChat: () => void;
    activeView: ActiveView;
    activePanels: PanelType[];
}

const Header: React.FC<HeaderProps> = ({
    onNavClick,
    onModalClick,
    onPanelToggle,
    onNewChat,
    activeView,
    activePanels
}) => {
    const isCharacterPanelOpen = activePanels.includes('character');
    const isPromptPanelOpen = activePanels.includes('prompt-settings');

    return (
        <header className="main-header">
            <h1>EirLoom</h1>
            <nav>
                <button
                    onClick={() => onNavClick('chat-list')}
                    className={activeView === 'chat-list' ? 'active' : ''}
                >
                    Chats
                </button>
                <button onClick={onNewChat}>New Chat</button>
                {activeView === 'chat' && (
                    <button
                        onClick={() => onPanelToggle('character')}
                        className={isCharacterPanelOpen ? 'active' : ''}
                    >
                        Character
                    </button>
                )}
                <button
                    onClick={() => onPanelToggle('prompt-settings')}
                    className={isPromptPanelOpen ? 'active' : ''}
                >
                    Settings
                </button>
                <button onClick={() => onModalClick('api-connect')}>API</button>
                <button onClick={() => onModalClick('persona-settings')}>Persona</button>
            </nav>
        </header>
    );
};

export default Header;