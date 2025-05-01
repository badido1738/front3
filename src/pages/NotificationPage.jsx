import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaBell, FaSearch } from 'react-icons/fa';
import '../pages/Notification.css';

const NotificationPage = () => {
  // État pour les notifications
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Données d'exemple - à remplacer par des appels API réels
  useEffect(() => {
    // Simuler le chargement des données depuis une API
    const mockNotifications = [
      {
        id: 1,
        sendingDirection: ' Ressources Humaines',
        documentType: 'Convention de stage',
        concernedPerson: 'Ahmed Benmoussa',
        personType: 'stagiaire',
        date: '2025-04-28',
        status: 'non_recu',
        viewed: false
      },
      {
        id: 2,
        sendingDirection: ' formation',
        documentType: 'Attestation de formation',
        concernedPerson: 'Fatima Zahra',
        personType: 'apprenti',
        date: '2025-04-27',
        status: 'recu',
        viewed: true
      },
      {
        id: 3,
        sendingDirection: "système d'informations",
        documentType: 'Fiche d\'évaluation',
        concernedPerson: 'Karim El Amrani',
        personType: 'stagiaire',
        date: '2025-04-26',
        status: 'recu',
        viewed: false
      },
      {
        id: 4,
        sendingDirection: ' Technique',
        documentType: 'Contrat d\'apprentissage',
        concernedPerson: 'Hajar Bennani',
        personType: 'apprenti',
        date: '2025-04-25',
        status: 'non_recu',
        viewed: false
      },
      {
        id: 5,
        sendingDirection: ' Ressources Humaines',
        documentType: 'Attestation de stage',
        concernedPerson: 'Youssef El Khamlichi',
        personType: 'stagiaire',
        date: '2025-04-24',
        status: 'non_recu',
        viewed: false
      }
    ];
    
    setNotifications(mockNotifications);
  }, []);

  // Marquer une notification comme reçue
  const markAsReceived = (id) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id 
          ? { ...notification, status: 'recu', viewed: true } 
          : notification
      )
    );
    
    // Ici, vous enverriez une mise à jour à votre API
    console.log(`Document ${id} marqué comme reçu`);
  };

  // Marquer une notification comme non reçue (et envoyer un signal)
  const markAsNotReceived = (id) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id 
          ? { ...notification, status: 'non_recu', viewed: true } 
          : notification
      )
    );
    
    // Ici, vous enverriez un signal à la direction concernée via votre API
    console.log(`Signal envoyé pour le document ${id} (non reçu)`);
  };

  // Filtrer les notifications en fonction des critères de recherche
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = 
      notification.sendingDirection.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.concernedPerson.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'recu') return matchesSearch && notification.status === 'recu';
    if (filterStatus === 'non_recu') return matchesSearch && notification.status === 'non_recu';
    if (filterStatus === 'non_vu') return matchesSearch && !notification.viewed;
    
    return matchesSearch;
  });

  // Formatter la date en format lisible
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <div className="page-container">
      <div className="notifications-header">
        <h2 className="notifications-title">
          <FaBell className="notification-icon" /> Notifications de documents
        </h2>
        <span className="notification-count">
          {notifications.filter(n => !n.viewed).length} non lues
        </span>
      </div>

      <div className="notifications-table-container">
        <div className="search-container">
          <div className="search-box">
            <div className="search-icon">
              <FaSearch />
            </div>
            <input
              type="text"
              className="search-input"
              placeholder="Rechercher par direction, type de document ou personne concernée..."
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
              <option value="recu">Reçus</option>
              <option value="non_recu">Non reçus</option>
              <option value="non_vu">Non vus</option>
            </select>
          </div>
        </div>

        <table className="data-table notifications-table">
          <thead>
            <tr>
              <th>Direction expéditrice</th>
              <th>Type de document</th>
              <th>Personne concernée</th>
              <th>Type</th>
              <th>Date d'envoi</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <tr key={notification.id} className={notification.viewed ? '' : 'unread-notification'}>
                  <td>{notification.sendingDirection}</td>
                  <td>{notification.documentType}</td>
                  <td>{notification.concernedPerson}</td>
                  <td>
                    <span className={`person-type ${notification.personType}`}>
                      {notification.personType === 'stagiaire' ? 'Stagiaire' : 'Apprenti'}
                    </span>
                  </td>
                  <td>{formatDate(notification.date)}</td>
                  <td>
                    <span className={`status-tag ${notification.status === 'recu' ? 'status-recu' : 'status-non-recu'}`}>
                      {notification.status === 'recu' ? 'Reçu' : 'Non reçu'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="icon-button receive-icon"
                      data-tooltip="Marquer comme reçu"
                      onClick={() => markAsReceived(notification.id)}
                    >
                      <FaCheck />
                    </button>
                    <button
                      className="icon-button not-receive-icon"
                      data-tooltip="Signaler comme non reçu"
                      onClick={() => markAsNotReceived(notification.id)}
                    >
                      <FaTimes />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="empty-table">
                  Aucune notification ne correspond à vos critères de recherche
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