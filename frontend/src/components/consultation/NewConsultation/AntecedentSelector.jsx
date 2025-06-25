import React, { useState, useRef, useEffect } from 'react';

const AntecedentSelector = ({ 
  initialAntecedents,
  onAntecedentsChange,
  placeholder = "Saisissez un antécédent",
  title = "Antécédents médicaux :",
}) => {
  const [selectedAntecedents, setSelectedAntecedents] = useState([]);
  const [availableAntecedents, setAvailableAntecedents] = useState(initialAntecedents);
  const [activeAntecedentId, setActiveAntecedentId] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    updateAvailableAntecedents();
  }, [selectedAntecedents, initialAntecedents]);

  useEffect(() => {
    if (onAntecedentsChange) {
      onAntecedentsChange(selectedAntecedents);
    }
  }, [selectedAntecedents, onAntecedentsChange]);

  const updateAvailableAntecedents = () => {
    const selectedIds = selectedAntecedents.map(a => a.antecedentId).filter(id => id !== null);
    setAvailableAntecedents(initialAntecedents.filter(a => !selectedIds.includes(a.id)));
  };

  const handleAddAntecedent = () => {
    const newAntecedent = { id: Date.now(), name: '', antecedentId: null, details: [] };
    setSelectedAntecedents([...selectedAntecedents, newAntecedent]);
    setActiveAntecedentId(newAntecedent.id);
  };

  const handleInputChange = (e, antecedentId) => {
    const value = e.target.value;
    
    const filtered = availableAntecedents.filter(antecedent => 
      antecedent.name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered);

    setSelectedAntecedents(selectedAntecedents.map(antecedent => 
      antecedent.id === antecedentId ? { ...antecedent, name: value, antecedentId: null } : antecedent
    ));
  };

  const handleSelectSuggestion = (suggestion, antecedentId) => {
    setSelectedAntecedents(selectedAntecedents.map(antecedent => 
      antecedent.id === antecedentId ? { ...antecedent, name: suggestion.name, antecedentId: suggestion.id, details: suggestion.details } : antecedent
    ));
    setSuggestions([]);
    setActiveAntecedentId(null);
  };

  const handleInputFocus = (antecedentId) => {
    setActiveAntecedentId(antecedentId);
    const antecedent = selectedAntecedents.find(a => a.id === antecedentId);
    const filtered = availableAntecedents.filter(a => 
      a.name.toLowerCase().includes(antecedent.name.toLowerCase())
    );
    setSuggestions(filtered);
  };

  const handleInputBlur = (antecedentId) => {
    setTimeout(() => {
      const antecedent = selectedAntecedents.find(a => a.id === antecedentId);
      if (antecedent && !antecedent.antecedentId) {
        setSelectedAntecedents(selectedAntecedents.filter(a => a.id !== antecedentId));
      }
      setActiveAntecedentId(null);
      setSuggestions([]);
    }, 100);
  };

  const handleRemoveAntecedent = (antecedentId) => {
    setSelectedAntecedents(selectedAntecedents.filter(antecedent => antecedent.id !== antecedentId));
  };

  const handleDetailChange = (antecedentId, detailId, value) => {
    setSelectedAntecedents(selectedAntecedents.map(antecedent => 
      antecedent.id === antecedentId ? { 
        ...antecedent, 
        details: antecedent.details.map(detail => 
          detail.id === detailId ? { ...detail, selected: value } : detail
        )
      } : antecedent
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
            {selectedAntecedents.map((antecedent) => (
              <div key={antecedent.id} className="flex items-center gap-2">
                {/* Champ de l'antécédent */}
                <div className="relative group">
                  <div className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center">
                    <input
                      value={antecedent.name}
                      onChange={(e) => handleInputChange(e, antecedent.id)}
                      onFocus={() => handleInputFocus(antecedent.id)}
                      onBlur={() => handleInputBlur(antecedent.id)}
                      placeholder={placeholder}
                      className="bg-transparent outline-none text-center placeholder-white placeholder-opacity-75 w-full"
                      readOnly={antecedent.antecedentId !== null}
                    />
                    <button 
                      onClick={() => handleRemoveAntecedent(antecedent.id)}
                      className="hidden group-hover:block ml-2 text-white hover:text-red-300 transition-colors duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  {activeAntecedentId === antecedent.id && suggestions.length > 0 && (
                    <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
                      {suggestions.map(suggestion => (
                        <li 
                          key={suggestion.id} 
                          onMouseDown={() => handleSelectSuggestion(suggestion, antecedent.id)}
                          className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                        >
                          {suggestion.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Détails supplémentaires */}
                {antecedent.antecedentId !== null && antecedent.details.length > 0 && (
                  <div className="flex items-center gap-2">
                    {antecedent.details.map(detail => (
                      <div key={detail.id} className="border border-blue-500 bg-white rounded-full px-4 py-2">
                        <select
                          onChange={(e) => handleDetailChange(antecedent.id, detail.id, e.target.value)}
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
              onClick={handleAddAntecedent}
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

export default AntecedentSelector;