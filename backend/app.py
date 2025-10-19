# File: app.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Union, Optional
import uvicorn
from prediction.predictor import predict_disease_scores
from prediction.treatment_predictor import predict_treatments
from prediction.medication_predictor import suggest_medications

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

class RecentDisease(BaseModel):
    name: str
    date: int  

class DiagnosticInput(BaseModel):
    medicalHistory: List[MedicalHistoryItem]
    symptoms: List[Symptom]
    analyses: List[Analysis]
    recentDiseases: List[RecentDisease]

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
    Prédit les scores spécifiques aux maladies si le score de la catégorie dépasse 30%.
    """
    try:
        disease_scores = predict_disease_scores(
            input_data.symptoms,
            input_data.analyses,
            input_data.medicalHistory,
            input_data.recentDiseases
        )
        return DiagnosticOutput(diagnostics=disease_scores)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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
async def get_medication_suggestions(input_data: MedicationInput):
    """
    Suggère des médicaments en fonction des symptômes et analyses du patient.
    """
    try:
        medications = suggest_medications(input_data.symptoms, input_data.analyses)
        return MedicationOutput(medications=medications)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
