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

## [3.0.0]

### Ajouté
- Je veux un système de gestion d'authentifacation, de création de compte et donc de gestion de compte, cela devra dans un premier temps nous permettre de créer un médecin généraliste et donc qu'il puisse importer des éléments comme sa signature, son nom etc éléments qui apparaitrons sur les ordonnaces qu'il délivrera

- Tous ceci sera relier à une base de données supabase donc si jamais je te ne l'ai pas fourni rappel moi

- Créer donc les tables nécéssaires pour que nous puissions avoir un système fonctionelle et doté d'une base de données.

### Modifié
- Aucun

### Supprimé
- Aucun

## [2.5.0] - Sécurité

### Ajouté
- Aucun

### Modifié
- enlever la clé API

### Supprimé
- Aucun

## [2.4.0] - Design

### Ajouté
- Aucun

### Modifié
- 

### Supprimé
- Aucun


## [2.3.0] - FAIT ✓

### Ajouté
- Je veux pouvoir que au fur et à mésure que les symptômes et antécédent sont saisi, faire des suggestions d'analyse également. Quand une est selectionner, on offre la lattidue à l'agent de santé de glissez une capture de l'analyse (photo) cella est pris en compte dans la détection de la pathologie finale.

### Modifié
- Aucun

### Supprimé
- Aucun

## [2.2.0] - FAIT ✓

### Ajouté
- ✅ Validation des interactions médicamenteuses en temps réel via Gemini AI
- ✅ Module backend `gemini_compatibility.py` pour analyse des incompatibilités
- ✅ Endpoint API `/check-medication-compatibility`
- ✅ Détection automatique des interactions médicament-médicament
- ✅ Détection des contre-indications patient (âge, antécédents)
- ✅ Alertes visuelles avec borders colorées:
  - Rouge: Risque élevé (high)
  - Orange: Risque modéré (medium)
  - Jaune: Attention (low)
- ✅ Icône d'alerte (AlertCircle) à côté des médicaments incompatibles
- ✅ Tooltip détaillé au survol avec:
  - Niveau de gravité (🔴 🟠 🟡)
  - Médicaments concernés
  - Raison de l'incompatibilité
  - Recommandations de l'IA
- ✅ Vérification automatique à chaque changement de sélection (useEffect)
- ✅ Format d'explication clair et concis pour les agents de santé

### Modifié
- ✅ `MedicationSuggestion.jsx`: Ajout états warnings et logique d'affichage
- ✅ Borders dynamiques selon le niveau de risque détecté
- ✅ Integration avec `patientInfo` pour validation contextuelle

### Supprimé
- Aucun

### Tests Playwright Effectués
- ✅ Sélection de 3 médicaments (Artésunate + Ibuprofène + Ciprofloxacine)
- ✅ Détection de 2 warnings par l'IA Gemini
- ✅ Affichage des icônes d'alerte sur les 3 médicaments concernés
- ✅ Borders oranges appliquées (risque modéré)
- ✅ Tooltip affiché au survol avec détails complets:
  - Warning #1: Ciprofloxacine + Amodiaquine (risque QT/arythmie)
  - Warning #2: Ibuprofène + Amodiaquine (risque gastro-intestinal)
- ✅ Screenshots sauvegardés:
  - `.playwright-mcp/medication-warnings-v2.2.0.png`
  - `.playwright-mcp/medication-warning-tooltip-v2.2.0.png`

## [2.1.0] - FAIT ✓

### Ajouté
- ✅ Affichage des explications des diagnostics au survol (tooltip)
- ✅ Chaque diagnostic montre pourquoi l'IA l'a suggéré (symptômes, analyses, probabilité)
- ✅ Format concis et clair pour les agents de santé

### Modifié
- Aucun

### Supprimé
- Aucun

## [2.0.0] - FAIT ✓

### Ajouté
- ✅ Intégration complète de l'API Gemini 2.5 Pro (modèle: gemini-2.0-flash-exp)
- ✅ Module backend `gemini_predictor.py` avec prompts médicaux contextualisés
- ✅ Prise en compte du contexte ivoirien (Abidjan, saison des pluies/sèche)
- ✅ Analyse basée sur symptômes, analyses, antécédents, historique patient
- ✅ Suggestions de diagnostics avec probabilités et explications
- ✅ Suggestions de médicaments avec coûts en FCFA
- ✅ Interface de sélection cliquable pour diagnostics (badges gris → bleu)
- ✅ Interface de sélection cliquable pour médicaments (cards gris → bleu)
- ✅ Affichage coût individuel par médicament
- ✅ Calcul automatique du coût total en temps réel
- ✅ Ordonnance finale avec coût total estimé
- ✅ Système de fallback (calcul manuel si Gemini échoue)
- ✅ Configuration sécurisée (.env avec API key)

### Modifié
- ✅ Diagnostics et médicaments non sélectionnés par défaut (gris)
- ✅ Agent de santé clique pour sélectionner (un ou plusieurs)
- ✅ Bouton "Générer ordonnance" activé uniquement si sélections
- ✅ Endpoints API modifiés pour Gemini avec fallback

### Supprimé
- Aucun

### Tests Playwright Effectués
- ✅ Chargement patient (CMU123456 - Jean Dupont, 45 ans)
- ✅ Ajout symptômes → Déclenchement IA Gemini
- ✅ Réception 4 diagnostics avec probabilités (Paludisme 85%, Dengue 60%, etc.)
- ✅ Réception 10 médicaments avec coûts FCFA
- ✅ Sélection diagnostic "Paludisme (Malaria)" → Passage en bleu
- ✅ Sélection 3 médicaments → Calcul coût total 3,000 FCFA
- ✅ Génération ordonnance complète avec tous les détails
- ✅ Screenshot sauvegardé: `.playwright-mcp/ordonnance-complete-v2.0.0.png`

## [1.2.0] - FAIT ✓

### Ajouté
- ✅ Section médicaments recommandés en bas de la section diagnostic

### Modifié
- Aucun

### Supprimé
- Aucun

## [1.1.0] - FAIT ✓

### Ajouté
- ✅ Sidebar pliable avec onglet consultation par défaut
- ✅ Champ de saisie CMU dans la sidebar
- ✅ Collapse automatique de la sidebar après chargement patient

### Modifié
- ✅ Section diagnostics et bouton génération toujours visibles

### Supprimé
- ✅ Header "E-SANTE - Consultation Médicale" supprimé


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
