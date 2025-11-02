import React, { useState, useEffect } from 'react';
import AnalysisSelector from "../../components/consultation/NewConsultation/AnalyseSelector";
import DiagnosticComponent from "../../components/consultation/NewConsultation/DiagnosticComponent";
import DiseaseRiskDisplay from "../../components/consultation/NewConsultation/DiseaseRiskDisplay";
import SymptomSelector from "../../components/consultation/NewConsultation/SymptomSelector";
import AntecedentSelector from '../../components/consultation/NewConsultation/AntecedentSelector';
import DiseaseHistory from '../../components/consultation/NewConsultation/DiseaseHistory';
import TreatmentComponent from "../../components/consultation/NewConsultation/TreatmentComponent";
import MedicationSuggestion from "../../components/consultation/NewConsultation/MedicationSuggestion";
import PrescriptionModal from '../../components/consultation/NewConsultation/PrescriptionModal';
import PatientSearch from '../../components/consultation/NewConsultation/PatientSearch';
import Sidebar from '../../components/ui/Sidebar';
import AnalysisSuggestionComponent from '../../components/consultation/NewConsultation/AnalysisSuggestionComponent';




const ToggleButton = ({ enabled, onChange }) => {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span className="sr-only">Toggle AI assistance</span>
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedAnalyses, setSelectedAnalyses] = useState([]);
  const [diagnostics, setDiagnostics] = useState([]);
  const [diseaseRisks, setDiseaseRisks] = useState([]);
  const [treatment, setTreatment] = useState(null);
  const [medications, setMedications] = useState([]);
  const [prescription, setPrescription] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedDiagnostics, setSelectedDiagnostics] = useState([]);
  const [selectedMedications, setSelectedMedications] = useState([]);
  const [analysisSuggestions, setAnalysisSuggestions] = useState([]);
  const [suggestedAnalyses, setSuggestedAnalyses] = useState([]);

  // États de chargement
  const [loadingAnalysisSuggestions, setLoadingAnalysisSuggestions] = useState(false);
  const [loadingDiagnostics, setLoadingDiagnostics] = useState(false);
  const [loadingMedications, setLoadingMedications] = useState(false);

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

  const sendDataToAPI = async (formData) => {
      setLoadingDiagnostics(true);
      try {
        const response = await fetch('http://localhost:8001/diagnostic', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            recentDiseases: patientData.recentDiseases,
            patientInfo: patient ? {
              age: patient.age,
              gender: patient.gender || 'Non spécifié'
            } : null
          })
        });

        const data = await response.json();
        console.log("Réponse de l'API diagnostic :", data);
        setDiagnostics(data.diagnostics || []);
        setDiseaseRisks(data.diseaseRisks || []);
      } catch (error) {
        console.error('Erreur lors de l\'envoi des données:', error);
      } finally {
        setLoadingDiagnostics(false);
      }
    };

    const fetchMedicationSuggestions = async (formData) => {
      setLoadingMedications(true);
      try {
        const response = await fetch('http://localhost:8001/suggest-medications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            medicalHistory: formData.medicalHistory,
            symptoms: formData.symptoms,
            analyses: formData.analyses,
            recentDiseases: patientData.recentDiseases,
            patientInfo: patient ? {
              age: patient.age,
              gender: patient.gender || 'Non spécifié'
            } : null
          })
        });

        const data = await response.json();
        console.log("Réponse de l'API médicaments :", data);
        setMedications(data.medications || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des médicaments:', error);
      } finally {
        setLoadingMedications(false);
      }
    };

    const fetchAnalysisSuggestions = async () => {
      if (!isAIEnabled) return;
      if (selectedSymptoms.length === 0 && medicalHistory.length === 0) {
        setAnalysisSuggestions([]);
        return;
      }

      setLoadingAnalysisSuggestions(true);
      try {
        const response = await fetch('http://localhost:8001/suggest-analyses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            symptoms: selectedSymptoms,
            medicalHistory: medicalHistory,
            patientInfo: patient ? {
              age: patient.age,
              gender: patient.gender || 'Non spécifié'
            } : null
          })
        });

        const data = await response.json();
        console.log("Suggestions d'analyses:", data);
        if (data.suggestions) {
          setAnalysisSuggestions(data.suggestions);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des suggestions d\'analyses:', error);
      } finally {
        setLoadingAnalysisSuggestions(false);
      }
    };
  
    // Envoi des données si tous les détails sont remplis
    const hasAllDetailsCompleted = (item) => {
      if (!item.details || item.details.length === 0) return true;
      return item.details.every(detail => detail.selected);
    };
  
    const areAllItemsComplete = (items) => items.every(hasAllDetailsCompleted);
  
    // useEffect pour déclencher les suggestions d'analyses dès que symptômes ou antécédents changent
    useEffect(() => {
      if (!isAIEnabled) return;
      if (selectedSymptoms.length > 0 || medicalHistory.length > 0) {
        fetchAnalysisSuggestions();
      }
    }, [selectedSymptoms, medicalHistory, isAIEnabled, patient]);

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
        fetchMedicationSuggestions(formData);
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

    // Handler pour les analyses suggérées sélectionnées (avec photos)
    const handleSuggestedAnalysesSelect = (selectedWithPhotos) => {
      console.log("Analyses suggérées sélectionnées:", selectedWithPhotos);
      setSuggestedAnalyses(selectedWithPhotos);

      // Fusionner avec les analyses déjà sélectionnées manuellement
      // Les analyses suggérées ont priorité si elles ont des photos
      const mergedAnalyses = [...selectedAnalyses];

      selectedWithPhotos.forEach(suggestedAnalysis => {
        const existingIndex = mergedAnalyses.findIndex(a => a.name === suggestedAnalysis.name);
        if (existingIndex >= 0) {
          // Mettre à jour l'analyse existante avec la photo
          mergedAnalyses[existingIndex] = {
            ...mergedAnalyses[existingIndex],
            photo: suggestedAnalysis.photo
          };
        } else {
          // Ajouter la nouvelle analyse
          mergedAnalyses.push(suggestedAnalysis);
        }
      });

      setSelectedAnalyses(mergedAnalyses);
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

    const handleGeneratePrescription = async () => {
      if (!patient) {
        alert("Veuillez d'abord charger un patient.");
        return;
      }

      if (!selectedDiagnostics || selectedDiagnostics.length === 0) {
        alert("Veuillez sélectionner au moins un diagnostic.");
        return;
      }

      if (!selectedMedications || selectedMedications.length === 0) {
        alert("Veuillez sélectionner au moins un médicament.");
        return;
      }

      const prescriptionData = {
        patient: {
          firstName: patient.firstName,
          lastName: patient.lastName,
          age: patient.age,
          cmuNumber: patient.cmuNumber
        },
        diagnostic: selectedDiagnostics.map(d => d.disease).join(', '),
        treatment: treatment?.treatment || "Traitement selon diagnostic",
        posology: treatment?.posology || "Voir posologie des médicaments",
        medications: selectedMedications,
        consultationDate: new Date().toISOString()
      };

      try {
        const response = await fetch('http://localhost:8001/generate-prescription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(prescriptionData)
        });

        const data = await response.json();
        setPrescription(data);
        setShowPrescriptionModal(true);
      } catch (error) {
        console.error('Erreur lors de la génération de l\'ordonnance:', error);
        alert('Erreur lors de la génération de l\'ordonnance');
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <div
          className={`transition-all duration-300 ease-in-out ${
            isSidebarCollapsed ? 'ml-16' : 'ml-80'
          }`}
        >
          <div className="bg-blue-100 min-h-screen p-4 md:p-6">
            <div className="max-w-[1800px] mx-auto">
              <div className="flex items-center justify-between mb-6 bg-white rounded-xl shadow p-4">
                <h1 className="text-2xl font-bold text-blue-900">Consultation Médicale</h1>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 font-medium">
                    Assistance IA
                  </span>
                  <ToggleButton
                    enabled={isAIEnabled}
                    onChange={setIsAIEnabled}
                  />
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-3/4 space-y-6">
                  <div className="bg-white rounded-xl shadow p-4 md:p-6">
                    <div className="mb-6">
                      <SymptomSelector
                        initialSymptoms={symptoms}
                        onSymptomsChange={handleSymptomsChange}
                      />
                    </div>

                    <div className="mb-6">
                      <AntecedentSelector
                        initialAntecedents={antecedents}
                        onAntecedentsChange={handleMedicalHistoryChange}
                      />
                    </div>

                    {loadingAnalysisSuggestions && (
                      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
                        <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-sm text-blue-700 font-medium">L'IA analyse les symptômes et suggère des analyses...</span>
                      </div>
                    )}

                    {analysisSuggestions.length > 0 && (
                      <div className="mb-6">
                        <AnalysisSuggestionComponent
                          suggestions={analysisSuggestions}
                          onAnalysisSelect={handleSuggestedAnalysesSelect}
                          title="Analyses suggérées par l'IA"
                        />
                      </div>
                    )}

                    <div className="mb-6">
                      <AnalysisSelector
                        availableAnalyses={analyses}
                        onAnalysesChange={handleAnalysesChange}
                        title="Analyses médicales"
                        placeholders={placeholders}
                        translations={translations}
                      />
                    </div>

                    {loadingDiagnostics && (
                      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
                        <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-sm text-blue-700 font-medium">L'IA analyse les données et établit un diagnostic...</span>
                      </div>
                    )}

                    <DiagnosticComponent
                      diagnostics={diagnostics}
                      title="Diagnostic suggéré"
                      onSelectionChange={setSelectedDiagnostics}
                    />

                    {loadingMedications && (
                      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
                        <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-sm text-blue-700 font-medium">L'IA suggère des médicaments adaptés...</span>
                      </div>
                    )}

                    <MedicationSuggestion
                      medications={medications}
                      title="Médicaments recommandés"
                      onSelectionChange={setSelectedMedications}
                      patientInfo={patient ? {
                        age: patient.age,
                        gender: patient.gender || 'Non spécifié',
                        medicalHistory: medicalHistory
                      } : null}
                    />

                    <DiseaseRiskDisplay diseases={diseaseRisks} />
                  </div>
                </div>

                <div className="w-full lg:w-1/4 space-y-4">
                  {!patient ? (
                    <PatientSearch onPatientFound={setPatient} />
                  ) : (
                    <>
                      <PatientInfo patient={patient} />
                      <DiseaseHistory
                        recentDiseases={patientData.recentDiseases}
                        title="Historique récent"
                      />
                      <TreatmentComponent
                        treatments={treatment ? [treatment] : []}
                        title="Traitement proposé"
                      />
                    </>
                  )}

                  <div className="bg-white rounded-xl shadow p-4">
                    <button
                      onClick={handleGeneratePrescription}
                      disabled={!patient || selectedDiagnostics.length === 0 || selectedMedications.length === 0}
                      className={`w-full px-4 py-3 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${
                        !patient || selectedDiagnostics.length === 0 || selectedMedications.length === 0
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Générer l'ordonnance
                    </button>
                    <div className="mt-2 text-xs text-center">
                      {!patient && (
                        <p className="text-gray-500">Chargez un patient</p>
                      )}
                      {patient && selectedDiagnostics.length === 0 && (
                        <p className="text-orange-600">Sélectionnez au moins un diagnostic</p>
                      )}
                      {patient && selectedDiagnostics.length > 0 && selectedMedications.length === 0 && (
                        <p className="text-orange-600">Sélectionnez au moins un médicament</p>
                      )}
                      {patient && selectedDiagnostics.length > 0 && selectedMedications.length > 0 && (
                        <p className="text-green-600 font-medium">✓ Prêt à générer l'ordonnance</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showPrescriptionModal && (
          <PrescriptionModal
            prescription={prescription}
            onClose={() => setShowPrescriptionModal(false)}
          />
        )}
      </div>
    );
  }
