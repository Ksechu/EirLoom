// client/src/components/panels/CharacterPanel.tsx
import React, { useState } from 'react';
import { CharacterSettings } from '../../types/api';

interface CharacterPanelProps {
  onClose: () => void;
  onSave: (settings: CharacterSettings) => void;
  initialSettings: CharacterSettings;
}

const CharacterPanel: React.FC<CharacterPanelProps> = ({ onClose, onSave, initialSettings }) => {
  const [settings, setSettings] = useState<CharacterSettings>(initialSettings);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(settings);
  };

  return (
    <div className="sidebar-panel left-panel">
      <div className="panel-header">        
        <h2>Настройки персонажа</h2>
        <button onClick={onClose} className="panel-toggle-btn">
          <span className="arrow-icon">←</span>
        </button>
      </div>

      <div className="panel-content">
        {/* <div className="character-photo-placeholder">
          Фото
        </div> */}

        <div>
          <label>Мир (World):</label>
          <textarea
            name="world"
            value={settings.world}
            onChange={handleInputChange}
            placeholder="Описание мира, лор, общие правила."
          ></textarea>
        </div>

        {/* <div>
          <label>Персонаж (Character):</label>
          <textarea
            name="characterPersona"
            value={settings.characterPersona}
            onChange={handleInputChange}
            placeholder="Имя, характер, история и привычки персонажа."
          ></textarea>
        </div>

        <div>
          <label>Персонаж пользователя (User Persona):</label>
          <textarea
            name="userPersona"
            value={settings.userPersona}
            onChange={handleInputChange}
            placeholder="Ваше имя, характер, привычки."
          ></textarea>
        </div>

        <div>
          <label>Примеры диалогов (Example Dialogues):</label>
          <textarea
            name="exampleDialogues"
            value={settings.exampleDialogues}
            onChange={handleInputChange}
            placeholder="Пользователь: Привет. Персонаж: Привет, как дела?"
          ></textarea>
        </div> */}

        <div>
          <label>Первое сообщение (First Message):</label>
          <textarea
            name="firstMessage"
            value={settings.firstMessage}
            onChange={handleInputChange}
            placeholder="Сообщение, с которого начнется диалог..."
          ></textarea>
        </div>
      </div>
      
      <div className="panel-actions">
        <button onClick={handleSave}>Сохранить</button>
      </div>
    </div>
  );
};

export default CharacterPanel;