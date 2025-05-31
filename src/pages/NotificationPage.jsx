import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaSearch, FaPaperPlane, FaInbox } from 'react-icons/fa';
import '../pages/Notification.css';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentUserDirection, setCurrentUserDirection] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('received'); // 'received' or 'sent'

  // Fetch user profile and notifications
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // Fetch user profile to get direction
        const profileResponse = await fetch('http://localhost:8080/utilisateurs/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!profileResponse.ok) throw new Error(`HTTP error! Status: ${profileResponse.status}`);
        const profile = await profileResponse.json();
        
        if (profile?.designationDirection) {
          setCurrentUserDirection(profile.designationDirection);
        }

        // Fetch all notifications using the correct endpoint
        const notificationsResponse = await fetch('http://localhost:8080/notifications', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!notificationsResponse.ok) throw new Error(`HTTP error! Status: ${notificationsResponse.status}`);
        setNotifications(await notificationsResponse.json());
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter notifications based on current tab and user direction
  const getFilteredNotifications = () => {
    if (!currentUserDirection) return [];

    return notifications.filter(notification => {
      const matchesSearch = 
        (notification.sendingDirection || notification.receivingDirection || '')
          .toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.concernedPerson.toLowerCase().includes(searchTerm.toLowerCase());

      // Determine if notification belongs to current tab
      const isSent = notification.sendingDirection === currentUserDirection;
      const isReceived = notification.receivingDirection === currentUserDirection;
      
      const belongsToCurrentTab = 
        (activeTab === 'sent' && isSent) || 
        (activeTab === 'received' && isReceived);

      if (!belongsToCurrentTab || !matchesSearch) return false;

      // Apply status filter
      if (filterStatus === 'all') return true;
      if (filterStatus === 'non_vu') return !notification.viewed;
      
      if (activeTab === 'received') {
        return filterStatus === 'recu' 
          ? notification.status === 'recu' 
          : notification.status === 'non_recu';
      } else { // sent
        return filterStatus === 'recu' 
          ? notification.status === 'recu' 
          : notification.status === 'non_recu';
      }
    });
  };

  // Updated function to use the correct API endpoints
  const markAsReceived = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/notifications/${id}/mark-received`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      
      // Update local state to reflect the change
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, status: 'recu', viewed: true } : n
      ));
    } catch (error) {
      console.error("Error marking notification as received:", error);
      alert("Erreur lors de la mise à jour du statut");
    }
  };

  // Updated function to use the correct API endpoints
  const markAsNotReceived = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/notifications/${id}/mark-not-received`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      
      // Update local state to reflect the change
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, status: 'non_recu', viewed: true } : n
      ));
    } catch (error) {
      console.error("Error marking notification as not received:", error);
      alert("Erreur lors de la mise à jour du statut");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const getUnreadCount = (tab) => {
    if (!currentUserDirection) return 0;
    return notifications.filter(n => 
      !n.viewed && (
        (tab === 'sent' && n.sendingDirection === currentUserDirection) ||
        (tab === 'received' && n.receivingDirection === currentUserDirection)
      )
    ).length;
  };

  if (loading) return <div className="page-container">Chargement en cours...</div>;
  if (error) return <div className="page-container">Erreur: {error}</div>;

  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="page-container">
      <div className="notifications-header">
        <div className="notification-types">
          <button
            className={`notification-type-btn ${activeTab === 'received' ? 'active' : ''}`}
            onClick={() => setActiveTab('received')}
          >
            <FaInbox /> Reçues ({getUnreadCount('received')})
          </button>
          <button
            className={`notification-type-btn ${activeTab === 'sent' ? 'active' : ''}`}
            onClick={() => setActiveTab('sent')}
          >
  <div>
    <FaPaperPlane /> Envoyées
  </div>
  <span className="small-text">({getUnreadCount('sent')}) En attente</span>    
        </button>
        </div>
      </div>

      <div className="notifications-table-container">
        <div className="search-container">
          <div className="search-box">
            <div className="search-icon"><FaSearch /></div>
            <input
              type="text"
              className="search-input"
              placeholder="Rechercher par direction, document ou personne..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="search-criteria">
            <label htmlFor="status-filter">Statut:</label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tous</option>
              {activeTab === 'received' ? (
                <>
                  <option value="recu">Reçus</option>
                  <option value="non_recu">Non reçus</option>
                </>
              ) : (
                <>
                  <option value="recu">Reçus</option>
                  <option value="non_recu">Non reçus</option>
                </>
              )}
              <option value="non_vu">Non vus</option>
            </select>
          </div>
        </div>

        <table className="data-table notifications-table">
          <thead>
            <tr>
              <th>{activeTab === 'received' ? 'Expéditeur' : 'Destinataire'}</th>
              <th>Type de document</th>
              <th>Personne concernée</th>
              <th>Type</th>
              <th>Date</th>
              <th>Statut</th>
              {activeTab === 'received' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((n) => (
                <tr key={n.id} className={n.viewed ? '' : 'unread-notification'}>
                  <td>{activeTab === 'received' ? n.sendingDirection : n.receivingDirection}</td>
                  <td>{n.documentType}</td>
                  <td>{n.concernedPerson}</td>
                  <td>
                    <span className={`person-type ${n.personType}`}>
                      {n.personType === 'stagiaire' ? 'Stagiaire' : 'Apprenti'}
                    </span>
                  </td>
                  <td>{formatDate(n.date)}</td>
                  <td>
                    <span className={`status-tag ${
                      n.status === 'recu' 
                        ? 'status-recu' 
                        : !n.viewed 
                          ? 'status-en-attente' 
                          : 'status-non-recu'
                    }`}>
                      {n.status === 'recu' 
                        ? 'Reçu' 
                        : !n.viewed 
                          ? 'En attente' 
                          : 'Non reçu'}
                    </span>
                  </td>
                  {activeTab === 'received' && (
                    <td className="actions-cell">
                      <button 
                        className="icon-button receive-icon" 
                        onClick={() => markAsReceived(n.id)}
                        title="Marquer comme reçu"
                      >
                        <FaCheck />
                      </button>
                      <button 
                        className="icon-button not-receive-icon" 
                        onClick={() => markAsNotReceived(n.id)}
                        title="Signaler comme non reçu"
                      >
                        <FaTimes />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={activeTab === 'received' ? 7 : 6} className="empty-table">
                  {currentUserDirection 
                    ? "Aucune notification ne correspond à vos critères" 
                    : "Chargement des informations utilisateur..."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NotificationPage;