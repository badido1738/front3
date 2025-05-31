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
        {/* Documents */}
        <div className="has-submenu">
          <div
            className={`menu-item ${["/documents/circulation", "/documents/circulation/envoi", "/documents/circulation/notification"].includes(location.pathname) ? "active" : ""}`}
            onClick={() => handleParentClick("documents", "/documents/circulation")}
            style={{ cursor: "pointer" }}
          >
            <FileText size={20} /> {isOpen && <span>Documents</span>}
            {isOpen && (
              <button
                className={`toggle-submenu ${openSubMenus.documents ? "open" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenSubMenus((prev) => ({
                    ...prev,
                    documents: !prev.documents
                  }));
                }}
              >
                <ChevronRight size={18} />
              </button>
            )}
          </div>
          {isOpen && (
            <div className={`submenu ${openSubMenus.documents ? "open" : ""}`}>
              {/* Menu Circulation avec sous-menus */}
              <div className="has-submenu">
                <div
                  className={`submenu-item ${["/documents/circulation", "/documents/circulation/envoi", "/documents/circulation/notification"].includes(location.pathname) ? "active" : ""}`}
                  onClick={() => handleParentClick("circulation", "/documents/circulation")}
                  style={{ cursor: "pointer" }}
                >
                  <FileText size={16} /> <span>Circulation</span>
                  <button
                    className={`toggle-submenu ${openSubMenus.circulation ? "open" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenSubMenus((prev) => ({
                        ...prev,
                        circulation: !prev.circulation
                      }));
                    }}
                    style={{ position: "absolute", right: "5px" }}
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
                <div className={`submenu ${openSubMenus.circulation ? "open" : ""}`} style={{ marginLeft: "15px" }}>
                  <Link 
                    to="/documents/circulation/envoi" 
                    className={`submenu-item ${location.pathname === "/documents/circulation/envoi" ? "active" : ""}`} 
                    onClick={handleLinkClick}
                    style={{ fontSize: "0.85rem" }}
                  >
                    <Send size={14} /> <span>Envoi</span>
                  </Link>
                  <Link 
                    to="/documents/circulation/notification" 
                    className={`submenu-item ${location.pathname === "/documents/circulation/notification" ? "active" : ""}`} 
                    onClick={handleLinkClick}
                    style={{ fontSize: "0.85rem" }}
                  >
                    <Bell size={14} /> <span>Notification</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
      {isOpen && (
        <div className="sidebar-footer">
          <p>Sonatrach - 2025</p>
        </div>
      )}
    </div>
  );
}