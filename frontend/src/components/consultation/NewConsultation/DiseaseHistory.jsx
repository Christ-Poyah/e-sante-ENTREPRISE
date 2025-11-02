import React, { useState, useMemo } from 'react';
import { Card, SectionTitle, SearchInput, ListItem, TextButton } from '../../ui';

const DiseaseHistory = ({
  recentDiseases,
  title = "Historique récent",
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
      <Card padding="sm">
        <SectionTitle size="md" className="mb-4">{title}</SectionTitle>
        <p className="text-gray-500 text-center text-sm">Aucun historique disponible</p>
      </Card>
    );
  }

  return (
    <Card padding="sm">
      <SectionTitle size="md" className="mb-4">{title}</SectionTitle>

      <SearchInput
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="mb-4"
      />

      <ul className="space-y-3 mb-4">
        {displayedDiseases.map((disease, index) => (
          <ListItem key={index} className="flex justify-between items-center">
            <span className="font-medium text-sm sm:text-base">{disease.name}</span>
            <span className="text-gray-500 text-xs sm:text-sm">{formatDaysAgo(disease.date)}</span>
          </ListItem>
        ))}
      </ul>

      {filteredDiseases.length > 5 && (
        <TextButton onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Voir moins' : 'Voir plus'}
        </TextButton>
      )}
    </Card>
  );
};

export default DiseaseHistory;