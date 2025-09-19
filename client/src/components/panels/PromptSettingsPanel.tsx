// client\src\components\panels\PromptSettingsPanel.tsx
import React, { useState } from 'react';
import { GenerationSettings } from '../../types/api';

interface PromptSettingsPanelProps {
  onClose: () => void;
  onSave: (settings: GenerationSettings, prompt: string) => void;
  onCancel: () => void;
  initialSettings: GenerationSettings;
  initialPrompt: string;
}

const defaultSettings: GenerationSettings = {
  temperature: 0.7,
  top_p: 0.9,
  top_k: 0,
  repetition_penalty: 1.1,
};

const PromptSettingsPanel: React.FC<PromptSettingsPanelProps> = ({ onClose, onSave, onCancel, initialSettings, initialPrompt }) => {
  const [settings, setSettings] = useState<GenerationSettings>(initialSettings);
  const [promptText, setPromptText] = useState<string>(initialPrompt);
  const [isPromptExpanded, setIsPromptExpanded] = useState<boolean>(true);
  const [isParamsExpanded, setIsParamsExpanded] = useState<boolean>(true);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: parseFloat(value) }));
  };
  
  const handleResetToDefault = () => {
    setSettings(defaultSettings);
    setPromptText('');
  };
  
  const handleGetFullPrompt = () => {
    console.log("Получить весь промпт");
  };

  return (
    <div className="sidebar-panel right-panel active">
      <div className="panel-header">
        <button onClick={onClose} className="panel-toggle-btn">
          <span className="arrow-icon">→</span>
        </button>
        <h2>Настройки промпта</h2>
        <button onClick={handleResetToDefault}>По умолчанию</button>
      </div>

      <div className="panel-controls">
        <div className="collapsible-section">
          <div className="collapsible-header" onClick={() => setIsPromptExpanded(!isPromptExpanded)}>
            <h3>Промпт</h3>
          </div>
          {isPromptExpanded && (
            <div className="collapsible-content">
              <textarea
                placeholder="Введите текст промпта..."
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
              ></textarea>
            </div>
          )}
        </div>

        <div className="collapsible-section">
          <div className="collapsible-header" onClick={() => setIsParamsExpanded(!isParamsExpanded)}>
            <h3>Параметры генерации</h3>
          </div>
          {isParamsExpanded && (
            <div className="collapsible-content">
              <div>
                <label>Температура:</label>
                <input
                  type="number"
                  name="temperature"
                  value={settings.temperature}
                  onChange={handleInputChange}
                  min="0.0"
                  max="2.0"
                  step="0.1"
                />
                <small> (0.0 - 2.0)</small>
              </div>
              <div>
                <label>Top P:</label>
                <input
                  type="number"
                  name="top_p"
                  value={settings.top_p}
                  onChange={handleInputChange}
                  min="0.0"
                  max="1.0"
                  step="0.1"
                />
                <small> (0.0 - 1.0)</small>
              </div>
              <div>
                <label>Top K:</label>
                <input
                  type="number"
                  name="top_k"
                  value={settings.top_k}
                  onChange={handleInputChange}
                  min="0"
                  step="1"
                />
                <small> (0 - 100)</small>
              </div>
              <div>
                <label>Штраф за повторы:</label>
                <input
                  type="number"
                  name="repetition_penalty"
                  value={settings.repetition_penalty}
                  onChange={handleInputChange}
                  min="1.0"
                  max="2.0"
                  step="0.1"
                />
                <small> (1.0 - 2.0)</small>
              </div>
            </div>
          )}
        </div>

        <div className="panel-actions">
          <button onClick={() => onCancel()}>Отмена</button>
          <button onClick={() => onSave(settings, promptText)}>Сохранить</button>
        </div>
      </div>
      
      <div className="panel-footer">
        <button onClick={handleGetFullPrompt}>Получить весь промпт</button>
      </div>
    </div>
  );
};

export default PromptSettingsPanel;