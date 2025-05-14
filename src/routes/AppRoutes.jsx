import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../layout/Layout"; 
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
export default function AppRoutes() {
  return (
    <Layout>
      <Routes>
       <Route path="/" element={<Navigate to="/statistiques" replace />}/>
        <Route path="/statistiques" element={<StatApp />} />
        <Route path="profile" element={<ProfilePage />} />
        
        {/* Routes pour stagiaires et apprentis */}
        <Route path="stagiaire-apprenti" element={<Navigate to="/stagiaires" replace />} />
        <Route path="stagiaires" element={<StagiairesPage />} />
        <Route path="apprentis" element={<ApprentisPage />} />
        
        {/* Routes pour documents */}
        <Route path="documents" element={<Navigate to="/documents/circulation" replace />} />
        <Route path="documents/circulation" element={<DocumentsCirculation />} />
        <Route path="documents/circulation/envoi" element={<EnvoiPage />} /> 
        <Route path="documents/historique" element={<HistoriquePage />} />
        <Route path="documents/circulation/notification" element={<NotificationPage />} /> 
        <Route path="documents/generation" element={<DocumentsGeneration />} />
        
        
        {/* Routes pour thèmes et encadreurs */}
        <Route path="themes" element={<ThemesPage />} />
        <Route path="theme-form" element={<ThemesForm />} />
        <Route path="encadreurs" element={<EncadreursPage />} />
        <Route path="encadreur-form" element={<EncadreursForm />} />
        
        {/* Autres routes */}
        <Route path="/emploi-du-temps" element={<EmploiPage />} />
        <Route path="fiche-position" element={<FichePositionForm />} />
        <Route path="stage" element={<StagePage />} />
      </Routes>
    </Layout>
  );
}