import React from 'react';

interface CharacterPanelProps {
  onClose: () => void;
}

const CharacterPanel: React.FC<CharacterPanelProps> = ({ onClose }) => {
  return (
    <div className="sidebar-panel left-panel">
      <button onClick={onClose}>Close</button>
      <h2>Character Description</h2>
      <p>Here you will describe your character.</p>
    </div>
  );
};

export default CharacterPanel;