import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  User,
  Users,
  FileText,
  Briefcase,
  GraduationCap,
  Book,
  CircleUser,
  ChevronRight,
  Lightbulb,
  LineChart,
  Calendar,
  Send,
  Bell
} from "lucide-react";

import "../layout/layout.css";

export default function Sidebar({ isOpen, setIsSidebarOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [openSubMenus, setOpenSubMenus] = useState({
    stagiaires: false,
    documents: false,
    circulation: false
  });

  useEffect(() => {
    if (["/stagiaires", "/apprentis"].includes(location.pathname)) {
      setOpenSubMenus((prev) => ({ ...prev, stagiaires: true }));
    }
    if (["/documents/circulation", "/documents/generation"].includes(location.pathname)) {
      setOpenSubMenus((prev) => ({ ...prev, documents: true }));
    }
    if (["/documents/circulation/envoi", "/documents/circulation/notification"].includes(location.pathname)) {
      setOpenSubMenus((prev) => ({ ...prev, circulation: true, documents: true }));
    }
  }, [location.pathname]);

  const handleLinkClick = () => {
    setIsSidebarOpen(false);
  };

  const handleParentClick = (menu, defaultPath) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu]
    }));

    if (!openSubMenus[menu]) {
      navigate(defaultPath);
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className={`sidebar ${!isOpen ? "closed" : ""}`} onClick={(e) => e.stopPropagation()}>
      {isOpen && (
        <h2 className="sidebar-title">Gestion de Stagiaires</h2>
      )}
      <nav className="sidebar-menu">

        <Link to="/statistiques" className={`menu-item ${location.pathname === "/statistiques" ? "active" : ""}`} onClick={handleLinkClick}>
          <LineChart size={20} /> {isOpen && <span>Statistiques</span>}
        </Link>

        {/* Stagiaire / Apprenti */}
        <div className="has-submenu">
          <div
            className={`menu-item ${["/stagiaires", "/apprentis"].includes(location.pathname) ? "active" : ""}`}
            onClick={() => handleParentClick("stagiaires", "/stagiaires")}
            style={{ cursor: "pointer" }}
          >
            <Users size={20} /> {isOpen && <span>Stagiaire/Apprenti</span>}
            {isOpen && (
              <button
                className={`toggle-submenu ${openSubMenus.stagiaires ? "open" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenSubMenus((prev) => ({
                    ...prev,
                    stagiaires: !prev.stagiaires
                  }));
                }}
              >
                <ChevronRight size={18} />
              </button>
            )}
          </div>
          {isOpen && (
            <div className={`submenu ${openSubMenus.stagiaires ? "open" : ""}`}>
              <Link to="/stagiaires" className={`submenu-item ${location.pathname === "/stagiaires" ? "active" : ""}`} onClick={handleLinkClick}>
                <GraduationCap size={16} /> <span>Stagiaire</span>
              </Link>
              <Link to="/apprentis" className={`submenu-item ${location.pathname === "/apprentis" ? "active" : ""}`} onClick={handleLinkClick}>
                <Book size={16} /> <span>Apprenti</span>
              </Link>
            </div>
          )}
        </div>

        <Link to="/stage" className={`menu-item ${location.pathname === "/stage" ? "active" : ""}`} onClick={handleLinkClick}>
          <Briefcase size={20} /> {isOpen && <span>Stage</span>}
        </Link>


        <Link to="/encadreurs" className={`menu-item ${location.pathname === "/encadreurs" ? "active" : ""}`} onClick={handleLinkClick}>
          <CircleUser size={20} /> {isOpen && <span>Encadreurs</span>}
        </Link>

        <Link to="/themes" className={`menu-item ${location.pathname === "/themes" ? "active" : ""}`} onClick={handleLinkClick}>
          <Lightbulb size={20} /> {isOpen && <span>Thèmes</span>}
        </Link>

        {/* Ajout du champ Emploi du temps avant Profil */}
        <Link to="/emploi-du-temps" className={`menu-item ${location.pathname === "/emploi-du-temps" ? "active" : ""}`} onClick={handleLinkClick}>
          <Calendar size={20} /> {isOpen && <span>Emploi du temps</span>}
        </Link>


      </nav>
      {isOpen && (
        <div className="sidebar-footer">
          <p>Sonatrach - 2025</p>
        </div>
      )}
    </div>
  );
}