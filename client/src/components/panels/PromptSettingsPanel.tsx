import React from 'react';

interface PromptSettingsPanelProps {
  onClose: () => void;
}

const PromptSettingsPanel: React.FC<PromptSettingsPanelProps> = ({ onClose }) => {
  return (
    <div className="sidebar-panel right-panel">
      <button onClick={onClose}>Close</button>
      <h2>Prompt Settings</h2>
      <p>Here will be sliders and inputs for temperature, top_p, etc.</p>
    </div>
  );
};

export default PromptSettingsPanel;