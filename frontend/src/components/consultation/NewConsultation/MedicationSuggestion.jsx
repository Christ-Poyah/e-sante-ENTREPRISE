import React, { useState, useEffect } from 'react';
import { Section } from '../../ui';
import { AlertCircle } from 'lucide-react';

const MedicationSuggestion = ({
  medications,
  title = "Médicaments recommandés :",
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
        <div className="space-y-3">
          {medications.map((medication) => {
            const selected = isSelected(medication.id);
            const medWarnings = getMedicationWarnings(medication.id);
            const hasWarning = medWarnings.length > 0;
            const borderColor = getBorderColor(medication.id, selected);

            return (
              <div
                key={medication.id}
                onClick={() => toggleMedication(medication)}
                className={`
                  p-4 rounded-lg border-l-4 transition-all duration-200
                  cursor-pointer hover:shadow-md
                  ${selected ? 'bg-blue-50' : 'bg-gray-50'}
                  ${borderColor}
                `}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-bold text-sm sm:text-base ${selected ? 'text-blue-700' : 'text-gray-700'}`}>
                        {medication.name}
                      </h3>
                      {hasWarning && (
                        <div className="group relative">
                          <button
                            type="button"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 rounded-full bg-red-100 hover:bg-red-200 transition-colors"
                          >
                            <AlertCircle className="w-4 h-4 text-red-600" />
                          </button>
                          <div className="absolute left-0 top-full mt-2 w-80 p-3 bg-white border-2 border-red-300 rounded-lg shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                            <p className="text-xs font-bold text-red-700 mb-2">⚠️ Avertissements</p>
                            <div className="space-y-2">
                              {medWarnings.map((warning, idx) => (
                                <div key={idx} className="text-xs">
                                  <p className="font-semibold text-gray-800">
                                    {warning.severity === 'high' && '🔴 RISQUE ÉLEVÉ'}
                                    {warning.severity === 'medium' && '🟠 RISQUE MODÉRÉ'}
                                    {warning.severity === 'low' && '🟡 ATTENTION'}
                                  </p>
                                  <p className="text-gray-700 mt-1"><strong>Médicaments:</strong> {warning.medication_names.join(', ')}</p>
                                  <p className="text-gray-600 mt-1">{warning.reason}</p>
                                  {warning.recommendation && (
                                    <p className="text-blue-600 mt-1"><strong>Recommandation:</strong> {warning.recommendation}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      <span className="font-medium">Indication:</span> {medication.indication}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-700 mt-1">
                      <span className="font-medium">Posologie:</span> {medication.dosage}
                    </p>
                    {medication.cost > 0 && (
                      <p className="text-xs sm:text-sm text-green-700 font-semibold mt-2">
                        Coût estimé: {medication.cost.toLocaleString()} FCFA
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      selected ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {medication.category}
                    </span>
                    {selected && (
                      <span className="text-xs text-blue-600 font-medium">✓ Sélectionné</span>
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
