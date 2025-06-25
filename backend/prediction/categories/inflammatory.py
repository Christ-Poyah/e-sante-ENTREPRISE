# File: prediction/categories/inflammatory.py
import numpy as np

def calculate_inflammatory_score(symptoms, analyses, history, diseases):
    """
    Calcule un score pour la catégorie des maladies inflammatoires.
    Les symptômes typiques incluent les douleurs articulaires, le rash et la fatigue.
    """
    score = 0.0
    inflammatory_symptom_weights = {
        "douleurs articulaires": 5,
        "rash": 5,
        "fatigue": 2,
    }
    total_weight = sum(inflammatory_symptom_weights.values())
    local_score = 0.0

    for symptom in symptoms:
        name = symptom.name.lower()
        if name in inflammatory_symptom_weights:
            local_score += inflammatory_symptom_weights[name]
    
    symptom_score = (local_score / total_weight * 100) if total_weight > 0 else 0

    # Analyse : par exemple, un taux élevé de CRP (protéine C-réactive) suggère une inflammation
    analysis_score = 0.0
    for analysis in analyses:
        if analysis.name.lower() == "crp" and analysis.resultType == "numeric":
            try:
                value = float(analysis.result)
                if value > 10:  # seuil arbitraire
                    analysis_score += 50
            except ValueError:
                pass

    # Pondération : 70% symptômes, 30% analyses
    combined_score = 0.7 * symptom_score + 0.3 * analysis_score
    variance = np.random.uniform(-5, 5)
    final_score = max(0, min(100, combined_score + variance))
    return final_score
