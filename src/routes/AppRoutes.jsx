import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Layout from "../layout/Layout"; 
import LayoutAgent from "../layout/LayoutAgent"; 
import LayoutSousAdmin from "../layout/LayoutSousAdmin"; 

import Auth from "../pages/Auth";
import StatApp from "../pages/StatApp";
import Month from "../pages/Month";
import Etab from "../pages/Etab";
import Dir from "../pages/Dir";
import Enca from "../pages/Enca";
import ProfilePage from "../pages/ProfilePage";
import StagiairesPage from "../pages/StagiairesPage";
import ApprentisPage from "../pages/ApprentisPage";
import StagePage from "../pages/StagePage";
import DocumentsCirculation from "../form/DocumentsCirculation";
import DocumentsGeneration from "../form/DocumentsGeneration";
import EnvoiPage from "../pages/EnvoiPage"; 
import ThemesPage from "../pages/ThemesPage";
import ThemesForm from "../form/ThemesForm";
import EncadreursPage from "../pages/EncadreursPage";
import EncadreursForm from "../form/EncadreursForm";
import EmploiForm from "../form/EmploiForm";
import FichePositionForm from "../form/FichePositionForm";
import EmploiPage from "../pages/EmploiPage";
import HistoriquePage from "../pages/HistoriquePage";
import NotificationPage from "../pages/NotificationPage";

// Layout Wrapper Component that selects the appropriate layout based on user role
function RoleBasedLayout({ children }) {
  const userRole = localStorage.getItem('role');
  
  switch(userRole) {
    case 'ROLE_admin':
      return <Layout>{children}</Layout>;
    case 'ROLE_agentCirculation':
      return <LayoutAgent>{children}</LayoutAgent>;
    case 'ROLE_sousAdmin':
      return <LayoutSousAdmin>{children}</LayoutSousAdmin>;
    default:
      // Fallback to default layout if role is not recognized
      return <Layout>{children}</Layout>;
  }
}

// Private Route Component with role-based access control
function PrivateRoute({ children, allowedRoles = [] }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  
  // No token means not logged in
  if (!token) {
    return <Navigate to="/" replace />;
  }
  
  // If roles are specified, check if user has permission
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // User doesn't have required role, redirect to statistics (or another suitable page)
    return <Navigate to="/statistiques" replace />;
  }
  
  // User is authenticated and has permission
  return children;
}

// Auth Check Component (handles redirection after login)
function AuthCheck() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      // Log that redirect is happening
      console.log("Token found in localStorage, redirecting to /statistiques");
      navigate('/statistiques', { replace: true });
    } else {
      // If no token, redirect back to login
      console.log("No token found, redirecting to login");
      navigate('/', { replace: true });
    }
  }, [token, navigate]);

  return <div>Vérification de l'authentification...</div>;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Auth />} />
      
      {/* Auth check route */}
      <Route path="/auth-check" element={<AuthCheck />} />
      
      {/* Protected Routes */}
      <Route path="/*" element={
        <PrivateRoute>
          <RoleBasedLayout>
            <Routes>
              <Route path="/statistiques" element={<StatApp />} />
              <Route path="/profile" element={<ProfilePage />} />
              
              {/* Routes pour stagiaires et apprentis */}
              <Route path="/stagiaire-apprenti" element={<Navigate to="/stagiaires" replace />} />
              <Route path="/stagiaires" element={<StagiairesPage />} />
              <Route path="/apprentis" element={<ApprentisPage />} />
              
              {/* Routes pour documents */}
              <Route path="/documents" element={<Navigate to="/documents/circulation" replace />} />
              <Route path="/documents/circulation" element={<DocumentsCirculation />} />
              <Route path="/documents/circulation/envoi" element={<EnvoiPage />} />
              <Route path="/documents/historique" element={<HistoriquePage />} />
              <Route path="/documents/circulation/notification" element={<NotificationPage />} />
              <Route path="/documents/generation" element={<DocumentsGeneration />} />
              
              {/* Routes pour thèmes et encadreurs - Admin only */}
              <Route path="/themes" element={
                <PrivateRoute allowedRoles={['ROLE_admin', 'RESPONSABLE']}>
                  <ThemesPage />
                </PrivateRoute>
              } />
              <Route path="/theme-form" element={
                <PrivateRoute allowedRoles={['ROLE_admin', 'RESPONSABLE']}>
                  <ThemesForm />
                </PrivateRoute>
              } />
              <Route path="/encadreurs" element={<EncadreursPage />} />
              <Route path="/encadreur-form" element={<EncadreursForm />} />
              
              {/* Autres routes */}
              <Route path="/emploi-du-temps" element={<EmploiPage />} />
              <Route path="/fiche-position" element={<FichePositionForm />} />
              <Route path="/stage" element={<StagePage />} />
              
              {/* Default redirect for protected area */}
              <Route index element={<Navigate to="/statistiques" replace />} />
              
              {/* Catch any other routes and redirect */}
              <Route path="*" element={<Navigate to="/statistiques" replace />} />
            </Routes>
          </RoleBasedLayout>
        </PrivateRoute>
      } />
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}