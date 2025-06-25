# File: prediction/categories/metabolic.py
import numpy as np

def calculate_metabolic_score(symptoms, analyses, history, diseases):
    """
    Calcule un score pour la catégorie des maladies métaboliques.
    On se base par exemple sur des symptômes comme la fatigue ou la soif, ainsi que sur des analyses (glycémie, cholestérol).
    """
    score = 0.0
    metabolic_symptom_weights = {
        "fatigue": 3,
        "soif": 4,  # on suppose que ce symptôme peut être renseigné
    }
    total_weight = sum(metabolic_symptom_weights.values()) if metabolic_symptom_weights else 1
    local_score = 0.0

    for symptom in symptoms:
        name = symptom.name.lower()
        if name in metabolic_symptom_weights:
            local_score += metabolic_symptom_weights[name]
    
    symptom_score = (local_score / total_weight * 100) if total_weight > 0 else 0

    analysis_score = 0.0
    for analysis in analyses:
        if analysis.name.lower() == "glycémie" and analysis.resultType == "numeric":
            try:
                value = float(analysis.result)
                # Supposons qu'une glycémie anormale est en dehors de 70-110 mg/dL
                if value < 70 or value > 110:
                    analysis_score += 50
            except ValueError:
                pass
        elif analysis.name.lower() == "cholestérol" and analysis.resultType == "numeric":
            try:
                value = float(analysis.result)
                if value > 200:
                    analysis_score += 50
            except ValueError:
                pass

    # On combine les scores en pondérant également les symptômes et les analyses
    combined_score = 0.5 * symptom_score + 0.5 * analysis_score
    variance = np.random.uniform(-5, 5)
    final_score = max(0, min(100, combined_score + variance))
    return final_score
