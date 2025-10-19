import React from 'react';

const PrescriptionModal = ({ prescription, onClose }) => {
  if (!prescription) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Ordonnance Médicale</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Imprimer
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8 print:p-8" id="prescription-content">
          {/* En-tête */}
          <div className="mb-8 pb-4 border-b-2 border-gray-300">
            <h1 className="text-3xl font-bold text-center text-blue-700 mb-2">
              ORDONNANCE MÉDICALE
            </h1>
            <p className="text-center text-gray-600">
              Date: {new Date(prescription.consultationDate).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          {/* Informations patient */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3 border-l-4 border-blue-500 pl-3">
              Informations du Patient
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-semibold">Nom:</span> {prescription.patient.lastName}
              </div>
              <div>
                <span className="font-semibold">Prénom:</span> {prescription.patient.firstName}
              </div>
              <div>
                <span className="font-semibold">Âge:</span> {prescription.patient.age} ans
              </div>
              <div>
                <span className="font-semibold">N° CMU:</span> {prescription.patient.cmuNumber}
              </div>
            </div>
          </div>

          {/* Diagnostic */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3 border-l-4 border-blue-500 pl-3">
              Diagnostic
            </h3>
            <p className="text-sm bg-blue-50 p-3 rounded-lg">{prescription.diagnostic}</p>
          </div>

          {/* Traitement principal */}
          {prescription.treatment && prescription.treatment !== "Traitement non défini" && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3 border-l-4 border-blue-500 pl-3">
                Traitement Principal
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-sm mb-1">{prescription.treatment}</p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Posologie:</span> {prescription.posology}
                </p>
              </div>
            </div>
          )}

          {/* Médicaments prescrits */}
          {prescription.medications && prescription.medications.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3 border-l-4 border-blue-500 pl-3">
                Médicaments Prescrits
              </h3>
              <div className="space-y-3">
                {prescription.medications.map((medication, index) => (
                  <div key={medication.id} className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-400">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-sm text-blue-700">
                        {index + 1}. {medication.name}
                      </h4>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {medication.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Indication:</span> {medication.indication}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Posologie:</span> {medication.dosage}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3 border-l-4 border-blue-500 pl-3">
              Instructions
            </h3>
            <p className="text-sm bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              {prescription.instructions}
            </p>
          </div>

          {/* Signature */}
          <div className="mt-8 pt-6 border-t border-gray-300">
            <div className="text-right">
              <p className="text-sm font-semibold mb-8">Le Médecin</p>
              <div className="border-t-2 border-gray-400 w-48 ml-auto"></div>
              <p className="text-xs text-gray-500 mt-2">Signature et cachet</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #prescription-content, #prescription-content * {
            visibility: visible;
          }
          #prescription-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .fixed {
            position: relative;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PrescriptionModal;
