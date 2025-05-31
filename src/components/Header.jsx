import { Menu, X, User, LogOut, Settings, BellRing } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../layout/layout.css";

export default function Header({ toggleSidebar, isSidebarOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [username, setUsername] = useState("Utilisateur");
  const [userRole, setUserRole] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);
  const [userDirection, setUserDirection] = useState("");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    initializeUserData();
    setupEventListeners();
    return cleanup;
  }, []);

const initializeUserData = () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      // Parse JWT token
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      setUsername(tokenPayload.username || tokenPayload.sub || tokenPayload.email || "Utilisateur");
      setUserRole(localStorage.getItem('role') || tokenPayload.role || "");

      // Fetch user profile to get direction
      fetch('http://localhost:8080/utilisateurs/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(profileData => {
        console.log('Fetched Profile Data:', profileData); // Added console.log
        if (profileData.designationDirection) {
          console.log('Direction:', profileData.designationDirection); // Added console.log
          setUserDirection(profileData.designationDirection);
          fetchNotificationCount(profileData.designationDirection);
          // Set up polling for notifications
          const intervalId = setInterval(() => {
            fetchNotificationCount(profileData.designationDirection);
          }, 30000);
          return () => clearInterval(intervalId);
        }
      })
      .catch(error => console.error('Error fetching user profile:', error));

    } catch (e) {
      console.error('Error processing token:', e);
    }
};


  const fetchNotificationCount = async (designation) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/notifications/unread/direction/${designation}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          handleLogout();
          return;
        }
        throw new Error('Failed to fetch notifications');
      }

      const count = await response.json();
      setNotificationCount(count);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotificationCount(0);
    }
  };

  const setupEventListeners = () => {
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
  };

  const cleanup = () => {
    window.removeEventListener("scroll", handleScroll);
    document.removeEventListener("mousedown", handleClickOutside);
  };

  const handleScroll = () => {
    setScrolled(window.scrollY > 10);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

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
        {userRole !== 'ROLE_sousAdmin' && (
          <button 
            className="notification-button"
            onClick={() => navigate('/documents/circulation/notification')}
          >
            <BellRing size={20} />
            {notificationCount > 0 && (
              <span className="notification-badge">{notificationCount}</span>
            )}
          </button>
        )}
        
        <div className="user-dropdown-container" ref={dropdownRef}>
          <button 
            className="user-button" 
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="user-avatar">{getInitials(username)}</div>
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