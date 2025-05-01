import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaFileDownload } from 'react-icons/fa';
import "../pages/Historique.css";

// Données fictives pour l'exemple
const DUMMY_HISTORIQUE = [
  {
    id: 1,
    nomDocument: "Convention de stage",
    nomStagiaire: "meriem saidani",
    type: "Stagiaire",
    directionInitiale: "Direction système d'informations",
    dateCreation: "2025-04-10",
    etat: "Reçu",
    parcours: [
      {
        direction: "Direction système d'informations",
        dateEnvoi: "2025-04-10",
        dateReception: "2025-04-10",
        statut: "Reçu"
      },
      {
        direction: "Direction Ressources Humaines",
        dateEnvoi: "2025-04-11",
        dateReception: "2025-04-12",
        statut: "Reçu"
      },
      {
        direction: "Direction de formation",
        dateEnvoi: "2025-04-13",
        dateReception: "2025-04-15",
        statut: "Reçu"
      }
    ]
  },
  {
    id: 2,
    nomDocument: "fiche de position",
    nomStagiaire: "mahfoufi seryne ",
    type: "Stagiaire",
    directionInitiale: "Direction système d'informations",
    dateCreation: "2025-04-15",
    etat: "En attente",
    parcours: [
      {
        direction: "Direction système d'informations",
        dateEnvoi: "2025-04-15",
        dateReception: "2025-04-15",
        statut: "Reçu"
      },
      {
        direction: "Direction Formation",
        dateEnvoi: "2025-04-16",
        dateReception: null,
        statut: "En attente"
      }
    ]
  },
  {
    id: 3,
    nomDocument: "Contrat d'apprentissage",
    nomStagiaire: " Ragrag  islam",
    type: "Apprenti",
    directionInitiale: "Direction Ressources Humaines",
    dateCreation: "2025-04-05",
    etat: "Reçu",
    parcours: [
      {
        direction: "Direction Ressources Humaines",
        dateEnvoi: "2025-04-05",
        dateReception: "2025-04-05",
        statut: "Reçu"
      },
      {
        direction: "Direction système d'informations",
        dateEnvoi: "2025-04-06",
        dateReception: "2025-04-07",
        statut: "Reçu"
      },
      {
        direction: "Direction Formation",
        dateEnvoi: "2025-04-08",
        dateReception: "2025-04-09",
        statut: "Reçu"
      }
    ]
  },
  {
    id: 4,
    nomDocument: "Attestation de stage",
    nomStagiaire: "yousfi mahdi",
    type: "Stagiaire",
    directionInitiale: "Direction Formation",
    dateCreation: "2025-04-20",
    etat: "Envoyé",
    parcours: [
      {
        direction: "Direction Formation",
        dateEnvoi: "2025-04-20",
        dateReception: "2025-04-20",
        statut: "Reçu"
      },
      {
        direction: "Direction Générale",
        dateEnvoi: "2025-04-21",
        dateReception: null,
        statut: "Envoyé"
      }
    ]
  },
  {
    id: 5,
    nomDocument: "convention de stage ",
    nomStagiaire: "hadaddi melissa ",
    type: "Apprenti",
    directionInitiale: "Direction Technique",
    dateCreation: "2025-04-18",
    etat: "Reçu",
    parcours: [
      {
        direction: "Direction Technique",
        dateEnvoi: "2025-04-18",
        dateReception: "2025-04-18",
        statut: "Reçu"
      },
      {
        direction: "Direction Formation",
        dateEnvoi: "2025-04-19",
        dateReception: "2025-04-20",
        statut: "Reçu"
      }
    ]
  }
];

const HistoriquePage = () => {
  const [historique, setHistorique] = useState(DUMMY_HISTORIQUE);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('nomDocument');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Effet pour simuler le chargement des données depuis une API
  useEffect(() => {
    // Dans un cas réel, vous feriez un appel API ici
    // setHistorique(dataFromAPI);
    console.log('Données d\'historique chargées');
  }, []);

  // Filtrer les documents en fonction du terme de recherche
  const filteredHistorique = historique.filter(doc => {
    if (!searchTerm) return true;
    
    const searchValue = searchTerm.toLowerCase();
    if (searchBy === 'nomDocument') {
      return doc.nomDocument.toLowerCase().includes(searchValue);
    } else if (searchBy === 'nomStagiaire') {
      return doc.nomStagiaire.toLowerCase().includes(searchValue);
    } else if (searchBy === 'type') {
      return doc.type.toLowerCase().includes(searchValue);
    } else if (searchBy === 'direction') {
      return doc.directionInitiale.toLowerCase().includes(searchValue) || 
             doc.parcours.some(p => p.direction.toLowerCase().includes(searchValue));
    } else {
      return false;
    }
  });

  // Paginer les résultats
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistorique.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHistorique.length / itemsPerPage);

  // Ouvrir la modal avec les détails du document
  const openDocumentDetails = (document) => {
    setSelectedDocument(document);
    setShowModal(true);
  };

  // Gérer le changement de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Formater une date au format français
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Obtenir la classe CSS pour le statut
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'reçu':
        return 'status-recu';
      case 'envoyé':
        return 'status-envoye';
      case 'en attente':
        return 'status-en-attente';
      default:
        return '';
    }
  };

  return (
    <div className="historique-page-container">
      <div className="historique-header">
        <h1 className="historique-title">Historique des Documents</h1>
      </div>
      
      <div className="historique-table-container">
        {/* Zone de recherche */}
        <div className="search-container">
          <div className="search-box">
            <div className="search-icon">
              <FaSearch />
            </div>
            <input
              type="text"
              placeholder="Rechercher..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="search-criteria">
            <label htmlFor="searchBy">Rechercher par:</label>
            <select
              id="searchBy"
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
            >
              <option value="nomDocument">Nom du document</option>
              <option value="nomStagiaire">Nom du stagiaire/apprenti</option>
              <option value="type">Type (Stagiaire/Apprenti)</option>
              <option value="direction">Direction</option>
            </select>
          </div>
        </div>
        
        {/* Tableau des documents */}
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '20%' }}>Document</th>
              <th style={{ width: '15%' }}>Stagiaire/Apprenti</th>
              <th style={{ width: '10%' }}>Type</th>
              <th style={{ width: '15%' }}>Direction initiale</th>
              <th style={{ width: '10%' }}>Date création</th>
              <th style={{ width: '10%' }}>État</th>
              <th style={{ width: '20%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.nomDocument}</td>
                  <td>{doc.nomStagiaire}</td>
                  <td>{doc.type}</td>
                  <td>{doc.directionInitiale}</td>
                  <td>{formatDate(doc.dateCreation)}</td>
                  <td>
                    <span className={`status-tag ${getStatusClass(doc.etat)}`}>
                      {doc.etat}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button
                        className="icon-button view-icon"
                        data-tooltip="Voir les détails"
                        onClick={() => openDocumentDetails(doc)}
                      >
                        <FaEye />
                      </button>
                      <button
                        className="icon-button download-icon"
                        data-tooltip="Télécharger"
                      >
                        <FaFileDownload />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="empty-table">
                  Aucun document trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* Pagination */}
        {filteredHistorique.length > itemsPerPage && (
          <div className="pagination">
            <button
              className="pagination-button"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &laquo;
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`pagination-button ${currentPage === number ? 'active' : ''}`}
              >
                {number}
              </button>
            ))}
            
            <button
              className="pagination-button"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &raquo;
            </button>
          </div>
        )}
      </div>
      
      {/* Modal de détails du document */}
      {showModal && selectedDocument && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Détails du document</h2>
              <button className="close-button" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            
            <div className="details-container">
              <div className="detail-item">
                <span className="detail-label">Nom du document:</span>
                <span className="detail-value">{selectedDocument.nomDocument}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Nom du {selectedDocument.type}:</span>
                <span className="detail-value">{selectedDocument.nomStagiaire}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Date de création:</span>
                <span className="detail-value">{formatDate(selectedDocument.dateCreation)}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">État actuel:</span>
                <span className="detail-value">
                  <span className={`status-tag ${getStatusClass(selectedDocument.etat)}`}>
                    {selectedDocument.etat}
                  </span>
                </span>
              </div>
              
              <h3 style={{ marginTop: '25px', marginBottom: '15px', color: '#2c3e50' }}>
                Historique du parcours
              </h3>
              
              <div className="history-list">
                {selectedDocument.parcours.map((item, index) => (
                  <div className="history-item" key={index}>
                    <div className="history-header">
                      <div className="history-direction">Direction: {item.direction}</div>
                      <div className="history-date">
                        Envoi: {formatDate(item.dateEnvoi)} | 
                        Réception: {formatDate(item.dateReception)}
                      </div>
                    </div>
                    <div className="history-status">
                      <span className={`status-tag ${getStatusClass(item.statut)}`}>
                        {item.statut}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoriquePage;