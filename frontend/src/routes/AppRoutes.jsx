import { Routes, Route, Navigate } from 'react-router-dom';
import NewConsultation from '../pages/consultation/NewConsultation';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Route principale - Consultation */}
      <Route path="/" element={<NewConsultation />} />

      {/* Redirection des routes inconnues vers la page d'accueil */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}