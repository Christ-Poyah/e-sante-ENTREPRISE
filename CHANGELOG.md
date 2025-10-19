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

## [2.3.0]

### Ajouté
- Je veux pouvoir que au fur et à mésure que les symptômes et antécédent sont saisi, faire des suggestions d'analyse également. Quand une est selectionner, on offre la lattidue à l'agent de santé de glissez une capture de l'analyse (photo) cella est pris en compte dans la détection de la pathologie finale.

### Modifié
- Aucun

### Supprimé
- Aucun

## [2.2.0]

### Ajouté
- Je veux que lors de la sélections des médicaments, si jamais deux médicaments ne match pas entre eux ou avec le patient, l'IA alerte en changeant la couleur du contour par une couleur rouge et en disant pourquoi il pense que cela ne match pas au travers d'un formatage correcte. On peut supposer un i qui apparaitrai sous forme de bouton arrondi et au survole de celui ci on voit une bulle avec l'explication.

### Modifié
- Aucun

### Supprimé
- Aucun

## [2.1.0]

### Ajouté
- Je veux que pour chaque diagnotics émis par l'IA l'agent de santé ait la possibilité de consulter rapidement en des terme conçis, pourquoi l'IA pense à tel ou tel diagnostics.

### Modifié
- Aucun

### Supprimé
- Aucun

## [2.0.0]

### Ajouté
- Remplacer la logique backend avec le calule qui est fait manuellement par une api IA, celle de gemini 2.5 pro dont voici la clé : AIzaSyABOwd82vaMzXzJgiPtxCHrCE9Xa2itRFA

- Le modèle sera chargé à la place du système de calcule existant de recevoir les informations du patients les données de diagnostics et de médicaments suggérer avec les coût des médicaments à l'appuie. Ces données devrons être donc correctement formaté pour matcher avec le système existant.

- Il devra se basé sur toute les informations disponible (symptômes, spécificité du patient, analyse, conetexte ivoirien vu qu'on est à Abidjan, saison (en saison des pluie comme cela y'a plus de moustique), mais aussi et sur l'historique du patient, c'est à dire les maladies qu'il a déjà eu. Bref tous comme un expert en medecine)

### Modifié
- L'ordonnace ne sera pas générer automatiquement avec toutes les suggestions de médicaments et diganostics. C'est diagnostics apparaitrons sous forme grisé par exemple et l'agent de santé n'aura plus qu'à cliquer sur un ou plusieur pour établir son dignostics, parreil avec les médicaments.

### Supprimé
- Aucun

## [1.2.0]

### Ajouté
- Rajoute toujours en bas de la section de diagnostic une dédié au médicament recommandé

### Modifié
- Aucun

### Supprimé
- Aucun

## [1.1.0]

### Ajouté
- Rajute une sidebar au tout debut avec l'ongle consultation séléctionner par défaut, c'est dans cet onglet qu'on aura le champs de saisi de l'identifiant CMU et une fois celui ci charger on verra les sections principales appraitre. La side bar doit donc pouvoir être pliable automatiquement et ce plier automatiquement une fois la CMU chargé ce qui laissera suffisament de place pour les sections qui suivent.

### Modifié
- La section concernant les diagnostics et le bouton de génération de rapport doivent être en permanance visible

### Supprimé
- Supprime le header qui contient tous ces détails : E-SANTE - Consultation Médicale
Système d'aide au diagnostic médical


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
