import React from 'react';

// Определяем интерфейс для пропсов, которые принимает компонент
interface Message {
  role: string;
  content: string;
}

interface ChatWindowProps {
  messages: Message[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  return (
    <div className="chat-window">
      {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.role}`}>
          <b>{msg.role === 'user' ? 'You' : 'Bot'}:</b> {msg.content}
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;