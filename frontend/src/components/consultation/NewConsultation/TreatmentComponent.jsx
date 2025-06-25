import React, { useState, useMemo, useCallback } from 'react';
import debounce from 'lodash.debounce';

const TreatmentComponent = ({
  treatments,
  title = "Traitement proposé :",
  placeholder = "Rechercher un traitement..."
}) => {
  // Assurez-vous que treatments est toujours un tableau (même vide)
  const safeTreatments = treatments || [];

  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);

  // Appel des Hooks inconditionnellement
  const debouncedSetSearchTerm = useCallback(
    debounce((value) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  const handleSearchChange = (e) => {
    debouncedSetSearchTerm(e.target.value);
  };

  const filteredTreatments = useMemo(() => {
    return safeTreatments.filter(item => {
      const treatmentText = item.treatment ? item.treatment.toLowerCase() : "";
      const diagnosticText = item.diagnostic ? item.diagnostic.toLowerCase() : "";
      const term = searchTerm.toLowerCase();
      return treatmentText.includes(term) || diagnosticText.includes(term);
    });
  }, [safeTreatments, searchTerm]);

  const displayedTreatments = useMemo(() => {
    return showAll ? filteredTreatments : filteredTreatments.slice(0, 5);
  }, [filteredTreatments, showAll]);

  // Maintenant, on peut effectuer un retour conditionnel
  if (safeTreatments.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <p className="text-gray-500 text-center">Aucun traitement disponible</p>
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

      {/* Liste des traitements */}
      <ul className="space-y-3 mb-4">
        {displayedTreatments.map((item, index) => (
          <li
            key={index}
            className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <h3 className="font-medium">{item.diagnostic}</h3>
            <p className="text-gray-700">{item.treatment}</p>
            <p className="text-gray-500">{item.posology}</p>
          </li>
        ))}
      </ul>

      {/* Bouton Voir plus/moins */}
      {filteredTreatments.length > 5 && (
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

export default TreatmentComponent;
