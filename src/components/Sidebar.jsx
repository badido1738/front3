import { Link, useLocation } from "react-router-dom";
import { 
  User, 
  Users, 
  FileText, 
  ClipboardList, 
  Briefcase,
  LogIn,
  Home
} from "lucide-react";

import "../layout/layout.css";

export default function Sidebar({ isOpen }) {
  const location = useLocation();

  return (
    <div className={`sidebar ${!isOpen ? 'closed' : ''}`}>
     
      <h2 className="sidebar-title">Gestion de Stagiaires</h2>
      <nav className="sidebar-menu">
        <Link to="/" className={`menu-item ${location.pathname === "/" ? "active" : ""}`}>
          <Home size={20} /> <span>Accueil</span>
        </Link>
        <Link to="/profile" className={`menu-item ${location.pathname === "/profile" ? "active" : ""}`}>
          <User size={20} /> <span>Profil</span>
        </Link>
        <Link to="/Authentification" className={`menu-item ${location.pathname === "/Authentification" ? "active" : ""}`}>
           <LogIn size={20} /> <span>Authentification</span>
        </Link>
        <Link to="/stagiaire" className={`menu-item ${location.pathname === "/stagiaire" ? "active" : ""}`}>
          <Users size={20} /> <span>Stagiaire / Apprenti</span>
        </Link>
        <Link to="/documents" className={`menu-item ${location.pathname === "/documents" ? "active" : ""}`}>
          <FileText size={20} /> <span>Documents</span>
        </Link>
        <Link to="/fiche-position" className={`menu-item ${location.pathname === "/fiche-position" ? "active" : ""}`}>
          <ClipboardList size={20} /> <span>Fiche de Position</span>
        </Link>
        <Link to="/stage" className={`menu-item ${location.pathname === "/stage" ? "active" : ""}`}>
          <Briefcase size={20} /> <span>Stage</span>
        </Link>
      </nav>
      <div className="sidebar-footer">
        <p>Sonatrach - 2025</p>
      </div>
    </div>
  );
}