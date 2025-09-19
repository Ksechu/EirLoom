// client\src\components\chat\ChatContainer.tsx
import React from 'react';
import ChatWindow from './ChatWindow';
import InputBar from './InputBar';

interface ChatContainerProps {
  messages: { role: string; content: string; }[];
  onSendMessage: (text: string) => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ messages, onSendMessage }) => {
  return (
    <div className="chat-container">
      <ChatWindow messages={messages} />
      <InputBar onSendMessage={onSendMessage} />
    </div>
  );
};

export default ChatContainer;