import numpy as np

def suggest_medications(symptoms, analyses):
    medications = []

    symptom_names = [s.name.lower() if hasattr(s, 'name') else str(s).lower() for s in symptoms]

    if "fièvre" in symptom_names or "fever" in symptom_names:
        medications.append({
            "id": 1,
            "name": "Paracétamol",
            "indication": "Fièvre, douleurs",
            "dosage": "500-1000mg toutes les 6 heures (max 4g/jour)",
            "category": "Antipyrétique/Analgésique"
        })

    if "maux de tête" in symptom_names or "headache" in symptom_names:
        if not any(med["name"] == "Paracétamol" for med in medications):
            medications.append({
                "id": 2,
                "name": "Paracétamol",
                "indication": "Maux de tête, douleurs",
                "dosage": "500-1000mg toutes les 6 heures",
                "category": "Analgésique"
            })
        medications.append({
            "id": 3,
            "name": "Ibuprofène",
            "indication": "Maux de tête intenses",
            "dosage": "400mg toutes les 8 heures",
            "category": "Anti-inflammatoire"
        })

    if "nausées" in symptom_names or "vomissements" in symptom_names:
        medications.append({
            "id": 4,
            "name": "Métoclopramide",
            "indication": "Nausées et vomissements",
            "dosage": "10mg 3 fois par jour",
            "category": "Antiémétique"
        })

    if "douleurs musculaires" in symptom_names or "douleurs articulaires" in symptom_names:
        medications.append({
            "id": 5,
            "name": "Ibuprofène",
            "indication": "Douleurs musculaires et articulaires",
            "dosage": "400-600mg toutes les 8 heures",
            "category": "Anti-inflammatoire"
        })

    if "frissons" in symptom_names or "sueurs" in symptom_names:
        if not any(med["name"] == "Paracétamol" for med in medications):
            medications.append({
                "id": 6,
                "name": "Paracétamol",
                "indication": "Fièvre avec frissons",
                "dosage": "1000mg toutes les 6 heures",
                "category": "Antipyrétique"
            })

    if "fatigue" in symptom_names:
        medications.append({
            "id": 7,
            "name": "Multivitamines",
            "indication": "Fatigue, renforcement immunitaire",
            "dosage": "1 comprimé par jour",
            "category": "Complément"
        })

    for analysis in analyses:
        if hasattr(analysis, 'name'):
            if "hémoglobine" in analysis.name.lower():
                if hasattr(analysis, 'result') and hasattr(analysis, 'threshold'):
                    try:
                        if float(analysis.result) < analysis.threshold:
                            medications.append({
                                "id": 8,
                                "name": "Fer (Sulfate ferreux)",
                                "indication": "Anémie (hémoglobine basse)",
                                "dosage": "200mg par jour",
                                "category": "Supplément"
                            })
                    except (ValueError, TypeError):
                        pass

    unique_medications = []
    seen_names = set()
    for med in medications:
        if med["name"] not in seen_names:
            unique_medications.append(med)
            seen_names.add(med["name"])

    return unique_medications
