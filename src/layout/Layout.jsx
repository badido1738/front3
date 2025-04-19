import { useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./layout.css";

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
 /* const location = useLocation();*/

  // Je recommande de supprimer cet effet pour éviter des comportements surprenants
  // lors de la navigation entre les pages

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