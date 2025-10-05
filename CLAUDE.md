# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

E-SANTE is a healthcare diagnostic system consisting of a React frontend and Python FastAPI backend. The application helps doctors perform medical consultations by analyzing symptoms, medical analyses, patient history, and recent diseases to predict disease probabilities and recommend treatments.

## Architecture

### Frontend (React)
- **Framework**: React 18 with React Router v6
- **UI Libraries**: Material-UI (@mui/material), Tailwind CSS, shadcn-ui, Lucide React icons
- **Authentication**: Firebase Authentication with Firestore for doctor profiles
- **State Management**: React Context API (AuthContext)
- **Key Structure**:
  - `/src/pages/`: Top-level page components (Dashboard, NewConsultation, LoginPage)
  - `/src/components/`: Reusable components organized by feature (auth, consultation)
  - `/src/contexts/`: Context providers for global state (AuthContext)
  - `/src/hooks/`: Custom React hooks (useAuth)
  - `/src/routes/`: Route configuration with protected routes
  - `/src/layouts/`: Layout components (MainLayout with Sidebar)
  - `/src/config/`: Configuration files including Firebase setup

### Backend (Python FastAPI)
- **Framework**: FastAPI with Pydantic models
- **Architecture Pattern**: Modular disease prediction system
- **Key Structure**:
  - `/backend/app.py`: Main FastAPI application with CORS middleware
  - `/backend/prediction/`: Core prediction module
    - `predictor.py`: Orchestrates disease category scoring and individual disease predictions
    - `treatment_predictor.py`: Maps diagnoses to treatments and posology
    - `/categories/`: Category-level scoring (infectious, inflammatory, metabolic)
    - `/diseases/`: Disease-specific scoring organized by category (e.g., infectious/malaria.py, infectious/dengue.py)
    - `/treatments/`: Treatment calculators organized by category (e.g., infectious/malaria_treatment.py)

### Disease Prediction Flow
1. Category scoring: Calculate score for disease categories (infectious, inflammatory, metabolic)
2. Threshold filtering: Only categories with >30% score proceed to disease-level analysis
3. Disease scoring: Calculate individual disease probabilities within qualifying categories
4. Treatment recommendation: Once diagnosis selected, retrieve treatment and posology

## Development Commands

### Frontend
```bash
cd frontend
npm install          # Install dependencies
npm start            # Start dev server (http://localhost:3000)
npm run build        # Production build
npm test             # Run tests
```

### Backend
```bash
cd backend
pip install fastapi uvicorn pydantic  # Install dependencies
python app.py                          # Start server (http://localhost:8001)
# Or: uvicorn app:app --host 0.0.0.0 --port 8001 --reload
```

## API Endpoints

### POST /diagnostic
Analyzes patient data and returns disease probability scores.

**Request Body**:
```json
{
  "medicalHistory": [{"name": "string", "details": [...]}],
  "symptoms": [{"name": "string", "details": [...]}],
  "analyses": [{"name": "string", "result": "...", "resultType": "...", "unit": "...", "threshold": 0}],
  "recentDiseases": [{"name": "string", "date": 0}]
}
```

**Response**:
```json
{
  "diagnostics": [
    {"id": 1, "disease": "Malaria", "probability": 75.5},
    {"id": 2, "disease": "Dengue", "probability": 45.2}
  ]
}
```

### POST /predict-treatment
Returns treatment and posology for a selected diagnosis.

**Parameters**: `diagnostic` (query or body), plus same input data as `/diagnostic`

**Response**:
```json
{
  "diagnostic": "Malaria",
  "treatment": "Artemisinin-based combination therapy",
  "posology": "Take twice daily for 3 days"
}
```

## Firebase Configuration

The application uses Firebase for:
- **Authentication**: Doctor login via email/password
- **Firestore Collections**:
  - `doctors`: Doctor profiles linked to Firebase Auth UIDs
  - `patients`: Patient records searchable by CMU number

**Note**: Firebase config is currently hardcoded in `frontend/src/config/firebase.jsx`. Consider moving to environment variables for production.

## Authentication Flow

1. Doctor logs in via `/login` with email/password
2. Firebase Auth validates credentials
3. System checks for doctor profile in Firestore `doctors` collection
4. If no doctor profile exists, user is signed out (not authorized)
5. Protected routes use `ProtectedRoute` wrapper that checks auth state
6. `useAuth` hook provides `{ user, loading, error, login, logout }`

## Adding New Diseases

To add a new disease to the prediction system:

1. **Add category scorer** (if new category): Create `backend/prediction/categories/{category_name}.py`
2. **Create disease scorer**: Create `backend/prediction/diseases/{category}/{disease_name}.py` with `calculate_{disease}_score()` function
3. **Create treatment calculator**: Create `backend/prediction/treatments/{category}/{disease}_treatment.py` with `calculate_{disease}_treatment()` function
4. **Update predictor.py**: Import and call category/disease scorers in `predict_disease_scores()`
5. **Update treatment_predictor.py**: Add condition for new disease in `predict_treatments()`

## Frontend Consultation Workflow

Located in `frontend/src/pages/consultation/NewConsultation.jsx`:

1. **PatientSearch**: Search for patient by CMU number (queries Firestore)
2. **ConsultationHeader**: Display patient info and consultation metadata
3. **AntecedentSelector**: Collect medical history with details
4. **SymptomSelector**: Collect symptoms with configurable detail options
5. **DiseaseHistory**: Record recent diseases
6. **AnalysisSelector**: Input medical test results (numeric/text with thresholds)
7. **DiagnosticComponent**: Send data to `/diagnostic` endpoint, display results
8. **DiseaseRiskDisplay**: Visualize disease probabilities
9. **TreatmentComponent**: Select diagnosis, fetch treatment from `/predict-treatment`

## Important Conventions

- **Python imports**: Use absolute imports from `prediction.` package
- **React components**: Use functional components with hooks
- **File naming**: PascalCase for React components, snake_case for Python modules
- **Data models**: Define Pydantic models in `backend/app.py` for API contracts
- **CORS**: Backend allows all origins (`allow_origins=["*"]`) - restrict in production
- **Error handling**: FastAPI endpoints use HTTPException for errors
- **Route protection**: All routes except `/login` require authentication via Firebase

## Key Files to Understand

- `backend/app.py`: API entry point, route definitions, data models
- `backend/prediction/predictor.py`: Core disease prediction orchestration
- `frontend/src/routes/AppRoutes.jsx`: Route configuration and protection logic
- `frontend/src/hooks/useAuth.js`: Authentication state management
- `frontend/src/pages/consultation/NewConsultation.jsx`: Main consultation interface
