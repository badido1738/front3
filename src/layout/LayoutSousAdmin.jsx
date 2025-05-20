import { useState } from "react";
import { useLocation } from "react-router-dom";
import SidebarSousAdmin from "../components/SidebarSousAdmin";
import Header from "../components/Header";
import "./layout.css";

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleClickOutsideSidebar = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="layout-container" onClick={handleClickOutsideSidebar}>
      <SidebarSousAdmin isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div
        className={`content-area ${!isSidebarOpen ? "sidebar-closed" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <Header
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
