# File: prediction/categories/infectious.py
import numpy as np

def calculate_infectious_score(symptoms, analyses, history, recent_diseases):
    """
    Calcule un score global pour la catégorie des maladies infectieuses.
    Par exemple, on se base sur la fièvre, les maux de tête, les frissons et la positivité de certains tests.
    """
    score = 0.0
    infectious_symptom_weights = {
        "fièvre": 5,
        "maux de tête": 3,
        "frissons": 4,
        "sueurs": 2,
    }
    total_weight = sum(infectious_symptom_weights.values())
    local_score = 0.0

    for symptom in symptoms:
        # S'assurer que la propriété name existe
        name = symptom.name.lower() if symptom.name else ""
        if name in infectious_symptom_weights:
            local_score += infectious_symptom_weights[name]
    
    symptom_score = (local_score / total_weight * 100) if total_weight > 0 else 0

    # Exemple d'analyse : un test diagnostique positif contribue fortement
    analysis_score = 0.0
    for analysis in analyses:
        if "test" in analysis.name.lower() and analysis.resultType == "boolean":
            if str(analysis.result).lower() == "positif":
                analysis_score += 50

    # Pondération des symptômes (60%) et analyses (40%)
    combined_score = 0.6 * symptom_score + 0.4 * analysis_score
    variance = np.random.uniform(-5, 5)
    final_score = max(0, min(100, combined_score + variance))
    return final_score
