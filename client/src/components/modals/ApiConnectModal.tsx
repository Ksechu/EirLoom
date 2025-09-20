// client\src\components\modals\ApiConnectModal.tsx
import React, { useState, useEffect } from 'react';
import { ApiSettings } from '../../types/api';

interface ApiConnectModalProps {
   onSave: (settings: ApiSettings) => void;
   initialSettings?: ApiSettings;
   onClose: () => void;
}

const providerOptions = [
  { 
    name: 'OpenRouter', 
    value: 'openrouter', 
    url: 'https://openrouter.ai/api/v1/chat/completions', 
    defaultModel: 'openrouter/cinematika-7b' 
  },
  { 
    name: 'Google Gemini', 
    value: 'google', 
    url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent', 
    defaultModel: 'gemini-1.5-flash-latest' 
  },
];

const ApiConnectModal: React.FC<ApiConnectModalProps> = ({ onSave, initialSettings, onClose }) => {
  const [selectedProvider, setSelectedProvider] = useState<string>(initialSettings?.provider || 'openrouter');
  const [keys, setKeys] = useState<string[]>(initialSettings?.apiKey ? [initialSettings.apiKey] : ['']);
  const [model, setModel] = useState<string>(initialSettings?.model || '');
  const [providerUrl, setProviderUrl] = useState<string>(initialSettings?.providerUrl || '');
  const [autoRotate, setAutoRotate] = useState<boolean>(false);

  // Используем useEffect, чтобы обновлять URL и модель при смене провайдера
  useEffect(() => {
    const selected = providerOptions.find(p => p.value === selectedProvider);
    if (selected) {
      setProviderUrl(selected.url);
      setModel(selected.defaultModel);
    }
  }, [selectedProvider]);
  
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
         provider: selectedProvider, // Отправляем выбранный провайдер
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
        <label>Провайдер:</label>
        <select value={selectedProvider} onChange={(e) => setSelectedProvider(e.target.value)}>
          {providerOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
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