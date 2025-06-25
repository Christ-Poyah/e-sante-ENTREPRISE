# File: prediction/diseases/infectious/dengue.py
import numpy as np

def calculate_dengue_score(symptoms, analyses, history, recent_diseases):
    """
    Calcule le score spécifique pour la Dengue.
    On se base sur certains symptômes clés comme la fièvre, les maux de tête et le rash.
    """
    score = 0.0
    dengue_symptom_weights = {
        "fièvre": 4,
        "maux de tête": 3,
        "rash": 5,
    }
    total_weight = sum(dengue_symptom_weights.values())
    local_score = 0.0

    for symptom in symptoms:
        name = symptom.name.lower() if symptom.name else ""
        if name in dengue_symptom_weights:
            local_score += dengue_symptom_weights[name]
    
    symptom_score = (local_score / total_weight * 100) if total_weight > 0 else 0

    analysis_score = 0.0
    for analysis in analyses:
        if analysis.name.lower() == "leucocytes" and analysis.resultType == "numeric":
            try:
                value = float(analysis.result)
                if value < 4000:
                    analysis_score += 50
            except ValueError:
                pass

    combined_score = 0.5 * symptom_score + 0.5 * analysis_score
    variance = np.random.uniform(-5, 5)
    final_score = max(0, min(100, combined_score + variance))
    return final_score
