import React from 'react';
import { Section, ListItem } from '../../ui';

const MedicationSuggestion = ({
  medications,
  title = "Médicaments recommandés :"
}) => {
  return (
    <Section title={title}>
      {!medications || medications.length === 0 ? (
        <p className="text-gray-500 text-sm">Aucun médicament recommandé</p>
      ) : (
        <div className="space-y-3">
          {medications.map((medication) => (
            <ListItem key={medication.id} className="border-l-4 border-blue-500">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-bold text-sm sm:text-base text-blue-700">
                    {medication.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    <span className="font-medium">Indication:</span> {medication.indication}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-700 mt-1">
                    <span className="font-medium">Posologie:</span> {medication.dosage}
                  </p>
                </div>
                <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full self-start">
                  {medication.category}
                </span>
              </div>
            </ListItem>
          ))}
        </div>
      )}
    </Section>
  );
};

export default MedicationSuggestion;
