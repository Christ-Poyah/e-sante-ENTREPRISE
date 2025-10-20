# File: prediction/gemini_compatibility.py
from google import genai
from google.genai import types
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv

load_dotenv()

class MedicationWarning(BaseModel):
    medication_ids: List[int]
    medication_names: List[str]
    severity: str
    reason: str
    recommendation: Optional[str] = None

class CompatibilityResult(BaseModel):
    compatible: bool
    warnings: List[MedicationWarning]

class GeminiCompatibilityChecker:
    def __init__(self):
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")

        self.client = genai.Client(api_key=api_key)
        self.model = 'gemini-2.0-flash-exp'

    def build_compatibility_prompt(self, medications, patient_info):
        meds_text = "\n".join([
            f"- **{med['name']}** (ID: {med['id']})\n  Catégorie: {med['category']}\n  Indication: {med['indication']}\n  Posologie: {med['dosage']}"
            for med in medications
        ])

        age = patient_info.get('age', 'Non spécifié') if patient_info else 'Non spécifié'
        gender = patient_info.get('gender', 'Non spécifié') if patient_info else 'Non spécifié'
        history = patient_info.get('medicalHistory', []) if patient_info else []

        history_text = "Aucun" if not history else "\n".join([f"- {item['name']}" for item in history])

        prompt = f"""Vous êtes un pharmacologue expert spécialisé dans les interactions médicamenteuses et les contre-indications.

**INFORMATIONS DU PATIENT:**
- Âge: {age} ans
- Genre: {gender}
- Antécédents médicaux:
{history_text}

**MÉDICAMENTS SÉLECTIONNÉS:**
{meds_text}

**MISSION:**
Analysez ces médicaments et identifiez TOUTES les interactions potentiellement dangereuses, contre-indications ou incompatibilités:

1. **Interactions médicament-médicament:**
   - Interactions majeures (risque vital)
   - Interactions modérées (nécessite surveillance)
   - Potentialisation ou antagonisme

2. **Contre-indications patient:**
   - Âge (pédiatrie, gériatrie)
   - Antécédents médicaux
   - Risques spécifiques au profil

3. **Évaluation de gravité:**
   - **high**: Risque vital, éviter absolument
   - **medium**: Risque modéré, surveillance nécessaire
   - **low**: Attention mineure

**CRITÈRES D'ALERTE:**
- AINS + Anticoagulants = Risque hémorragique (HIGH)
- Antibiotiques + Anticoagulants = Potentialisation (MEDIUM/HIGH)
- Fer + Quinolones = Réduction absorption (MEDIUM)
- Paracétamol (>4g/j) + Autres hépatotoxiques = Toxicité hépatique (HIGH)

**FORMAT DE RÉPONSE:**
Pour chaque incompatibilité trouvée, retournez:
- medication_ids: [IDs des médicaments concernés]
- medication_names: [Noms des médicaments]
- severity: "high" | "medium" | "low"
- reason: Explication claire et concise (2-3 phrases)
- recommendation: Suggestion alternative ou précaution

Si AUCUNE incompatibilité détectée, retournez: compatible=true, warnings=[]
"""
        return prompt

    def check_compatibility(self, medications, patient_info=None):
        if not medications or len(medications) == 0:
            return CompatibilityResult(compatible=True, warnings=[])

        if len(medications) == 1:
            return CompatibilityResult(compatible=True, warnings=[])

        try:
            prompt = self.build_compatibility_prompt(medications, patient_info)

            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type='application/json',
                    response_schema=CompatibilityResult,
                    temperature=0.2,
                    top_p=0.8,
                    top_k=40,
                )
            )

            result = response.parsed
            return result

        except Exception as e:
            print(f"Gemini compatibility check error: {str(e)}")
            return CompatibilityResult(compatible=True, warnings=[])

compatibility_checker = GeminiCompatibilityChecker()
