# File: app.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Union, Optional
import uvicorn
from prediction.predictor import predict_disease_scores
from prediction.treatment_predictor import predict_treatments
from prediction.medication_predictor import suggest_medications
from prediction.gemini_predictor import gemini_predictor
from prediction.gemini_compatibility import compatibility_checker, CompatibilityResult, MedicationWarning
from prediction.gemini_analysis_suggester import analysis_suggester, AnalysisSuggestionsResponse

class DetailOption(BaseModel):
    name: str
    options: List[str]
    selected: str

class MedicalHistoryItem(BaseModel):
    name: str
    details: List[DetailOption]

class SymptomDetail(BaseModel):
    id: int
    name: str
    options: List[str]
    selected: str

class Symptom(BaseModel):
    name: str
    details: List[SymptomDetail]

class Analysis(BaseModel):
    name: str
    result: Union[str, float, int]
    resultType: str
    unit: Optional[str] = None
    threshold: Optional[float] = None
    photo: Optional[str] = None  # Base64 encoded image

class RecentDisease(BaseModel):
    name: str
    date: int  

class DiagnosticInput(BaseModel):
    medicalHistory: List[MedicalHistoryItem]
    symptoms: List[Symptom]
    analyses: List[Analysis]
    recentDiseases: List[RecentDisease]
    patientInfo: Optional[Dict[str, Union[int, str]]] = None

class DiagnosticOutput(BaseModel):
    diagnostics: List[Dict[str, Union[int, str, float]]]

class TreatmentOutput(BaseModel):
    diagnostic: str
    treatment: str
    posology: str

class MedicationItem(BaseModel):
    id: int
    name: str
    indication: str
    dosage: str
    category: str
    cost: Optional[float] = 0
    selected: Optional[bool] = False

class MedicationOutput(BaseModel):
    medications: List[MedicationItem]

class MedicationInput(BaseModel):
    symptoms: List[Symptom]
    analyses: List[Analysis]

class PatientInfo(BaseModel):
    firstName: str
    lastName: str
    age: int
    cmuNumber: str

class PrescriptionInput(BaseModel):
    patient: PatientInfo
    diagnostic: str
    treatment: str
    posology: str
    medications: List[MedicationItem]
    consultationDate: str

class PrescriptionOutput(BaseModel):
    patient: PatientInfo
    consultationDate: str
    diagnostic: str
    treatment: str
    posology: str
    medications: List[MedicationItem]
    instructions: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/diagnostic", response_model=DiagnosticOutput)
async def predict_diseases(input_data: DiagnosticInput):
    """
    Utilise l'IA Gemini pour prédire les diagnostics.
    En cas d'échec, utilise le système de calcul manuel comme fallback.
    """
    try:
        gemini_response = gemini_predictor.predict_with_gemini(
            input_data.symptoms,
            input_data.analyses,
            input_data.medicalHistory,
            input_data.recentDiseases,
            input_data.patientInfo
        )

        diagnostics = []
        for diag in gemini_response.diagnostics:
            diagnostics.append({
                "id": diag.id,
                "disease": diag.disease,
                "probability": diag.probability,
                "explanation": diag.explanation
            })

        return DiagnosticOutput(diagnostics=diagnostics)

    except Exception as e:
        print(f"Gemini API failed, using manual calculation fallback: {str(e)}")
        try:
            disease_scores = predict_disease_scores(
                input_data.symptoms,
                input_data.analyses,
                input_data.medicalHistory,
                input_data.recentDiseases
            )
            return DiagnosticOutput(diagnostics=disease_scores)
        except Exception as fallback_error:
            raise HTTPException(status_code=500, detail=f"Both Gemini and fallback failed: {str(fallback_error)}")

@app.post("/predict-treatment", response_model=TreatmentOutput)
async def predict_treatment(input_data: DiagnosticInput, diagnostic: str):
    """
    Une fois le diagnostic sélectionné (par exemple, "Malaria" ou "Dengue"),
    ce point d'entrée retourne la proposition de traitement et la posologie correspondante.
    """
    try:
        treatment = predict_treatments(
            diagnostic,
            input_data.symptoms,
            input_data.analyses,
            input_data.medicalHistory,
            input_data.recentDiseases
        )
        return TreatmentOutput(
            diagnostic=diagnostic,
            treatment=treatment.get("treatment", "Traitement non défini"),
            posology=treatment.get("posology", "Posologie non définie")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/suggest-medications", response_model=MedicationOutput)
async def get_medication_suggestions(input_data: DiagnosticInput):
    """
    Suggère des médicaments via Gemini AI.
    En cas d'échec, utilise le système manuel comme fallback.
    """
    try:
        gemini_response = gemini_predictor.predict_with_gemini(
            input_data.symptoms,
            input_data.analyses,
            input_data.medicalHistory,
            input_data.recentDiseases,
            input_data.patientInfo
        )

        medications = []
        for med in gemini_response.medications:
            medications.append({
                "id": med.id,
                "name": med.name,
                "indication": med.indication,
                "dosage": med.dosage,
                "category": med.category,
                "cost": med.cost,
                "selected": False
            })

        return MedicationOutput(medications=medications)

    except Exception as e:
        print(f"Gemini API failed for medications, using manual fallback: {str(e)}")
        try:
            medications = suggest_medications(input_data.symptoms, input_data.analyses)
            return MedicationOutput(medications=medications)
        except Exception as fallback_error:
            raise HTTPException(status_code=500, detail=f"Both Gemini and fallback failed: {str(fallback_error)}")

@app.post("/generate-prescription", response_model=PrescriptionOutput)
async def generate_prescription(input_data: PrescriptionInput):
    """
    Génère une ordonnance médicale complète pour le patient.
    """
    try:
        instructions = "Respecter strictement la posologie prescrite. En cas d'effets secondaires, consulter immédiatement un médecin."

        return PrescriptionOutput(
            patient=input_data.patient,
            consultationDate=input_data.consultationDate,
            diagnostic=input_data.diagnostic,
            treatment=input_data.treatment,
            posology=input_data.posology,
            medications=input_data.medications,
            instructions=instructions
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class CompatibilityInput(BaseModel):
    medications: List[MedicationItem]
    patientInfo: Optional[Dict[str, Union[int, str, List]]] = None

@app.post("/check-medication-compatibility", response_model=CompatibilityResult)
async def check_medication_compatibility(input_data: CompatibilityInput):
    """
    Vérifie les interactions médicamenteuses et contre-indications.
    Retourne des warnings si incompatibilités détectées.
    """
    try:
        medications = [
            {
                "id": med.id,
                "name": med.name,
                "category": med.category,
                "indication": med.indication,
                "dosage": med.dosage
            }
            for med in input_data.medications
        ]

        result = compatibility_checker.check_compatibility(
            medications,
            input_data.patientInfo
        )

        return result

    except Exception as e:
        print(f"Compatibility check error: {str(e)}")
        return CompatibilityResult(compatible=True, warnings=[])

class AnalysisSuggestionInput(BaseModel):
    symptoms: List[Symptom]
    medicalHistory: List[MedicalHistoryItem]
    patientInfo: Optional[Dict[str, Union[int, str]]] = None

@app.post("/suggest-analyses", response_model=AnalysisSuggestionsResponse)
async def get_analysis_suggestions(input_data: AnalysisSuggestionInput):
    """
    Suggère des analyses médicales pertinentes basées sur les symptômes et antécédents.
    """
    try:
        result = analysis_suggester.suggest_analyses(
            input_data.symptoms,
            input_data.medicalHistory,
            input_data.patientInfo
        )
        return result

    except Exception as e:
        print(f"Analysis suggestion error: {str(e)}")
        return AnalysisSuggestionsResponse(suggestions=[])

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
