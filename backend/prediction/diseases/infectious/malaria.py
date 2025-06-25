# File: prediction/diseases/infectious/malaria.py
import numpy as np

def calculate_malaria_score(symptoms, analyses, history, recent_diseases):
    """
    Calcule le score spécifique pour la Malaria.
    Par exemple, on prend en compte la fièvre, les maux de tête, les frissons et l'anémie.
    """
    score = 0.0
    malaria_symptom_weights = {
        "fièvre": 5,
        "maux de tête": 3,
        "frissons": 4,
        "anémie": 3,
    }
    total_weight = sum(malaria_symptom_weights.values())
    local_score = 0.0

    for symptom in symptoms:
        name = symptom.name.lower() if symptom.name else ""
        if name in malaria_symptom_weights:
            local_score += malaria_symptom_weights[name]
    
    symptom_score = (local_score / total_weight * 100) if total_weight > 0 else 0

    analysis_score = 0.0
    for analysis in analyses:
        if analysis.name.lower() == "test de diagnostic rapide du paludisme" and analysis.resultType == "boolean":
            if str(analysis.result).lower() == "positif":
                analysis_score += 50
    
    combined_score = 0.5 * symptom_score + 0.5 * analysis_score
    variance = np.random.uniform(-5, 5)
    final_score = max(0, min(100, combined_score + variance))
    return final_score
