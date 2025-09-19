import React, { useState } from 'react';

interface ApiConnectModalProps {
  onSave: (settings: { provider: string; apiKey: string }) => void;
  initialSettings?: { provider: string; apiKey: string };
}

const ApiConnectModal: React.FC<ApiConnectModalProps> = ({ onSave, initialSettings }) => {
  const [provider, setProvider] = useState(initialSettings?.provider || 'openrouter');
  const [apiKey, setApiKey] = useState(initialSettings?.apiKey || '');

  const handleSave = () => {
    onSave({ provider, apiKey });
  };

  return (
    <div>
      <h2>API Connection Settings</h2>
      <div>
        <label htmlFor="provider">Provider:</label>
        <select id="provider" value={provider} onChange={(e) => setProvider(e.target.value)}>
          <option value="openrouter">OpenRouter</option>
          {/* Добавьте другие опции, когда будете их реализовывать */}
        </select>
      </div>
      <div>
        <label htmlFor="apiKey">API Key:</label>
        <input
          id="apiKey"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
      </div>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default ApiConnectModal;