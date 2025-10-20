import React, { useState } from 'react';
import { Section } from '../../ui';

const DiagnosticComponent = ({
  diagnostics,
  title = "Diagnostic suggéré :",
  onSelectionChange
}) => {
  const [selectedDiagnostics, setSelectedDiagnostics] = useState([]);

  const toggleDiagnostic = (diagnostic) => {
    let newSelection;
    const isSelected = selectedDiagnostics.some(d => d.id === diagnostic.id);

    if (isSelected) {
      newSelection = selectedDiagnostics.filter(d => d.id !== diagnostic.id);
    } else {
      newSelection = [...selectedDiagnostics, diagnostic];
    }

    setSelectedDiagnostics(newSelection);
    if (onSelectionChange) {
      onSelectionChange(newSelection);
    }
  };

  const isSelected = (diagnosticId) => {
    return selectedDiagnostics.some(d => d.id === diagnosticId);
  };

  return (
    <Section title={title}>
      {!diagnostics || diagnostics.length === 0 ? (
        <p className="text-gray-500 text-sm">Aucun diagnostic disponible</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {diagnostics.map((diagnostic) => {
            const selected = isSelected(diagnostic.id);
            return (
              <button
                key={diagnostic.id}
                onClick={() => toggleDiagnostic(diagnostic)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium
                  border-2 transition-all duration-200
                  cursor-pointer hover:shadow-md
                  ${selected
                    ? 'bg-blue-100 text-blue-700 border-blue-500'
                    : 'bg-gray-100 text-gray-600 border-gray-300 hover:border-gray-400'
                  }
                `}
                title={diagnostic.explanation || `Probabilité: ${diagnostic.probability}%`}
              >
                {diagnostic.disease || diagnostic.name}
                {diagnostic.probability && (
                  <span className="ml-2 text-xs opacity-75">
                    ({diagnostic.probability.toFixed(0)}%)
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
      {selectedDiagnostics.length > 0 && (
        <p className="text-sm text-blue-600 mt-2">
          {selectedDiagnostics.length} diagnostic{selectedDiagnostics.length > 1 ? 's' : ''} sélectionné{selectedDiagnostics.length > 1 ? 's' : ''}
        </p>
      )}
    </Section>
  );
};

export default DiagnosticComponent;
