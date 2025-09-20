// client\src\components\chat\InputBar.tsx
import React, { useState } from 'react';

// Определяем интерфейс для пропсов
interface InputBarProps {
  onSendMessage: (text: string) => void;
  // Добавляем новый пропс для управления состоянием поля ввода
  disabled: boolean;
}

const InputBar: React.FC<InputBarProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState<string>('');

  const handleSend = () => {
    // Отправляем сообщение только если поле не заблокировано и не пустое
    if (!disabled && message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="input-bar">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={disabled ? "Please save a character to start a chat..." : "Type your message here..."}
        // Передаем пропс disabled в поле ввода
        disabled={disabled}
      />
      <button onClick={handleSend} disabled={disabled}>Send</button>
    </div>
  );
};

export default InputBar;