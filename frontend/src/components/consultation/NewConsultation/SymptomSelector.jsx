import React, { useState, useRef, useEffect } from 'react';

const SymptomSelector = ({ 
  initialSymptoms,
  onSymptomsChange,
  placeholder = "Saisissez un symptôme",
  title = "Symptômes :",
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
    <div className="p-4">
      <div className="flex items-start">
        <div className="w-1/6 pr-4">
          <h2 className="text-xl font-bold mt-2">{title}</h2>
        </div>
        
        <div className="w-5/6">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {selectedSymptoms.map((symptom) => (
              <div key={symptom.id} className="flex items-center gap-2">
                {/* Champ du symptôme */}
                <div className="relative group">
                  <div className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center">
                    <input
                      value={symptom.name}
                      onChange={(e) => handleInputChange(e, symptom.id)}
                      onFocus={() => handleInputFocus(symptom.id)}
                      onBlur={() => handleInputBlur(symptom.id)}
                      placeholder={placeholder}
                      className="bg-transparent outline-none text-center placeholder-white placeholder-opacity-75 w-full"
                      readOnly={symptom.symptomId !== null}
                    />
                    <button 
                      onClick={() => handleRemoveSymptom(symptom.id)}
                      className="hidden group-hover:block ml-2 text-white hover:text-red-300 transition-colors duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  {activeSymptomId === symptom.id && suggestions.length > 0 && (
                    <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
                      {suggestions.map(suggestion => (
                        <li 
                          key={suggestion.id} 
                          onMouseDown={() => handleSelectSuggestion(suggestion, symptom.id)}
                          className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                        >
                          {suggestion.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Détails supplémentaires */}
                {symptom.symptomId !== null && symptom.details.length > 0 && (
                  <div className="flex items-center gap-2">
                    {symptom.details.map(detail => (
                      <div key={detail.id} className="border border-blue-500 bg-white rounded-full px-4 py-2">
                        <select
                          onChange={(e) => handleDetailChange(symptom.id, detail.id, e.target.value)}
                          className="bg-transparent outline-none text-blue-500"
                        >
                          <option value="">{detail.name}</option>
                          {detail.options.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <button 
              onClick={handleAddSymptom}
              className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomSelector;