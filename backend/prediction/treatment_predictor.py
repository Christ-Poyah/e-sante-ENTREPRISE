# File: prediction/treatment_predictor.py

# Import des fonctions de traitement pour les maladies de la catégorie Infectious
from prediction.treatments.infectious.malaria_treatment import calculate_malaria_treatment
from prediction.treatments.infectious.dengue_treatment import calculate_dengue_treatment

def predict_treatments(diagnostic, symptoms, analyses, history, recent_diseases):
    """
    En fonction du diagnostic (ex. "Malaria" ou "Dengue") et des mêmes données d'entrée,
    calcule et retourne le traitement proposé avec la posologie.
    
    Le paramètre 'diagnostic' correspond à la maladie diagnostiquée.
    """
    treatments = {}
    if diagnostic.lower() == "malaria":
        treatments = calculate_malaria_treatment(symptoms, analyses, history, recent_diseases)
    elif diagnostic.lower() == "dengue":
        treatments = calculate_dengue_treatment(symptoms, analyses, history, recent_diseases)
    # Vous pouvez ajouter d'autres conditions pour d'autres pathologies.
    return treatments
