import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import AnalysisSelector from "../../components/consultation/NewConsultation/AnalyseSelector";
import DiagnosticComponent from "../../components/consultation/NewConsultation/DiagnosticComponent";
import DiseaseRiskDisplay from "../../components/consultation/NewConsultation/DiseaseRiskDisplay";
import SymptomSelector from "../../components/consultation/NewConsultation/SymptomSelector";
import AntecedentSelector from '../../components/consultation/NewConsultation/AntecedentSelector';
import DiseaseHistory from '../../components/consultation/NewConsultation/DiseaseHistory';
import TreatmentComponent from "../../components/consultation/NewConsultation/TreatmentComponent";
import ConsultationHeader from '../../components/consultation/NewConsultation/ConsultationHeader';




// Composant de recherche patient
const PatientSearch = ({ onPatientFound }) => {
  const [cmuNumber, setCmuNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchPatient = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const q = query(
        collection(db, 'patients'),
        where('cmuNumber', '==', cmuNumber)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setError('Aucun patient trouvé avec ce numéro CMU');
        return;
      }

      const patientData = querySnapshot.docs[0].data();
      onPatientFound({
        id: querySnapshot.docs[0].id,
        ...patientData
      });
    } catch (err) {
      setError('Erreur lors de la recherche du patient');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Rechercher un patient</h2>
      <form onSubmit={searchPatient} className="space-y-4">
        <div>
          <label htmlFor="cmuNumber" className="block text-sm font-medium text-gray-700">
            Numéro CMU
          </label>
          <input
            id="cmuNumber"
            type="text"
            value={cmuNumber}
            onChange={(e) => setCmuNumber(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Entrez le numéro CMU"
            required
          />
        </div>
        
        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full md:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Recherche...' : 'Rechercher'}
        </button>
      </form>
    </div>
  );
};



// Composant d'affichage des informations patient
const PatientInfo = ({ patient }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Informations patient</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-500">Nom</label>
          <p className="text-lg">{patient.lastName}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500">Prénom</label>
          <p className="text-lg">{patient.firstName}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500">Âge</label>
          <p className="text-lg">{patient.age} ans</p>
        </div>
      </div>
    </div>
  );
};



export default function NewConsultation() {
  const [isAIEnabled, setIsAIEnabled] = useState(true);
  const [patient, setPatient] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedAnalyses, setSelectedAnalyses] = useState([]);
  const [diagnostics, setDiagnostics] = useState([]);
  const [diseaseRisks, setDiseaseRisks] = useState([]);
  const [treatment, setTreatment] = useState(null);

  // Données statiques (gardez toutes les données existantes)
  const symptoms = [
    {
      id: 1,
      name: "fièvre",
      details: [
        { id: 1, name: "type", options: ["cyclique", "forte", "intermittente"] }
      ]
    },
    {
      id: 2,
      name: "maux de tête",
      details: [
        { id: 1, name: "intensité", options: ["légère", "modérée", "forte"] }
      ]
    },
    {
      id: 3,
      name: "frissons",
      details: [
        { id: 1, name: "intensité", options: ["légers", "modérés", "intenses"] }
      ]
    },
    {
      id: 4,
      name: "sueurs",
      details: [
        { id: 1, name: "moment", options: ["nocturnes", "toute la journée"] }
      ]
    },
    {
      id: 5,
      name: "fatigue",
      details: [
        { id: 1, name: "intensité", options: ["légère", "modérée", "intense"] }
      ]
    },
    {
      id: 6,
      name: "nausées",
      details: [
        { id: 1, name: "fréquence", options: ["occasionnelles", "fréquentes", "persistantes"] }
      ]
    },
    {
      id: 7,
      name: "vomissements",
      details: [
        { id: 1, name: "fréquence", options: ["occasionnels", "fréquents"] }
      ]
    },
    {
      id: 8,
      name: "douleurs musculaires",
      details: [
        { id: 1, name: "localisation", options: ["localisées", "généralisées"] }
      ]
    },
    {
      id: 9,
      name: "douleurs articulaires",
      details: [
        { id: 1, name: "localisation", options: ["localisées", "généralisées"] }
      ]
    },
    {
      id: 10,
      name: "anémie clinique",
      details: [
        { id: 1, name: "signes", options: ["pâleur", "fatigue extrême", "essoufflement"] }
      ]
    }
  ];
  const antecedents = [
    {
      id: 1,
      name: "antécédents de malaria",
      details: [
        { id: 1, name: "fréquence", options: ["première fois", "récidive", "multiple"] },
        { id: 2, name: "dernier épisode", options: ["< 6 mois", "6-12 mois", "> 12 mois"] }
      ]
    },
    {
      id: 2,
      name: "zone de résidence",
      details: [
        { id: 1, name: "type de zone", options: ["zone urbaine", "zone rurale", "zone forestière"] },
        { id: 2, name: "proximité point d'eau", options: ["< 1km", "> 1km"] }
      ]
    },
    {
      id: 3,
      name: "utilisation de moustiquaire",
      details: [
        { id: 1, name: "fréquence", options: ["jamais", "parfois", "toujours"] },
        { id: 2, name: "état", options: ["bon état", "troué", "très abîmé"] }
      ]
    },
    {
      id: 4,
      name: "immunodépression",
      details: [
        { id: 1, name: "cause", options: ["VIH", "traitement immunosuppresseur", "autre"] }
      ]
    },
    {
      id: 5,
      name: "grossesse",
      details: [
        { id: 1, name: "trimestre", options: ["premier", "deuxième", "troisième"] }
      ]
    }
  ];
  const analyses = [
    {
      id: 1,
      name: "test de diagnostic rapide du paludisme",
      resultType: "boolean"
    },
    {
      id: 2,
      name: "frottis sanguin",
      resultType: "boolean"
    },
    {
      id: 3,
      name: "goutte épaisse",
      resultType: "boolean"
    },
    {
      id: 4,
      name: "plaquettes",
      resultType: "numeric",
      unit: "µL",
      threshold: 150000
    },
    {
      id: 5,
      name: "hémoglobine",
      resultType: "numeric",
      unit: "g/dL",
      threshold: 11
    }
  ];
  const patientData = {
    recentDiseases: [
      { name: "Malaria", date: 30 },
      { name: "Anémie", date: 14 }
    ]
  };
  const translations = {
    select: "Sélectionner",
    positive: "Positif",
    negative: "Négatif",
    threshold: "Seuil :"
  };
  const placeholders = {
    name: "Nom de l'analyse",
    result: "Résultat"
  };

  // Gardez toutes les fonctions existantes (sendDataToAPI, hasAllDetailsCompleted, etc.)
  const sendDataToAPI = async (formData) => {
      try {
        const response = await fetch('http://localhost:8001/diagnostic', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            recentDiseases: patientData.recentDiseases
          })
        });
  
        const data = await response.json();
        console.log("Réponse de l'API diagnostic :", data);
        setDiagnostics(data.diagnostics || []);
        setDiseaseRisks(data.diseaseRisks || []);
      } catch (error) {
        console.error('Erreur lors de l\'envoi des données:', error);
      }
    };
  
    // Envoi des données si tous les détails sont remplis
    const hasAllDetailsCompleted = (item) => {
      if (!item.details || item.details.length === 0) return true;
      return item.details.every(detail => detail.selected);
    };
  
    const areAllItemsComplete = (items) => items.every(hasAllDetailsCompleted);
  
    useEffect(() => {
      if (!isAIEnabled) return;
    
      const formData = {
        medicalHistory,
        symptoms: selectedSymptoms,
        analyses: selectedAnalyses
      };
    
      const hasData = medicalHistory.length > 0 || selectedSymptoms.length > 0 || selectedAnalyses.length > 0;
      const historyComplete = areAllItemsComplete(medicalHistory);
      const symptomsComplete = areAllItemsComplete(selectedSymptoms);
      const analysesComplete = areAllItemsComplete(selectedAnalyses);
    
      if (hasData && historyComplete && symptomsComplete && analysesComplete) {
        sendDataToAPI(formData);
      }
    }, [medicalHistory, selectedSymptoms, selectedAnalyses, isAIEnabled]);
  
    // Handlers pour les changements de sélections
    const handleMedicalHistoryChange = (newHistory) => {
      const lastItem = newHistory[newHistory.length - 1];
      if (!lastItem?.details || lastItem.details.length === 0) {
        setMedicalHistory(newHistory);
        return;
      }
      const previousItems = newHistory.slice(0, -1);
      if (!hasAllDetailsCompleted(lastItem)) {
        setMedicalHistory(previousItems);
        return;
      }
      setMedicalHistory(newHistory);
    };
  
    const handleSymptomsChange = (newSymptoms) => {
      const lastItem = newSymptoms[newSymptoms.length - 1];
      if (!lastItem?.details || lastItem.details.length === 0) {
        setSelectedSymptoms(newSymptoms);
        return;
      }
      const previousItems = newSymptoms.slice(0, -1);
      if (!hasAllDetailsCompleted(lastItem)) {
        setSelectedSymptoms(previousItems);
        return;
      }
      setSelectedSymptoms(newSymptoms);
    };
  
    const handleAnalysesChange = (newAnalyses) => {
      const lastItem = newAnalyses[newAnalyses.length - 1];
      if (!lastItem?.details || lastItem.details.length === 0) {
        setSelectedAnalyses(newAnalyses);
        return;
      }
      const previousItems = newAnalyses.slice(0, -1);
      if (!hasAllDetailsCompleted(lastItem)) {
        setSelectedAnalyses(previousItems);
        return;
      }
      setSelectedAnalyses(newAnalyses);
    };
  
    // Récupération du traitement une fois qu'un diagnostic est disponible
    useEffect(() => {
      const fetchTreatment = async () => {
        if (!isAIEnabled) return;
        if (diagnostics && diagnostics.length > 0) {
          const formData = {
            medicalHistory,
            symptoms: selectedSymptoms,
            analyses: selectedAnalyses
          };
          // Ici, nous utilisons le premier diagnostic retourné (diagnostics[0])
          const selectedDiagnostic = diagnostics[0].disease;
          try {
            const response = await fetch(`http://localhost:8000/predict-treatment?diagnostic=${encodeURIComponent(selectedDiagnostic)}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                ...formData,
                recentDiseases: patientData.recentDiseases
              })
            });
            const data = await response.json();
            console.log("Réponse de l'API traitement :", data);
            setTreatment(data);
          } catch (error) {
            console.error('Erreur lors de la récupération du traitement:', error);
          }
        }
      };
  
      fetchTreatment();
    }, [diagnostics, medicalHistory, selectedSymptoms, selectedAnalyses, isAIEnabled]);
  

    return (
      <div className="bg-blue-100 h-full p-1 md:p-3 max-w-[1800px] mx-auto">
        {!patient ? (
          <PatientSearch onPatientFound={setPatient} />
        ) : (
          <>            
              <div className="bg-blue-100 h-full p-4 md:p-6 max-w-[1800px] mx-auto">
                <ConsultationHeader 
                  isAIEnabled={isAIEnabled}
                  onToggleAI={setIsAIEnabled}
                />
                
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Colonne du formulaire */}
                  <div className="w-full lg:w-3/4 space-y-6">
                    <div className="bg-white rounded-xl shadow p-4 md:p-6">
                      {/* Section Symptômes */}
                      <div className="mb-6">
                        <SymptomSelector
                          initialSymptoms={symptoms}
                          onSymptomsChange={handleSymptomsChange}
                        />
                      </div>

                      {/* Section Antécédents */}
                      <div className="mb-6">
                        <AntecedentSelector
                          initialAntecedents={antecedents}
                          onAntecedentsChange={handleMedicalHistoryChange}
                        />
                      </div>

                      {/* Section Analyses */}
                      <div className="mb-6">
                        <AnalysisSelector
                          availableAnalyses={analyses}
                          onAnalysesChange={handleAnalysesChange}
                          title="Analyses médicales :"
                          placeholders={placeholders}
                          translations={translations}
                        />
                      </div>

                      {/* Affichage des risques de maladies */}
                      <DiseaseRiskDisplay diseases={diseaseRisks} />
                    </div>
                  </div>

                  {/* Colonne de droite - Résultats */}
                    <div className="w-full lg:w-1/4 space-y-4">
                      <PatientInfo patient={patient} />
                      <DiseaseHistory 
                        recentDiseases={patientData.recentDiseases}
                        title="Historique récent :"
                      />
                      <DiagnosticComponent
                        diagnostics={diagnostics}
                        title="Diagnostic suggéré :"
                      />
                      <TreatmentComponent
                        treatments={treatment ? [treatment] : []}
                        title="Traitement proposé :"
                      />
                    </div>
                </div>
              </div>
          </>
        )}
      </div>
    );
  }
