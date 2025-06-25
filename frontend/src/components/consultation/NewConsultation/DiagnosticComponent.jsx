import React, { useState, useMemo, useCallback } from 'react';
import debounce from 'lodash.debounce';

// Composant de la barre de progression
const ProgressBar = ({ probability }) => {
  const getColor = () => {
    if (probability > 70) return '#EF4444'; // Rouge si > 70%
    if (probability > 40) return '#F59E0B'; // Orange si > 40%
    return '#10B981'; // Vert sinon
  };

  const textColor = probability > 70
    ? 'text-red-500'
    : probability > 40
      ? 'text-yellow-500'
      : 'text-green-500';

  return (
    <div className="flex items-center">
      <div className="w-32 h-2 bg-gray-200 rounded-full mr-3">
        <div
          className="h-full rounded-full"
          style={{
            width: `${probability}%`,
            backgroundColor: getColor()
          }}
        />
      </div>
      <span className={`font-bold ${textColor}`}>
        {probability.toFixed(1)}%
      </span>
    </div>
  );
};

// Composant principal affichant les diagnostics
const DiagnosticComponent = ({
  diagnostics,
  title = "Diagnostic suggéré :",
  placeholder = "Rechercher un diagnostic..."
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);

  // Utilisation de useCallback et debounce pour limiter la fréquence de mise à jour du champ de recherche
  const debouncedSetSearchTerm = useCallback(
    debounce((value) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  const handleSearchChange = (e) => {
    debouncedSetSearchTerm(e.target.value);
  };

  // Utiliser useMemo pour filtrer et trier les diagnostics.
  // On utilise diagnostic.disease si elle est définie, sinon diagnostic.name.
  const filteredDiagnostics = useMemo(() => {
    if (!diagnostics) return [];
    return diagnostics
      .filter(diagnostic => {
        const diagnosticLabel = (diagnostic.disease || diagnostic.name || "").toLowerCase();
        return diagnosticLabel.includes(searchTerm.toLowerCase());
      })
      .sort((a, b) => b.probability - a.probability);
  }, [diagnostics, searchTerm]);

  // Limiter l'affichage selon l'état de showAll
  const displayedDiagnostics = useMemo(() => {
    return showAll ? filteredDiagnostics : filteredDiagnostics.slice(0, 5);
  }, [filteredDiagnostics, showAll]);

  // Condition de rendu si diagnostics est undefined ou vide
  if (!diagnostics || diagnostics.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <p className="text-gray-500 text-center">Aucun diagnostic disponible</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>

      {/* Champ de recherche */}
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder={placeholder}
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
      />

      {/* Liste des diagnostics */}
      <ul className="space-y-3 mb-4">
        {displayedDiagnostics.map((diagnostic) => (
          <li
            key={diagnostic.id}
            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <span className="font-medium">
              {diagnostic.disease || diagnostic.name}
            </span>
            <ProgressBar probability={diagnostic.probability} />
          </li>
        ))}
      </ul>

      {/* Bouton Voir plus/moins */}
      {filteredDiagnostics.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-2 text-center text-blue-500 hover:text-blue-700 transition-colors duration-200"
        >
          {showAll ? 'Voir moins' : 'Voir plus'}
        </button>
      )}
    </div>
  );
};

export default DiagnosticComponent;
