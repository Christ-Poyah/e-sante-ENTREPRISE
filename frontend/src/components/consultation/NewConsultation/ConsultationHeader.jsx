import React from 'react';

const ToggleButton = ({ enabled, onChange }) => {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span className="sr-only">Toggle AI assistance</span>
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

const ConsultationHeader = ({ isAIEnabled, onToggleAI }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold">Nouvelle Consultation</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 font-medium">
          Assistance IA
        </span>
        <ToggleButton 
          enabled={isAIEnabled} 
          onChange={onToggleAI}
        />
      </div>
    </div>
  );
};

export default ConsultationHeader;