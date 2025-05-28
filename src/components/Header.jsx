import { Menu, X, User, LogOut, Settings, BellRing } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../layout/layout.css";

export default function Header({ toggleSidebar, isSidebarOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [username, setUsername] = useState("Utilisateur");
  const [userRole, setUserRole] = useState("");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get username from localStorage or from JWT token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Try to extract username from JWT token
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const extractedUsername = tokenPayload.username || tokenPayload.sub || tokenPayload.email || "Utilisateur";
        setUsername(extractedUsername);
        
        // Extract and set role
        const role = localStorage.getItem('role') || 
                    (tokenPayload.role ? tokenPayload.role : 
                     (tokenPayload.roles ? tokenPayload.roles : ""));
        setUserRole(role);
      } catch (e) {
        console.log('Could not decode token or extract username');
      }
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    // Redirect to login page
    navigate('/');
  };

  // Function to get initials from username
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className={`header ${!isSidebarOpen ? "sidebar-closed" : ""} ${scrolled ? "scrolled" : ""}`}>
      <button onClick={toggleSidebar} className={`menu-button ${isSidebarOpen ? "open" : ""}`}>
        {isSidebarOpen ? <X size={24} className="menu-icon" /> : <Menu size={24} className="menu-icon" />}
      </button>
      <h1 className="header-title">Gestion des Stagiaires</h1>
      <div className="header-right">
        {/* Notifications bell - Updated with onClick handler */}
        <button 
          className="notification-button"
          onClick={() => navigate('/documents/circulation/notification')}
        >
          <BellRing size={20} />
          <span className="notification-badge">4</span>
        </button>
        
        {/* User dropdown */}
        <div className="user-dropdown-container" ref={dropdownRef}>
          <button 
            className="user-button" 
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="user-avatar">
              {getInitials(username)}
            </div>
            <div className="user-info">
              <span className="username">{username}</span>
              {userRole && <span className="user-role">{userRole}</span>}
            </div>
          </button>
          
          {dropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <span className="dropdown-username">{username}</span>
                <span className="dropdown-role">{userRole}</span>
              </div>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item" onClick={() => {
                navigate('/profile');
                setDropdownOpen(false);
              }}>
                <User size={16} />
                <span>Mon Profil</span>
              </button>
              <button className="dropdown-item" onClick={() => {
                navigate('/settings');
                setDropdownOpen(false);
              }}>
                <Settings size={16} />
                <span>Paramètres</span>
              </button>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item logout" onClick={handleLogout}>
                <LogOut size={16} />
                <span>Déconnexion</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}