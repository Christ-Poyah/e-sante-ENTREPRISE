import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import NewConsultation from '../pages/consultation/NewConsultation';
import LoginPage from '../pages/auth/LoginPage';
import { useAuth } from '../hooks/useAuth';

// Composant pour protéger les routes
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Vous pouvez remplacer par votre propre composant de chargement
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Composant pour les routes publiques (empêche l'accès si déjà connecté)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return children;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Route de connexion */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* Routes protégées avec MainLayout */}
      <Route
        path="/"
        element={
            <MainLayout />
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="consultation/new" element={<NewConsultation />} />
      </Route>

      {/* Redirection des routes inconnues vers la page d'accueil */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}