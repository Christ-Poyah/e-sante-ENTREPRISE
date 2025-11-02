import React, { useState } from 'react';
import { Section } from '../../ui';
import { Upload, X, FileImage } from 'lucide-react';

const AnalysisSuggestionComponent = ({ suggestions, onAnalysisSelect, title = "Analyses suggérées" }) => {
  const [selectedAnalyses, setSelectedAnalyses] = useState([]);
  const [analysisPhotos, setAnalysisPhotos] = useState({});

  const toggleAnalysis = (suggestion) => {
    const isSelected = selectedAnalyses.some(a => a.id === suggestion.id);

    let newSelection;
    if (isSelected) {
      newSelection = selectedAnalyses.filter(a => a.id !== suggestion.id);
      // Supprimer la photo si l'analyse est désélectionnée
      const newPhotos = { ...analysisPhotos };
      delete newPhotos[suggestion.id];
      setAnalysisPhotos(newPhotos);
    } else {
      newSelection = [...selectedAnalyses, {
        id: suggestion.id,
        name: suggestion.name,
        result: "",
        resultType: "text",
        photo: null
      }];
    }

    setSelectedAnalyses(newSelection);
    if (onAnalysisSelect) {
      // Envoyer les analyses avec leurs photos
      const analysesWithPhotos = newSelection.map(analysis => ({
        ...analysis,
        photo: analysisPhotos[analysis.id] || null
      }));
      onAnalysisSelect(analysesWithPhotos);
    }
  };

  const isSelected = (suggestionId) => {
    return selectedAnalyses.some(a => a.id === suggestionId);
  };

  const handlePhotoUpload = (suggestionId, event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Vérifier que c'est une image
    if (!file.type.startsWith('image/')) {
      alert("Veuillez sélectionner une image valide");
      return;
    }

    // Limiter la taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert("La taille de l'image ne doit pas dépasser 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;

      // Mettre à jour les photos
      const newPhotos = {
        ...analysisPhotos,
        [suggestionId]: base64String
      };
      setAnalysisPhotos(newPhotos);

      // Mettre à jour les analyses sélectionnées avec la photo
      const updatedSelection = selectedAnalyses.map(analysis =>
        analysis.id === suggestionId
          ? { ...analysis, photo: base64String }
          : analysis
      );
      setSelectedAnalyses(updatedSelection);

      if (onAnalysisSelect) {
        onAnalysisSelect(updatedSelection);
      }
    };

    reader.readAsDataURL(file);
  };

  const removePhoto = (suggestionId) => {
    const newPhotos = { ...analysisPhotos };
    delete newPhotos[suggestionId];
    setAnalysisPhotos(newPhotos);

    // Mettre à jour les analyses sélectionnées sans la photo
    const updatedSelection = selectedAnalyses.map(analysis =>
      analysis.id === suggestionId
        ? { ...analysis, photo: null }
        : analysis
    );
    setSelectedAnalyses(updatedSelection);

    if (onAnalysisSelect) {
      onAnalysisSelect(updatedSelection);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-red-500 bg-red-50';
      case 'medium':
        return 'border-orange-500 bg-orange-50';
      case 'low':
        return 'border-yellow-500 bg-yellow-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 font-semibold">PRIORITÉ HAUTE</span>;
      case 'medium':
        return <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800 font-semibold">PRIORITÉ MOYENNE</span>;
      case 'low':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 font-semibold">PRIORITÉ BASSE</span>;
      default:
        return null;
    }
  };

  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟠';
      case 'low':
        return '🟡';
      default:
        return '';
    }
  };

  return (
    <Section title={title}>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => {
          const selected = isSelected(suggestion.id);
          const hasPhoto = analysisPhotos[suggestion.id];

          return (
            <div key={suggestion.id} className="relative group">
              <button
                onClick={() => toggleAnalysis(suggestion)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium
                  border-2 transition-all duration-200
                  cursor-pointer hover:shadow-md
                  ${selected
                    ? 'bg-blue-100 text-blue-700 border-blue-500'
                    : 'bg-gray-100 text-gray-600 border-gray-300 hover:border-gray-400'
                  }
                `}
              >
                {getPriorityIcon(suggestion.priority)} {suggestion.name}
                {selected && <span className="ml-1">✓</span>}
              </button>

              {/* Tooltip avec la raison (apparaît au survol) */}
              <div className="absolute left-0 top-full mt-2 w-96 p-3 bg-white border-2 border-gray-300 rounded-lg shadow-xl z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
                <p className="text-xs text-gray-700">
                  <span className="font-semibold text-gray-900">{suggestion.name}</span><br/>
                  <span className="text-xs text-gray-500">{suggestion.category} • {getPriorityBadge(suggestion.priority)}</span><br/><br/>
                  <span className="font-semibold">Raison:</span> {suggestion.reason}
                </p>
              </div>

            </div>
          );
        })}
      </div>

      {/* Section d'upload de photos pour les analyses sélectionnées */}
      {selectedAnalyses.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-700 mb-3">Photos des analyses (optionnel)</h3>
          <div className="space-y-4">
            {selectedAnalyses.map((analysis) => {
              const hasPhoto = analysisPhotos[analysis.id];
              return (
                <div key={analysis.id} className="bg-white p-3 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700">{analysis.name}</p>
                    {hasPhoto && (
                      <button
                        onClick={() => removePhoto(analysis.id)}
                        className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Supprimer
                      </button>
                    )}
                  </div>

                  {!hasPhoto ? (
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                      <div className="flex flex-col items-center justify-center">
                        <Upload className="w-6 h-6 text-blue-500 mb-1" />
                        <p className="text-xs text-blue-600 font-medium">Ajouter une photo</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(analysis.id, e)}
                      />
                    </label>
                  ) : (
                    <div className="relative">
                      <img
                        src={hasPhoto}
                        alt={`Analyse ${analysis.name}`}
                        className="w-full h-32 object-contain rounded-lg border-2 border-blue-300"
                      />
                      <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        <FileImage className="w-3 h-3" />
                        ✓
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Section>
  );
};

export default AnalysisSuggestionComponent;
