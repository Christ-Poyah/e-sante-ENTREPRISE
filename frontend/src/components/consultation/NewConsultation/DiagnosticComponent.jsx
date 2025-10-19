import React from 'react';
import { Badge, Section } from '../../ui';

const DiagnosticComponent = ({
  diagnostics,
  title = "Diagnostic suggéré :"
}) => {
  return (
    <Section title={title}>
      {!diagnostics || diagnostics.length === 0 ? (
        <p className="text-gray-500 text-sm">Aucun diagnostic disponible</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {diagnostics.map((diagnostic) => (
            <Badge key={diagnostic.id}>
              {diagnostic.disease || diagnostic.name}
            </Badge>
          ))}
        </div>
      )}
    </Section>
  );
};

export default DiagnosticComponent;
