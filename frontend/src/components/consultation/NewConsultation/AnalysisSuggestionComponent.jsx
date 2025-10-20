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

  return (
    <Section title={title}>
      <p className="text-sm text-gray-600 mb-4">
        Cliquez sur une analyse pour la sélectionner et ajouter éventuellement une photo du résultat
      </p>
      <div className="space-y-3">
        {suggestions.map((suggestion) => {
          const selected = isSelected(suggestion.id);
          const hasPhoto = analysisPhotos[suggestion.id];

          return (
            <div
              key={suggestion.id}
              className={`
                p-4 rounded-lg border-l-4 transition-all duration-200
                cursor-pointer
                ${selected ? 'bg-blue-50 border-blue-500' : getPriorityColor(suggestion.priority)}
              `}
            >
              <div onClick={() => toggleAnalysis(suggestion)}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className={`font-bold text-sm sm:text-base ${selected ? 'text-blue-700' : 'text-gray-700'}`}>
                      {suggestion.name}
                    </h3>
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 mt-1">
                      {suggestion.category}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getPriorityBadge(suggestion.priority)}
                    {selected && (
                      <span className="text-xs text-blue-600 font-medium">✓ Sélectionnée</span>
                    )}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mt-2">
                  <span className="font-medium">Raison:</span> {suggestion.reason}
                </p>
              </div>

              {selected && (
                <div className="mt-4 pt-4 border-t border-blue-200" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-blue-700">Photo de l'analyse (optionnel)</p>
                    {hasPhoto && (
                      <button
                        onClick={() => removePhoto(suggestion.id)}
                        className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Supprimer
                      </button>
                    )}
                  </div>

                  {!hasPhoto ? (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 text-blue-500 mb-2" />
                        <p className="text-sm text-blue-600 font-medium">Cliquez pour uploader une photo</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG (max 5MB)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(suggestion.id, e)}
                      />
                    </label>
                  ) : (
                    <div className="relative">
                      <img
                        src={hasPhoto}
                        alt={`Analyse ${suggestion.name}`}
                        className="w-full h-48 object-contain rounded-lg border-2 border-blue-300"
                      />
                      <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        <FileImage className="w-3 h-3" />
                        Photo ajoutée
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedAnalyses.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700 font-medium">
            {selectedAnalyses.length} analyse{selectedAnalyses.length > 1 ? 's' : ''} sélectionnée{selectedAnalyses.length > 1 ? 's' : ''}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            {Object.keys(analysisPhotos).length} photo{Object.keys(analysisPhotos).length > 1 ? 's' : ''} ajoutée{Object.keys(analysisPhotos).length > 1 ? 's' : ''}
          </p>
        </div>
      )}
    </Section>
  );
};

export default AnalysisSuggestionComponent;
