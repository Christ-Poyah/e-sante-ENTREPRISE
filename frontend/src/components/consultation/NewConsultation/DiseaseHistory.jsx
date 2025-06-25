import React, { useState, useMemo } from 'react';

const DiseaseHistory = ({ 
  recentDiseases,
  title = "Historique récent :",
  placeholder = "Rechercher dans l'historique..."
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);

  const formatDaysAgo = (days) => {
    if (days === 0) return "Aujourd'hui";
    if (days === 1) return "Hier";
    if (days < 7) return `Il y a ${days} jours`;
    if (days < 30) {
      const weeks = Math.floor(days / 7);
      return `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
    }
    if (days < 365) {
      const months = Math.floor(days / 30);
      return `Il y a ${months} mois`;
    }
    const years = Math.floor(days / 365);
    return `Il y a ${years} an${years > 1 ? 's' : ''}`;
  };

  const filteredDiseases = useMemo(() => {
    return recentDiseases.filter(disease =>
      disease.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [recentDiseases, searchTerm]);

  const displayedDiseases = useMemo(() => {
    return showAll ? filteredDiseases : filteredDiseases.slice(0, 5);
  }, [filteredDiseases, showAll]);

  if (!recentDiseases || recentDiseases.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <p className="text-gray-500 text-center">Aucun historique disponible</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
      />

      <ul className="space-y-3 mb-4">
        {displayedDiseases.map((disease, index) => (
          <li
            key={index}
            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <span className="font-medium">{disease.name}</span>
            <span className="text-gray-500">{formatDaysAgo(disease.date)}</span>
          </li>
        ))}
      </ul>

      {filteredDiseases.length > 5 && (
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

export default DiseaseHistory;