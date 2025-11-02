import React, { useState, useEffect } from 'react';
import { Section } from '../../ui';
import { AlertCircle } from 'lucide-react';

const MedicationSuggestion = ({
  medications,
  title = "Médicaments recommandés",
  onSelectionChange,
  patientInfo
}) => {
  const [selectedMedications, setSelectedMedications] = useState([]);
  const [warnings, setWarnings] = useState({});

  const toggleMedication = (medication) => {
    let newSelection;
    const isSelected = selectedMedications.some(m => m.id === medication.id);

    if (isSelected) {
      newSelection = selectedMedications.filter(m => m.id !== medication.id);
    } else {
      newSelection = [...selectedMedications, medication];
    }

    setSelectedMedications(newSelection);
    if (onSelectionChange) {
      onSelectionChange(newSelection);
    }
  };

  const isSelected = (medicationId) => {
    return selectedMedications.some(m => m.id === medicationId);
  };

  useEffect(() => {
    const checkCompatibility = async () => {
      if (selectedMedications.length < 2) {
        setWarnings({});
        return;
      }

      try {
        const response = await fetch('http://localhost:8001/check-medication-compatibility', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            medications: selectedMedications,
            patientInfo: patientInfo
          })
        });

        const data = await response.json();
        console.log("Compatibilité médicaments:", data);

        const warningsMap = {};
        if (data.warnings && data.warnings.length > 0) {
          data.warnings.forEach(warning => {
            warning.medication_ids.forEach(medId => {
              if (!warningsMap[medId]) {
                warningsMap[medId] = [];
              }
              warningsMap[medId].push(warning);
            });
          });
        }

        setWarnings(warningsMap);
      } catch (error) {
        console.error('Erreur vérification compatibilité:', error);
      }
    };

    checkCompatibility();
  }, [selectedMedications, patientInfo]);

  const getMedicationWarnings = (medicationId) => {
    return warnings[medicationId] || [];
  };

  const getBorderColor = (medicationId, selected) => {
    const medWarnings = getMedicationWarnings(medicationId);
    if (medWarnings.length === 0) {
      return selected ? 'border-blue-500' : 'border-gray-300 hover:border-gray-400';
    }

    const highSeverity = medWarnings.some(w => w.severity === 'high');
    if (highSeverity) return 'border-red-500';

    const mediumSeverity = medWarnings.some(w => w.severity === 'medium');
    if (mediumSeverity) return 'border-orange-500';

    return 'border-yellow-500';
  };

  return (
    <Section title={title}>
      {!medications || medications.length === 0 ? (
        <p className="text-gray-500 text-sm">Aucun médicament recommandé</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {medications.map((medication) => {
            const selected = isSelected(medication.id);
            const medWarnings = getMedicationWarnings(medication.id);
            const hasWarning = medWarnings.length > 0;

            return (
              <div key={medication.id} className="relative group">
                <button
                  onClick={() => toggleMedication(medication)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium
                    border-2 transition-all duration-200
                    cursor-pointer hover:shadow-md
                    ${selected
                      ? 'bg-blue-100 text-blue-700 border-blue-500'
                      : hasWarning
                        ? 'bg-red-50 text-red-700 border-red-400 hover:border-red-500'
                        : 'bg-gray-100 text-gray-600 border-gray-300 hover:border-gray-400'
                    }
                  `}
                >
                  {hasWarning && '⚠️ '}
                  {medication.name}
                  {medication.cost > 0 && (
                    <span className="ml-2 text-xs opacity-75">
                      ({medication.cost.toLocaleString()} FCFA)
                    </span>
                  )}
                  {selected && <span className="ml-1">✓</span>}
                </button>

                {/* Tooltip avec détails (apparaît au survol) */}
                <div className="absolute left-0 top-full mt-2 w-80 p-3 bg-white border-2 border-gray-300 rounded-lg shadow-xl z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
                  <div className="text-xs space-y-2">
                    <p className="font-semibold text-gray-900">{medication.name}</p>
                    <p className="text-xs text-gray-500">{medication.category}</p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Indication:</span> {medication.indication}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Posologie:</span> {medication.dosage}
                    </p>
                    {medication.cost > 0 && (
                      <p className="text-green-700 font-semibold">
                        Coût: {medication.cost.toLocaleString()} FCFA
                      </p>
                    )}
                    {hasWarning && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                        <p className="text-xs font-bold text-red-700 mb-1">⚠️ Avertissements</p>
                        {medWarnings.map((warning, idx) => (
                          <div key={idx} className="text-xs mt-1">
                            <p className="font-semibold text-gray-800">
                              {warning.severity === 'high' && '🔴 RISQUE ÉLEVÉ'}
                              {warning.severity === 'medium' && '🟠 RISQUE MODÉRÉ'}
                              {warning.severity === 'low' && '🟡 ATTENTION'}
                            </p>
                            <p className="text-gray-600 mt-1">{warning.reason}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {selectedMedications.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700 font-medium">
            {selectedMedications.length} médicament{selectedMedications.length > 1 ? 's' : ''} sélectionné{selectedMedications.length > 1 ? 's' : ''}
          </p>
          {selectedMedications.some(m => m.cost > 0) && (
            <p className="text-sm text-green-700 font-semibold mt-1">
              Coût total estimé: {selectedMedications.reduce((sum, m) => sum + (m.cost || 0), 0).toLocaleString()} FCFA
            </p>
          )}
        </div>
      )}
    </Section>
  );
};

export default MedicationSuggestion;
