import React, { useState, useEffect } from 'react';
import AnalysisSelector from "./AnalyseSelector";
import DiagnosticComponent from "./DiagnosticComponent";
import DiseaseRiskDisplay from "./DiseaseRiskDisplay";
import SymptomSelector from "./SymptomSelector";
import AntecedentSelector from './AntecedentSelector';
import DiseaseHistory from './DiseaseHistory';
import TreatmentComponent from "./TreatmentComponent"; // Import du composant des traitements

export function SideContent() {
  // États pour stocker les données du formulaire
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedAnalyses, setSelectedAnalyses] = useState([]);
  const [diagnostics, setDiagnostics] = useState([]);
  const [diseaseRisks, setDiseaseRisks] = useState([]);
  const [treatment, setTreatment] = useState(null);

  // Données statiques pour les sélecteurs
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

  // Fonction d'envoi des données au backend pour le diagnostic
  const sendDataToAPI = async (formData) => {
    try {
      const response = await fetch('http://localhost:8000/diagnostic', {
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
  }, [medicalHistory, selectedSymptoms, selectedAnalyses]);

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
  }, [diagnostics, medicalHistory, selectedSymptoms, selectedAnalyses]);

  return (
    <div className="my-10 mx-5 w-full h-svh flex">
      {/* Colonne du formulaire */}
      <div className="bg-white rounded-xl shadow p-5 flex-1 mr-5">
        <div className="h-48 mb-10">
          <SymptomSelector
            initialSymptoms={symptoms}
            onSymptomsChange={handleSymptomsChange}
          />
        </div>
        <div className="h-48 mb-10">
          <AntecedentSelector
            initialAntecedents={antecedents}
            onAntecedentsChange={handleMedicalHistoryChange}
          />
        </div>
        <div className="h-48 mb-10">
          <AnalysisSelector
            availableAnalyses={analyses}
            onAnalysesChange={handleAnalysesChange}
            title="Analyses médicales :"
            placeholders={placeholders}
            translations={translations}
          />
        </div>
        <DiseaseRiskDisplay diseases={diseaseRisks} />
      </div>

      {/* Colonne droite regroupant DiseaseHistory, DiagnosticComponent et TreatmentComponent */}
      <div className="w-1/4">
        <div className="mb-2">
          <DiseaseHistory recentDiseases={patientData.recentDiseases} />
        </div>
        <div className="mb-2">
          <DiagnosticComponent
            diagnostics={diagnostics}
            title="Diagnostic suggéré :"
          />
        </div>
        <div>
          <TreatmentComponent
            treatments={treatment ? [treatment] : []}
            title="Traitement proposé :"
          />
        </div>
      </div>
    </div>
  );
}
