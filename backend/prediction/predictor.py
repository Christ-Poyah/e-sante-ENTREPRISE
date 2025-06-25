# File: prediction/predictor.py

# Import de la fonction de calcul du score de la catégorie Infectious
from prediction.categories.infectious import calculate_infectious_score

# Import des fonctions de calcul des scores pour les maladies de la catégorie Infectious
from prediction.diseases.infectious.malaria import calculate_malaria_score
from prediction.diseases.infectious.dengue import calculate_dengue_score

def predict_disease_scores(symptoms, analyses, history, recent_diseases):
    """
    Pour chaque catégorie, on calcule d'abord le score global.
    Si le score dépasse 30%, on calcule les scores individuels pour chaque maladie de cette catégorie.
    """
    results = []

    # Traitement de la catégorie "Infectious"
    infectious_category_score = calculate_infectious_score(symptoms, analyses, history, recent_diseases)
    if infectious_category_score > 30:
        # Calcul des scores pour les maladies de la catégorie Infectious
        malaria_score = calculate_malaria_score(symptoms, analyses, history, recent_diseases)
        results.append({
            "id": 1,
            "disease": "Malaria",
            "probability": round(malaria_score, 2)
        })
        dengue_score = calculate_dengue_score(symptoms, analyses, history, recent_diseases)
        results.append({
            "id": 2,
            "disease": "Dengue",
            "probability": round(dengue_score, 2)
        })

    # Vous pourrez ajouter d'autres catégories en suivant le même schéma :
    # e.g., pour une catégorie "Inflammatory", calculer le score global et, si > 30, lancer le calcul des maladies associées.
    
    return results
