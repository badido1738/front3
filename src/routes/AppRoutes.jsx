
import { Routes, Route } from "react-router-dom";
import Layout from "../layout/Layout"; 
import Home from "../pages/Home";
import ProfileForm from "../form/ProfileForm";
import StagiaireForm from "../form/StagiaireForm";
import DocumentsForm from "../form/DocumentsForm";
import FichePositionForm from "../form/FichePositionForm";
import StageForm from "../form/StageForm";
import Authentification from "../pages/Authentification";

export default function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route index element={<Home />} />
        <Route path="profile" element={<ProfileForm />} />
        <Route path="authentification" element={<Authentification />} />
        <Route path="stagiaire" element={<StagiaireForm />} />
        <Route path="documents" element={<DocumentsForm />} />
        <Route path="fiche-position" element={<FichePositionForm />} />
        <Route path="stage" element={<StageForm />} />
      </Routes>
    </Layout>
  );
}