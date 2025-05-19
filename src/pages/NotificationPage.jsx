import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaBell, FaSearch, FaPaperPlane, FaInbox } from 'react-icons/fa';
import '../pages/Notification.css';

const NotificationPage = () => {
  // État pour les notifications
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [notificationType, setNotificationType] = useState('received'); // 'received' ou 'sent'

  // Données d'exemple - à remplacer par des appels API réels
  useEffect(() => {
    // Simuler le chargement des données depuis une API
    const mockReceivedNotifications = [
      {
        id: 1,
        sendingDirection: 'Ressources Humaines',
        documentType: 'Convention de stage',
        concernedPerson: 'Ahmed Benmoussa',
        personType: 'stagiaire',
        date: '2025-04-28',
        status: 'non_recu',
        viewed: false,
        type: 'received'
      },
      {
        id: 2,
        sendingDirection: 'Formation',
        documentType: 'Attestation de formation',
        concernedPerson: 'Fatima Zahra',
        personType: 'apprenti',
        date: '2025-04-27',
        status: 'recu',
        viewed: true,
        type: 'received'
      }
    ];

    const mockSentNotifications = [
      {
        id: 3,
        receivingDirection: 'Direction Technique',
        documentType: 'Fiche d\'évaluation',
        concernedPerson: 'Karim El Amrani',
        personType: 'stagiaire',
        date: '2025-04-26',
        status: 'pending',
        viewed: false,
        type: 'sent'
      },
      {
        id: 4,
        receivingDirection: 'Ressources Humaines',
        documentType: 'Contrat d\'apprentissage',
        concernedPerson: 'Hajar Bennani',
        personType: 'apprenti',
        date: '2025-04-25',
        status: 'confirmed',
        viewed: false,
        type: 'sent'
      }
    ];
    
    setNotifications([...mockReceivedNotifications, ...mockSentNotifications]);
  }, []);

  // Filtrer les notifications selon le type (reçues ou envoyées)
  const getFilteredNotificationsByType = () => {
    return notifications.filter(notification => 
      notificationType === 'received' 
        ? notification.type === 'received' 
        : notification.type === 'sent'
    );
  };

  // Marquer une notification comme reçue (pour les notifications reçues)
  const markAsReceived = (id) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id 
          ? { ...notification, status: 'recu', viewed: true } 
          : notification
      )
    );
    console.log(`Document ${id} marqué comme reçu`);
  };

  // Marquer une notification comme non reçue (pour les notifications reçues)
  const markAsNotReceived = (id) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id 
          ? { ...notification, status: 'non_recu', viewed: true } 
          : notification
      )
    );
    console.log(`Signal envoyé pour le document ${id} (non reçu)`);
  };

  // Filtrer les notifications en fonction des critères de recherche
  const filteredNotifications = getFilteredNotificationsByType().filter(notification => {
    const matchesSearch = 
      (notification.sendingDirection || notification.receivingDirection || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.concernedPerson.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    if (notification.type === 'received') {
      if (filterStatus === 'recu') return matchesSearch && notification.status === 'recu';
      if (filterStatus === 'non_recu') return matchesSearch && notification.status === 'non_recu';
    } else {
      if (filterStatus === 'pending') return matchesSearch && notification.status === 'pending';
      if (filterStatus === 'confirmed') return matchesSearch && notification.status === 'confirmed';
    }
    if (filterStatus === 'non_vu') return matchesSearch && !notification.viewed;
    
    return matchesSearch;
  });

  // Formatter la date en format lisible
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Obtenir le nombre de notifications non lues par type
  const getUnreadCount = (type) => {
    return notifications.filter(n => !n.viewed && n.type === type).length;
  };

  return (
    <div className="page-container">
      <div className="notifications-header">

        <div className="notification-types">
          <button
            className={`notification-type-btn ${notificationType === 'received' ? 'active' : ''}`}
            onClick={() => setNotificationType('received')}
          >
            <FaInbox /> Reçues ({getUnreadCount('received')})
          </button>
          <button
            className={`notification-type-btn ${notificationType === 'sent' ? 'active' : ''}`}
            onClick={() => setNotificationType('sent')}
          >
            <FaPaperPlane /> Envoyées ({getUnreadCount('sent')})
          </button>
        </div>
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
              placeholder={`Rechercher par ${notificationType === 'received' ? 'direction expéditrice' : 'direction destinataire'}, type de document ou personne concernée...`}
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
              {notificationType === 'received' ? (
                <>
                  <option value="recu">Reçus</option>
                  <option value="non_recu">Non reçus</option>
                </>
              ) : (
                <>
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmés</option>
                </>
              )}
              <option value="non_vu">Non vus</option>
            </select>
          </div>
        </div>

        <table className="data-table notifications-table">
          <thead>
            <tr>
              <th>{notificationType === 'received' ? 'Direction expéditrice' : 'Direction destinataire'}</th>
              <th>Type de document</th>
              <th>Personne concernée</th>
              <th>Type</th>
              <th>Date {notificationType === 'received' ? 'd\'envoi' : 'd\'envoi'}</th>
              <th>Statut</th>
              {notificationType === 'received' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <tr key={notification.id} className={notification.viewed ? '' : 'unread-notification'}>
                  <td>{notification.sendingDirection || notification.receivingDirection}</td>
                  <td>{notification.documentType}</td>
                  <td>{notification.concernedPerson}</td>
                  <td>
                    <span className={`person-type ${notification.personType}`}>
                      {notification.personType === 'stagiaire' ? 'Stagiaire' : 'Apprenti'}
                    </span>
                  </td>
                  <td>{formatDate(notification.date)}</td>
                  <td>
                    {notification.type === 'received' ? (
                      <span className={`status-tag ${notification.status === 'recu' ? 'status-recu' : 'status-non-recu'}`}>
                        {notification.status === 'recu' ? 'Reçu' : 'Non reçu'}
                      </span>
                    ) : (
                      <span className={`status-tag ${notification.status === 'confirmed' ? 'status-confirmed' : 'status-pending'}`}>
                        {notification.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                      </span>
                    )}
                  </td>
                  {notification.type === 'received' && (
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
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={notificationType === 'received' ? 7 : 6} className="empty-table">
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