import React, { useState, useRef, useEffect } from 'react';
import { Section, Badge, AddButton } from '../../ui';

const AntecedentSelector = ({
  initialAntecedents,
  onAntecedentsChange,
  placeholder = "Saisissez un antécédent",
  title = "Antécédents médicaux",
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
    <Section title={title}>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {selectedAntecedents.map((antecedent) => (
          <div key={antecedent.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="relative group">
              <Badge variant="primary" onRemove={() => handleRemoveAntecedent(antecedent.id)}>
                <input
                  value={antecedent.name}
                  onChange={(e) => handleInputChange(e, antecedent.id)}
                  onFocus={() => handleInputFocus(antecedent.id)}
                  onBlur={() => handleInputBlur(antecedent.id)}
                  placeholder={placeholder}
                  className="bg-transparent outline-none text-center placeholder-white placeholder-opacity-75 w-full min-w-[100px]"
                  readOnly={antecedent.antecedentId !== null}
                />
              </Badge>
              {activeAntecedentId === antecedent.id && suggestions.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto">
                  {suggestions.map(suggestion => (
                    <li
                      key={suggestion.id}
                      onMouseDown={() => handleSelectSuggestion(suggestion, antecedent.id)}
                      className="px-2 py-1 text-sm hover:bg-gray-100 cursor-pointer"
                    >
                      {suggestion.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {antecedent.antecedentId !== null && antecedent.details.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {antecedent.details.map(detail => (
                  <Badge key={detail.id} variant="outline">
                    <select
                      onChange={(e) => handleDetailChange(antecedent.id, detail.id, e.target.value)}
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
        <AddButton onClick={handleAddAntecedent} ariaLabel="Add antecedent" />
      </div>
    </Section>
  );
};

export default AntecedentSelector;