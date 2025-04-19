import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  User, 
  Users, 
  FileText, 
  Briefcase,
  Home,
  GraduationCap,
  Book,
  UserPlus,
  CircleUser,
  FileOutput,
  FileArchive,
  ChevronRight,
  Lightbulb,
  LineChart
} from "lucide-react";

import "../layout/layout.css";

export default function Sidebar({ isOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [openSubMenus, setOpenSubMenus] = useState({
    stagiaires: false,
    documents: false
  });

  // Initialize submenus based on current route
  useEffect(() => {
    if (["/stagiaires", "/apprentis"].includes(location.pathname)) {
      setOpenSubMenus(prev => ({ ...prev, stagiaires: true }));
    }
    if (["/documents/circulation", "/documents/generation"].includes(location.pathname)) {
      setOpenSubMenus(prev => ({ ...prev, documents: true }));
    }
  }, [location.pathname]);

  const handleParentClick = (menu, defaultPath) => {
    // Toggle submenu
    setOpenSubMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
    
    // If submenu is closed and we're opening it, navigate to default child
    if (!openSubMenus[menu]) {
      navigate(defaultPath);
    }
  };

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
        
        {/* Stagiaire submenu */}
        <div className="has-submenu">
          <div 
            className={`menu-item ${["/stagiaires", "/apprentis", "/stagiaire-apprenti"].includes(location.pathname) ? "active" : ""}`}
            onClick={() => handleParentClick('stagiaires', '/stagiaires')}
            style={{ cursor: 'pointer' }}
          >
            <Users size={20} /> <span>Stagiaire/Apprenti</span>
            <button 
              className={`toggle-submenu ${openSubMenus.stagiaires ? 'open' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setOpenSubMenus(prev => ({
                  ...prev,
                  stagiaires: !prev.stagiaires
                }));
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <div className={`submenu ${openSubMenus.stagiaires ? 'open' : ''}`}>
            <Link to="/stagiaires" className={`submenu-item ${location.pathname === "/stagiaires" ? "active" : ""}`}>
              <GraduationCap size={16} /> <span>Stagiaire</span>
            </Link>
            <Link to="/apprentis" className={`submenu-item ${location.pathname === "/apprentis" ? "active" : ""}`}>
              <Book size={16} /> <span>Apprenti</span>
            </Link>
          </div>
        </div>
        
        {/* Documents submenu */}
        <div className="has-submenu">
          <div 
            className={`menu-item ${["/documents", "/documents/circulation", "/documents/generation"].includes(location.pathname) ? "active" : ""}`}
            onClick={() => handleParentClick('documents', '/documents/circulation')}
            style={{ cursor: 'pointer' }}
          >
            <FileText size={20} /> <span>Documents</span>
            <button 
              className={`toggle-submenu ${openSubMenus.documents ? 'open' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setOpenSubMenus(prev => ({
                  ...prev,
                  documents: !prev.documents
                }));
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <div className={`submenu ${openSubMenus.documents ? 'open' : ''}`}>
            <Link to="/documents/circulation" className={`submenu-item ${location.pathname === "/documents/circulation" ? "active" : ""}`}>
              <FileOutput size={16} /> <span>Circulation</span>
            </Link>
            <Link to="/documents/generation" className={`submenu-item ${location.pathname === "/documents/generation" ? "active" : ""}`}>
              <FileArchive size={16} /> <span>Génération</span>
            </Link>
          </div>
        </div>
        
        <Link to="/themes" className={`menu-item ${location.pathname === "/themes" ? "active" : ""}`}>
          <Lightbulb size={20} /> <span>Thèmes</span>
        </Link>
        
        <Link to="/encadreurs" className={`menu-item ${location.pathname === "/encadreurs" ? "active" : ""}`}>
          <CircleUser size={20} /> <span>Encadreurs</span>
        </Link>
        
        <Link to="/emploi" className={`menu-item ${location.pathname === "/emploi" ? "active" : ""}`}>
          <LineChart size={20} /> <span>Emploi</span>
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