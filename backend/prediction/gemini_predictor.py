# File: prediction/gemini_predictor.py
from google import genai
from google.genai import types
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
import datetime
import base64

load_dotenv()

class DiagnosticResult(BaseModel):
    id: int
    disease: str
    probability: float
    explanation: str

class MedicationSuggestion(BaseModel):
    id: int
    name: str
    indication: str
    dosage: str
    category: str
    cost: float

class GeminiDiagnosticResponse(BaseModel):
    diagnostics: List[DiagnosticResult]
    medications: List[MedicationSuggestion]

class GeminiMedicalPredictor:
    def __init__(self):
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")

        self.client = genai.Client(api_key=api_key)
        self.model = 'gemini-2.0-flash-exp'

    def build_medical_prompt(self, symptoms, analyses, history, recent_diseases, patient_info=None):
        season = self._get_current_season()

        symptoms_text = self._format_symptoms(symptoms)
        analyses_text = self._format_analyses(analyses)
        history_text = self._format_medical_history(history)
        recent_diseases_text = self._format_recent_diseases(recent_diseases)

        age = patient_info.get('age', 'Non spécifié') if patient_info else 'Non spécifié'
        gender = patient_info.get('gender', 'Non spécifié') if patient_info else 'Non spécifié'

        prompt = f"""Vous êtes un médecin expert en diagnostic médical exerçant à Abidjan, Côte d'Ivoire.
Analysez les informations du patient suivant et fournissez des suggestions de diagnostic avec des médicaments appropriés.

**CONTEXTE GÉOGRAPHIQUE ET CLIMATIQUE:**
- Localisation: Abidjan, Côte d'Ivoire
- Saison actuelle: {season}
- Considérez les maladies prévalentes localement: paludisme, dengue, fièvre typhoïde, infections respiratoires

**INFORMATIONS DU PATIENT:**
- Âge: {age} ans
- Genre: {gender}

**ANTÉCÉDENTS MÉDICAUX:**
{history_text}

**MALADIES RÉCENTES (Historique):**
{recent_diseases_text}

**SYMPTÔMES ACTUELS:**
{symptoms_text}

**RÉSULTATS D'ANALYSES MÉDICALES:**
{analyses_text}

**INSTRUCTIONS:**
1. Proposez entre 3 et 5 diagnostics les plus probables avec:
   - Un score de probabilité entre 0 et 100
   - Une explication concise (2-3 phrases) justifiant pourquoi vous pensez à ce diagnostic
   - Basez-vous sur les symptômes, analyses, contexte épidémiologique local et historique du patient

2. Pour chaque diagnostic, suggérez 5 à 10 médicaments appropriés disponibles en Côte d'Ivoire:
   - Utilisez les noms génériques ET commerciaux si pertinent
   - Indiquez la posologie précise et la durée du traitement
   - Estimez le coût en Francs CFA (FCFA) basé sur les prix pharmaceutiques ivoiriens
   - Privilégiez les médicaments génériques quand c'est possible
   - Incluez différentes catégories: antipyrétiques, analgésiques, antibiotiques si nécessaire, antipaludiques si pertinent, etc.

3. Tenez compte:
   - Des interactions possibles avec l'historique médical
   - De l'âge et du genre du patient
   - Du contexte local (médicaments disponibles en pharmacie ivoirienne)
   - De la saison (risques accrus pendant la saison des pluies)

Retournez votre réponse au format JSON structuré selon le schéma fourni.
"""
        return prompt

    def predict_with_gemini(self, symptoms, analyses, history, recent_diseases, patient_info=None):
        try:
            prompt = self.build_medical_prompt(
                symptoms, analyses, history, recent_diseases, patient_info
            )

            # Préparer le contenu : texte + images si présentes
            contents = [prompt]

            # Ajouter les images des analyses si disponibles
            if analyses:
                for analysis in analyses:
                    if hasattr(analysis, 'photo') and analysis.photo:
                        try:
                            # Extraire les données de l'image base64
                            if ',' in analysis.photo:
                                # Format: data:image/jpeg;base64,<données>
                                image_data = analysis.photo.split(',')[1]
                            else:
                                image_data = analysis.photo

                            # Ajouter l'image au contenu
                            contents.append({
                                "mime_type": "image/jpeg",
                                "data": base64.b64decode(image_data)
                            })

                            # Ajouter un contexte pour l'image
                            contents.append(f"\n[Image de l'analyse: {analysis.name}]\n")
                        except Exception as img_error:
                            print(f"Erreur traitement image pour {analysis.name}: {str(img_error)}")

            response = self.client.models.generate_content(
                model=self.model,
                contents=contents,
                config=types.GenerateContentConfig(
                    response_mime_type='application/json',
                    response_schema=GeminiDiagnosticResponse,
                    temperature=0.3,
                    top_p=0.8,
                    top_k=40,
                )
            )

            result = response.parsed
            return result

        except Exception as e:
            raise Exception(f"Gemini API error: {str(e)}")

    def _format_symptoms(self, symptoms):
        if not symptoms or len(symptoms) == 0:
            return "Aucun symptôme rapporté"

        formatted = []
        for symptom in symptoms:
            symptom_text = f"- {symptom.name}"
            if symptom.details and len(symptom.details) > 0:
                details_list = []
                for detail in symptom.details:
                    if hasattr(detail, 'selected') and detail.selected:
                        details_list.append(f"{detail.name}: {detail.selected}")
                if details_list:
                    symptom_text += f" ({', '.join(details_list)})"
            formatted.append(symptom_text)
        return "\n".join(formatted)

    def _format_analyses(self, analyses):
        if not analyses or len(analyses) == 0:
            return "Aucune analyse disponible"

        formatted = []
        for analysis in analyses:
            unit = f" {analysis.unit}" if hasattr(analysis, 'unit') and analysis.unit else ""
            result_value = analysis.result if hasattr(analysis, 'result') else "Non spécifié"
            photo_status = " (avec photo d'analyse)" if hasattr(analysis, 'photo') and analysis.photo else ""
            formatted.append(f"- {analysis.name}: {result_value}{unit}{photo_status}")
        return "\n".join(formatted)

    def _format_medical_history(self, history):
        if not history or len(history) == 0:
            return "Aucun antécédent signalé"

        formatted = []
        for item in history:
            item_text = f"- {item.name}"
            if hasattr(item, 'details') and item.details:
                details_list = []
                for detail in item.details:
                    if hasattr(detail, 'selected') and detail.selected:
                        details_list.append(f"{detail.name}: {detail.selected}")
                if details_list:
                    item_text += f" ({', '.join(details_list)})"
            formatted.append(item_text)
        return "\n".join(formatted)

    def _format_recent_diseases(self, recent_diseases):
        if not recent_diseases or len(recent_diseases) == 0:
            return "Aucune maladie récente"

        formatted = []
        for disease in recent_diseases:
            date_str = str(disease.date) if hasattr(disease, 'date') else "Date non spécifiée"
            formatted.append(f"- {disease.name} ({date_str})")
        return "\n".join(formatted)

    def _get_current_season(self):
        month = datetime.datetime.now().month
        if 5 <= month <= 10:
            return "Saison des pluies (Mai-Octobre) - Activité accrue des moustiques, risque élevé de paludisme et dengue"
        else:
            return "Saison sèche (Novembre-Avril) - Moins d'activité vectorielle"

gemini_predictor = GeminiMedicalPredictor()
