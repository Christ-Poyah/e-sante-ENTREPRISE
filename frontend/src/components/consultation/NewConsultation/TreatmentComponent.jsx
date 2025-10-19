import React, { useState, useMemo, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { Card, SectionTitle, SearchInput, ListItem, TextButton } from '../../ui';

const TreatmentComponent = ({
  treatments,
  title = "Traitement proposé :",
  placeholder = "Rechercher un traitement..."
}) => {
  const safeTreatments = treatments || [];

  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);

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

  if (safeTreatments.length === 0) {
    return (
      <Card padding="sm">
        <SectionTitle size="md" className="mb-4">{title}</SectionTitle>
        <p className="text-gray-500 text-center text-sm">Aucun traitement disponible</p>
      </Card>
    );
  }

  return (
    <Card padding="sm">
      <SectionTitle size="md" className="mb-4">{title}</SectionTitle>

      <SearchInput
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder={placeholder}
        className="mb-4"
      />

      <ul className="space-y-3 mb-4">
        {displayedTreatments.map((item, index) => (
          <ListItem key={index}>
            <h3 className="font-medium text-sm sm:text-base">{item.diagnostic}</h3>
            <p className="text-gray-700 text-xs sm:text-sm">{item.treatment}</p>
            <p className="text-gray-500 text-xs sm:text-sm">{item.posology}</p>
          </ListItem>
        ))}
      </ul>

      {filteredTreatments.length > 5 && (
        <TextButton onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Voir moins' : 'Voir plus'}
        </TextButton>
      )}
    </Card>
  );
};

export default TreatmentComponent;
