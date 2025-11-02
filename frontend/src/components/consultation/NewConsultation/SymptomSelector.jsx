import React, { useState, useRef, useEffect } from 'react';
import { Section, Badge, AddButton } from '../../ui';

const SymptomSelector = ({
  initialSymptoms,
  onSymptomsChange,
  placeholder = "Saisissez un symptôme",
  title = "Symptômes",
}) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [availableSymptoms, setAvailableSymptoms] = useState(initialSymptoms);
  const [activeSymptomId, setActiveSymptomId] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    updateAvailableSymptoms();
  }, [selectedSymptoms, initialSymptoms]);

  useEffect(() => {
    if (onSymptomsChange) {
      onSymptomsChange(selectedSymptoms);
    }
  }, [selectedSymptoms, onSymptomsChange]);

  const updateAvailableSymptoms = () => {
    const selectedIds = selectedSymptoms.map(s => s.symptomId).filter(id => id !== null);
    setAvailableSymptoms(initialSymptoms.filter(s => !selectedIds.includes(s.id)));
  };

  const handleAddSymptom = () => {
    const newSymptom = { id: Date.now(), name: '', symptomId: null, details: [] };
    setSelectedSymptoms([...selectedSymptoms, newSymptom]);
    setActiveSymptomId(newSymptom.id);
  };

  const handleInputChange = (e, symptomId) => {
    const value = e.target.value;
    
    const filtered = availableSymptoms.filter(symptom => 
      symptom.name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered);

    setSelectedSymptoms(selectedSymptoms.map(symptom => 
      symptom.id === symptomId ? { ...symptom, name: value, symptomId: null } : symptom
    ));
  };

  const handleSelectSuggestion = (suggestion, symptomId) => {
    setSelectedSymptoms(selectedSymptoms.map(symptom => 
      symptom.id === symptomId ? { ...symptom, name: suggestion.name, symptomId: suggestion.id, details: suggestion.details } : symptom
    ));
    setSuggestions([]);
    setActiveSymptomId(null);
  };

  const handleInputFocus = (symptomId) => {
    setActiveSymptomId(symptomId);
    const symptom = selectedSymptoms.find(s => s.id === symptomId);
    const filtered = availableSymptoms.filter(s => 
      s.name.toLowerCase().includes(symptom.name.toLowerCase())
    );
    setSuggestions(filtered);
  };

  const handleInputBlur = (symptomId) => {
    setTimeout(() => {
      const symptom = selectedSymptoms.find(s => s.id === symptomId);
      if (symptom && !symptom.symptomId) {
        setSelectedSymptoms(selectedSymptoms.filter(s => s.id !== symptomId));
      }
      setActiveSymptomId(null);
      setSuggestions([]);
    }, 100);
  };

  const handleRemoveSymptom = (symptomId) => {
    setSelectedSymptoms(selectedSymptoms.filter(symptom => symptom.id !== symptomId));
  };

  const handleDetailChange = (symptomId, detailId, value) => {
    setSelectedSymptoms(selectedSymptoms.map(symptom => 
      symptom.id === symptomId ? { 
        ...symptom, 
        details: symptom.details.map(detail => 
          detail.id === detailId ? { ...detail, selected: value } : detail
        )
      } : symptom
    ));
  };

  return (
    <Section title={title}>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {selectedSymptoms.map((symptom) => (
          <div key={symptom.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="relative group">
              <Badge variant="primary" onRemove={() => handleRemoveSymptom(symptom.id)}>
                <input
                  value={symptom.name}
                  onChange={(e) => handleInputChange(e, symptom.id)}
                  onFocus={() => handleInputFocus(symptom.id)}
                  onBlur={() => handleInputBlur(symptom.id)}
                  placeholder={placeholder}
                  className="bg-transparent outline-none text-center placeholder-white placeholder-opacity-75 w-full min-w-[100px]"
                  readOnly={symptom.symptomId !== null}
                />
              </Badge>
              {activeSymptomId === symptom.id && suggestions.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto">
                  {suggestions.map(suggestion => (
                    <li
                      key={suggestion.id}
                      onMouseDown={() => handleSelectSuggestion(suggestion, symptom.id)}
                      className="px-2 py-1 text-sm hover:bg-gray-100 cursor-pointer"
                    >
                      {suggestion.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {symptom.symptomId !== null && symptom.details.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {symptom.details.map(detail => (
                  <Badge key={detail.id} variant="outline">
                    <select
                      onChange={(e) => handleDetailChange(symptom.id, detail.id, e.target.value)}
                      className="bg-transparent outline-none text-blue-500 text-sm"
                    >
                      <option value="">{detail.name}</option>
                      {detail.options.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ))}
        <AddButton onClick={handleAddSymptom} ariaLabel="Add symptom" />
      </div>
    </Section>
  );
};

export default SymptomSelector;