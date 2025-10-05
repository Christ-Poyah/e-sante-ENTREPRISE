# Changelog

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Non publié]

### Ajouté
- Aucun

### Modifié
- Aucun

### Supprimé
- Aucun

## [1.0.0] - 2025-10-05

### Modifié
- Repositionnement des diagnostics et traitements dans le bloc principal en bas de page
- Affichage automatique des suggestions de diagnostic et traitement sous forme de rectangles arrondis
- Suppression de l'affichage des pourcentages et barres de progression pour les diagnostics
- Simplification de l'interface : mise en page sur une seule colonne pour une meilleure lisibilité
- Amélioration de l'UX avec un affichage cohérent des résultats sous forme de badges

### Supprimé
- Colonne latérale droite pour les résultats (diagnostics et traitements intégrés au flux principal)
- Barres de progression et pourcentages dans l'affichage des diagnostics

## [0.2.0] - 2025-10-05

### Modifié
- Simplification de l'interface utilisateur pour se concentrer uniquement sur le module de consultation
- Remplacement de l'intégration Firebase par des données prédéfinies pour les patients

### Supprimé
- Authentification Firebase pour les médecins
- Routes et composants protégés non liés à la consultation
- Dépendance à Firestore pour la recherche de patients
- Fonctionnalités du Dashboard non développées

## [0.1.0] - 2025-10-05

### Ajouté
- Interface de consultation médicale pour les médecins
- Système de prédiction de maladies basé sur :
  - Antécédents médicaux du patient
  - Symptômes actuels avec options de détails
  - Résultats d'analyses médicales
  - Historique des maladies récentes
- Backend FastAPI avec endpoints :
  - `/diagnostic` : Calcul des probabilités de maladies
  - `/predict-treatment` : Recommandation de traitement et posologie
- Architecture modulaire de prédiction :
  - Catégories de maladies (infectieuses, inflammatoires, métaboliques)
  - Scoring par catégorie avec seuil de 30%
  - Scoring individuel pour Malaria et Dengue
  - Calculateurs de traitement pour Malaria et Dengue
- Authentification Firebase pour les médecins
- Recherche de patients par numéro CMU via Firestore
- Interface React avec :
  - Sélecteur de symptômes
  - Sélecteur d'analyses médicales
  - Sélecteur d'antécédents
  - Historique des maladies
  - Affichage des risques de maladies
  - Composant de traitement
- Visualisation des résultats de diagnostic
- Design responsive avec Tailwind CSS et Material-UI
- Routage avec React Router v6

### Technique
- Frontend : React 18, Material-UI, Tailwind CSS, Firebase
- Backend : Python FastAPI, Pydantic, Uvicorn
- Middleware CORS configuré pour le développement
