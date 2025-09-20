// client/src/components/chat/ChatList.tsx
import React from 'react';
import { Chat } from '../../types/data';
import './ChatList.css';

interface ChatListProps {
  chats: Chat[];
  onSelectChat: (chatId: string) => void;
  activeChatId: string | null;
  onDeleteChat: (chatId: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ chats, onSelectChat, activeChatId, onDeleteChat }) => {
  return (
    <div className="chat-list-container">
      {chats.length === 0 ? (
        <p className="no-chats-message">No chats yet. Create a new one to get started!</p>
      ) : (
        <ul className="chat-list">
          {chats.map(chat => (
            <li 
              key={chat.id} 
              className={`chat-list-item ${chat.id === activeChatId ? 'active' : ''}`}
              onClick={() => onSelectChat(chat.id)}
            >
              <div className="chat-info">
                <span className="chat-title">{chat.title}</span>
                <span className="chat-last-message">
                  {chat.messages.length > 0
                    ? chat.messages[chat.messages.length - 1].content.substring(0, 50) + '...'
                    : 'Empty chat'}
                </span>
                <span className="chat-date">
                  {new Date(chat.createdAt).toLocaleDateString()}
                </span>
              </div>
              <button 
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation(); // Предотвращаем срабатывание onSelectChat
                  onDeleteChat(chat.id);
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatList;