// client\src\components\modals\ApiConnectModal.tsx
import React, { useState } from 'react';
import { ApiSettings } from '../../types/api';

interface ApiConnectModalProps {
  onSave: (settings: ApiSettings) => void;
  initialSettings?: ApiSettings;
  onClose: () => void;
}

const ApiConnectModal: React.FC<ApiConnectModalProps> = ({ onSave, initialSettings, onClose }) => {
  const [keys, setKeys] = useState<string[]>(initialSettings?.apiKey ? [initialSettings.apiKey] : ['']);
  const [model, setModel] = useState<string>(initialSettings?.model || '');
  const [providerUrl, setProviderUrl] = useState<string>(initialSettings?.providerUrl || '');
  const [autoRotate, setAutoRotate] = useState<boolean>(false);

  const isLastKeyEmpty = keys[keys.length - 1] === '';
  const isLimitReached = keys.length >= 12;

  const handleAddKey = () => {
    if (!isLimitReached && !isLastKeyEmpty) {
      setKeys([...keys, '']);
    }
  };

  const handleRemoveKey = (index: number) => {
    if (keys.length > 1) {
      const newKeys = [...keys];
      newKeys.splice(index, 1);
      setKeys(newKeys);
    }
  };

  const handleKeyChange = (index: number, value: string) => {
    const newKeys = [...keys];
    newKeys[index] = value;
    setKeys(newKeys);
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const newKeys = [...keys];
      [newKeys[index - 1], newKeys[index]] = [newKeys[index], newKeys[index - 1]];
      setKeys(newKeys);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < keys.length - 1) {
      const newKeys = [...keys];
      [newKeys[index + 1], newKeys[index]] = [newKeys[index], newKeys[index + 1]];
      setKeys(newKeys);
    }
  };

  const handleSave = () => {
    onSave({
      provider: 'openrouter',
      apiKey: keys[0],
      model: model,
      providerUrl: providerUrl,
    });
    onClose();
  };

  return (
    <div>
      <h2>Настройки подключения к API</h2>
      <div>
        <label>URL провайдера:</label>
        <input
          type="text"
          value={providerUrl}
          onChange={(e) => setProviderUrl(e.target.value)}
          placeholder="Например, https://openrouter.ai/api/v1/chat/completions"
        />
      </div>

      <div>
        <label>Имя модели:</label>
        <input
          type="text"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="Например, deepseek/deepseek-chat-v3.1"
        />
      </div>

      <div>
        <label>Ключи API:</label>
        {keys.map((key, index) => (
          <div key={index}>
            <input
              type="text"
              value={key}
              onChange={(e) => handleKeyChange(index, e.target.value)}
              placeholder={`Ключ #${index + 1}`}
            />
            {keys.length > 1 && (
              <button onClick={() => handleRemoveKey(index)}>-</button>
            )}
            <button onClick={() => handleMoveUp(index)} disabled={index === 0}>
              ↑
            </button>
            <button onClick={() => handleMoveDown(index)} disabled={index === keys.length - 1}>
              ↓
            </button>
          </div>
        ))}
        {isLimitReached ? (
          <p>Достигнут лимит в 12 ключей</p>
        ) : (
          <button onClick={handleAddKey} disabled={isLastKeyEmpty}>+</button>
        )}
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={autoRotate}
            onChange={(e) => setAutoRotate(e.target.checked)}
          />
          Автосмена ключей
        </label>
      </div>

      <div>
        <button onClick={onClose}>Отмена</button>
        <button onClick={handleSave}>Сохранить</button>
      </div>
    </div>
  );
};

export default ApiConnectModal;