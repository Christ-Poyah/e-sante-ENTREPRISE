# File: prediction/gemini_analysis_suggester.py
from google import genai
from google.genai import types
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv

load_dotenv()

class AnalysisSuggestion(BaseModel):
    id: int
    name: str
    reason: str
    priority: str  # "high" | "medium" | "low"
    category: str

class AnalysisSuggestionsResponse(BaseModel):
    suggestions: List[AnalysisSuggestion]

class GeminiAnalysisSuggester:
    def __init__(self):
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")

        self.client = genai.Client(api_key=api_key)
        self.model = 'gemini-2.0-flash-exp'

    def build_analysis_suggestion_prompt(self, symptoms, medical_history, patient_info):
        """
        Construit un prompt pour suggérer des analyses médicales pertinentes
        basées sur les symptômes et antécédents du patient.
        """
        symptoms_text = "Aucun" if not symptoms else "\n".join([
            f"- {symptom.name}" for symptom in symptoms
        ])

        history_text = "Aucun" if not medical_history else "\n".join([
            f"- {item.get('name', item) if isinstance(item, dict) else item}"
            for item in medical_history
        ])

        age = patient_info.get('age', 'Non spécifié') if patient_info else 'Non spécifié'
        gender = patient_info.get('gender', 'Non spécifié') if patient_info else 'Non spécifié'

        prompt = f"""Vous êtes un médecin expert en médecine tropicale et diagnostics médicaux, spécialisé dans le contexte ivoirien (Abidjan).

**INFORMATIONS DU PATIENT:**
- Âge: {age} ans
- Genre: {gender}
- Localisation: Abidjan, Côte d'Ivoire

**SYMPTÔMES ACTUELS:**
{symptoms_text}

**ANTÉCÉDENTS MÉDICAUX:**
{history_text}

**MISSION:**
Sur la base des symptômes et antécédents du patient, suggérez 3 à 8 analyses médicales pertinentes qui aideraient à établir un diagnostic précis.

**CRITÈRES DE SUGGESTION:**
1. **Priorité haute (high)**: Analyses essentielles pour confirmer/exclure des pathologies graves ou courantes dans la région
2. **Priorité moyenne (medium)**: Analyses importantes pour affiner le diagnostic
3. **Priorité basse (low)**: Analyses complémentaires utiles

**CONTEXTE IVOIRIEN:**
- Prévalence élevée: Paludisme, Dengue, Fièvre typhoïde, Hépatites
- Analyses couramment disponibles: GE (Goutte épaisse), TDR Paludisme, NFS, CRP, Transaminases, Sérologies
- Considérer les maladies tropicales endémiques

**CATÉGORIES D'ANALYSES:**
- Hématologie: NFS, VS, CRP, etc.
- Parasitologie: GE, TDR Paludisme, Selles, etc.
- Biochimie: Glycémie, Transaminases, Créatinine, etc.
- Sérologie: VIH, Hépatites, Dengue, etc.
- Microbiologie: Hémoculture, ECBU, etc.
- Imagerie: Radio thorax, Échographie, etc.

**FORMAT DE RÉPONSE:**
Pour chaque analyse suggérée, retournez:
- id: numéro unique (1, 2, 3...)
- name: Nom complet de l'analyse
- reason: Explication claire (2-3 phrases) de pourquoi cette analyse est pertinente
- priority: "high" | "medium" | "low"
- category: Catégorie de l'analyse

**IMPORTANT:** Suggérez des analyses réellement disponibles et pratiques dans un contexte hospitalier ivoirien.
"""
        return prompt

    def suggest_analyses(self, symptoms, medical_history, patient_info=None):
        """
        Suggère des analyses médicales pertinentes basées sur les symptômes et antécédents.
        """
        if not symptoms or len(symptoms) == 0:
            return AnalysisSuggestionsResponse(suggestions=[])

        try:
            prompt = self.build_analysis_suggestion_prompt(symptoms, medical_history, patient_info)

            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type='application/json',
                    response_schema=AnalysisSuggestionsResponse,
                    temperature=0.3,
                    top_p=0.85,
                    top_k=40,
                )
            )

            result = response.parsed
            return result

        except Exception as e:
            print(f"Gemini analysis suggestion error: {str(e)}")
            return AnalysisSuggestionsResponse(suggestions=[])

analysis_suggester = GeminiAnalysisSuggester()
