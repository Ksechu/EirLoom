// client\src\components\chat\ChatContainer.tsx
import React from 'react';
import ChatWindow from './ChatWindow';
import InputBar from './InputBar';
import { Message } from '../../types/api';

interface ChatContainerProps {
  messages: Message[];
  onSendMessage: (text: string) => Promise<void>;
  disabled: boolean;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ messages, onSendMessage, disabled }) => {
  return (
    <div className="chat-container">
      <ChatWindow messages={messages} />
      {/* Передаем пропс disabled в InputBar */}
      <InputBar onSendMessage={onSendMessage} disabled={disabled} />
    </div>
  );
};

export default ChatContainer;