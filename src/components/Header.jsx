import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import "../layout/layout.css";

export default function Header({ toggleSidebar, isSidebarOpen }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header ${!isSidebarOpen ? "sidebar-closed" : ""} ${scrolled ? "scrolled" : ""}`}>
      <button onClick={toggleSidebar} className={`menu-button ${isSidebarOpen ? "open" : ""}`}>
        {isSidebarOpen ? <X size={24} className="menu-icon" /> : <Menu size={24} className="menu-icon" />}
      </button>
      <h1 className="header-title">Gestion des Stagiaires</h1>
      <div className="header-right">
        <button className="admin-button">Admin</button>
      </div>
    </header>
  );
}
