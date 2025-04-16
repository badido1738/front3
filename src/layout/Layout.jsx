import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./layout.css";

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  // Masquer automatiquement la sidebar quand on navigue vers un formulaire
  useEffect(() => {
    const path = location.pathname;
    // Si on n'est pas sur la page d'accueil, fermer la sidebar
    if (path !== "/") {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  return (
    <div className="layout-container">
      <Sidebar isOpen={isSidebarOpen} />
      <div className={`content-area ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}