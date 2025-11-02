import React, { useState, useRef } from 'react';
import { Section, Badge, AddButton } from '../../ui';

const AnalysisSelector = ({
  availableAnalyses,
  onAnalysesChange,
  title = "Analyse",
  placeholders = {
    name: "Nom de l'analyse",
    result: "Résultat"
  },
  translations = {
    select: "Sélectionner",
    positive: "Positif",
    negative: "Négatif",
    threshold: "Seuil :"
  }
}) => {
  const [selectedAnalyses, setSelectedAnalyses] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeAnalysisId, setActiveAnalysisId] = useState(null);
  const inputRefs = useRef({});

  const getFilteredSuggestions = (input) => {
    const selectedNames = selectedAnalyses.map(a => a.name);
    return availableAnalyses.filter(analysis =>
      !selectedNames.includes(analysis.name) &&
      analysis.name.toLowerCase().includes(input.toLowerCase())
    );
  };

  const handleAddAnalysis = () => {
    const newAnalysis = { id: Date.now(), name: '', result: '' };
    const updatedAnalyses = [...selectedAnalyses, newAnalysis];
    setSelectedAnalyses(updatedAnalyses);
    setActiveAnalysisId(newAnalysis.id);
    setSuggestions(getFilteredSuggestions(''));
    
    setTimeout(() => {
      if (inputRefs.current[newAnalysis.id]) {
        inputRefs.current[newAnalysis.id].focus();
      }
    }, 0);

    if (onAnalysesChange) {
      onAnalysesChange(updatedAnalyses);
    }
  };

  const handleInputChange = (e, analysisId) => {
    const value = e.target.value;
    setSuggestions(getFilteredSuggestions(value));

    const updatedAnalyses = selectedAnalyses.map(analysis =>
      analysis.id === analysisId ? { ...analysis, name: value } : analysis
    );
    setSelectedAnalyses(updatedAnalyses);
    
    if (onAnalysesChange) {
      onAnalysesChange(updatedAnalyses);
    }
  };

  const handleSelectSuggestion = (suggestion, analysisId) => {
    const updatedAnalyses = selectedAnalyses.map(analysis =>
      analysis.id === analysisId ? { ...analysis, ...suggestion, result: '' } : analysis
    );
    setSelectedAnalyses(updatedAnalyses);
    setSuggestions([]);
    setActiveAnalysisId(null);

    if (onAnalysesChange) {
      onAnalysesChange(updatedAnalyses);
    }
  };

  const handleResultChange = (e, analysisId) => {
    const updatedAnalyses = selectedAnalyses.map(analysis =>
      analysis.id === analysisId ? { ...analysis, result: e.target.value } : analysis
    );
    setSelectedAnalyses(updatedAnalyses);

    if (onAnalysesChange) {
      onAnalysesChange(updatedAnalyses);
    }
  };

  const handleRemoveAnalysis = (analysisId) => {
    const updatedAnalyses = selectedAnalyses.filter(analysis => analysis.id !== analysisId);
    setSelectedAnalyses(updatedAnalyses);

    if (onAnalysesChange) {
      onAnalysesChange(updatedAnalyses);
    }
  };

  const renderResultInput = (analysis) => {
    if (analysis.resultType === 'boolean') {
      return (
        <select
          value={analysis.result}
          onChange={(e) => handleResultChange(e, analysis.id)}
          className="bg-transparent text-blue-500 outline-none w-full"
        >
          <option value="">{translations.select}</option>
          <option value="positif">{translations.positive}</option>
          <option value="négatif">{translations.negative}</option>
        </select>
      );
    } else {
      const isAboveThreshold = analysis.threshold && parseFloat(analysis.result) > analysis.threshold;
      return (
        <input
          type="number"
          value={analysis.result}
          onChange={(e) => handleResultChange(e, analysis.id)}
          placeholder={analysis.threshold ? `${translations.threshold} ${analysis.threshold}` : placeholders.result}
          className={`placeholder-blue-300 ${isAboveThreshold ? 'text-red-500' : 'text-blue-500'} placeholder-opacity-75 bg-transparent outline-none w-full`}
        />
      );
    }
  };

  return (
    <Section title={title}>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {selectedAnalyses.map((analysis) => (
          <div key={analysis.id} className="relative flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Badge variant="primary" onRemove={() => handleRemoveAnalysis(analysis.id)} className="flex items-center overflow-hidden">
              <input
                ref={(el) => inputRefs.current[analysis.id] = el}
                value={analysis.name}
                onChange={(e) => handleInputChange(e, analysis.id)}
                onFocus={() => {
                  setActiveAnalysisId(analysis.id);
                  setSuggestions(getFilteredSuggestions(''));
                }}
                onBlur={() => setTimeout(() => setActiveAnalysisId(null), 100)}
                placeholder={placeholders.name}
                className="bg-transparent placeholder-white placeholder-opacity-75 outline-none w-32 sm:w-40 text-sm"
              />
              <div className="px-2 sm:px-4 py-1 sm:py-2 border-l bg-white border-blue-400 border-2 rounded-r-full w-24 sm:w-32">
                {renderResultInput(analysis)}
              </div>
            </Badge>
            {activeAnalysisId === analysis.id && suggestions.length > 0 && (
              <ul className="absolute z-10 w-32 sm:w-40 mt-12 sm:mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto">
                {suggestions.map(suggestion => (
                  <li
                    key={suggestion.id}
                    onMouseDown={() => handleSelectSuggestion(suggestion, analysis.id)}
                    className="px-2 py-1 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    {suggestion.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        <AddButton onClick={handleAddAnalysis} ariaLabel="Add analysis" />
      </div>
    </Section>
  );
};

export default AnalysisSelector;