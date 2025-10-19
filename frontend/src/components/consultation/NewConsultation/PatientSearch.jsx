import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { findPatientByCMU } from '../../../data/patients';

const PatientSearch = ({ onPatientFound }) => {
  const [cmuNumber, setCmuNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchPatient = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const patient = findPatientByCMU(cmuNumber);

      if (!patient) {
        setError('Aucun patient trouvé avec ce numéro CMU');
        setLoading(false);
        return;
      }

      onPatientFound(patient);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Rechercher un patient</h2>
      <form onSubmit={searchPatient} className="space-y-4">
        <div>
          <label
            htmlFor="cmuNumber"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Numéro CMU
          </label>
          <div className="relative">
            <input
              id="cmuNumber"
              type="text"
              value={cmuNumber}
              onChange={(e) => setCmuNumber(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              placeholder="Ex: CMU123456"
              required
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Patients disponibles: CMU123456, CMU789012, CMU345678, CMU901234, CMU567890
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Recherche en cours...' : 'Rechercher le patient'}
        </button>
      </form>
    </div>
  );
};

export default PatientSearch;
