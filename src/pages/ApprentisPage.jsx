import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import ApprentiForms from "../form/ApprentiForms";
import "../form/form.css";
import "../pages/page.css";

function ApprentisPage() {
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedApprenti, setSelectedApprenti] = useState(null);
  
  const [apprentis, setApprentis] = useState([]);
  
  // États pour la recherche
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("nom");
  
  const [editingApprenti, setEditingApprenti] = useState(null);

    useEffect(() => {
      const token = localStorage.getItem('token');
      fetch('http://localhost:8080/apprentis', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        setApprentis(data);
      })
      .catch(error => {
        console.error('Error fetching apprentis:', error);
        // Optionally redirect to login if unauthorized
        if (error.message.includes('403')) {
          window.location.href = '/login';
        }
      });
    }, []);

  // Icônes SVG intégrées
  const iconView = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
    </svg>
  );

  const iconEdit = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
    </svg>
  );

  const iconDelete = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
      <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
    </svg>
  );

  const iconSearch = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
    </svg>
  );

const handleDelete = async (id) => {
  if (window.confirm("Êtes-vous sûr de vouloir supprimer cet apprenti ?")) {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error("No authentication token found");
        window.location.href = '/login';
        return;
      }

      const response = await fetch(`http://localhost:8080/apprentis/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Update UI without reloading the page
        setApprentis(apprentis.filter(apprenti => apprenti.idAS !== id));
        console.log("Apprenti supprimé avec succès");
      } else {
        const errorText = await response.text();
        console.error("Erreur lors de la suppression :", errorText);
        
        // Handle unauthorized (401/403) responses
        if (response.status === 401 || response.status === 403) {
          window.location.href = '/login';
        }
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      // Handle network errors
      if (error.message.includes('Failed to fetch')) {
        alert("Problème de connexion au serveur");
      }
    }
  }
};

  const handleEdit = (apprenti) => {
    setEditingApprenti(apprenti);
    setShowForm(true);
  };

  const handleDetails = (apprenti) => {
    setSelectedApprenti(apprenti);
    setShowDetails(true);
  };

  const handleDetailsClose = () => {
    setShowDetails(false);
    setSelectedApprenti(null);
  };

  const handleAddNew = () => {
    setEditingApprenti(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingApprenti(null);
  };

  // Cette fonction sera appelée après l'ajout ou la modification d'un apprenti
  const handleFormSubmit = (formData) => {
    if (editingApprenti) {
      // Mise à jour d'un apprenti existant
      setApprentis(apprentis.map(a => a.idApprenti === editingApprenti.idApprenti ? { ...formData } : a));
    } else {
      // Ajout d'un nouveau apprenti
      const newId = apprentis.length > 0 ? Math.max(...apprentis.map(a => a.idApprenti)) + 1 : 1;
      setApprentis([...apprentis, { ...formData, idApprenti: newId }]);
    }
    setShowForm(false);
  };

  // Gérer les changements dans l'input de recherche
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Gérer les changements dans le critère de recherche
  const handleCriteriaChange = (e) => {
    setSearchCriteria(e.target.value);
  };

  // Filtrer les apprentis en fonction du terme de recherche et du critère
  const filteredApprentis = apprentis.filter(apprenti => {
    const value = apprenti[searchCriteria]?.toString().toLowerCase() || '';
    return value.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="page-container">
      {showForm ? (
        <div className="form-overlay">
          <div className="form-container">
            <div className="form-header">
            
            </div>
            <ApprentiForms 
              initialData={editingApprenti} 
              onSubmit={handleFormSubmit} 
              onCancel={handleFormClose}
            />
          </div>
        </div>
      ) : showDetails ? (
        <div className="form-overlay">
          <div className="form-container">
            <div className="form-header">
              <h3>Détails de l'apprenti</h3>
              <button className="close-button" onClick={handleDetailsClose}>×</button>
            </div>
            <div className="details-container">
              <div className="detail-item">
                <span className="detail-label">ID:</span>
                <span className="detail-value">{selectedApprenti.idApprenti}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Nom:</span>
                <span className="detail-value">{selectedApprenti.nom}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Prénom:</span>
                <span className="detail-value">{selectedApprenti.prenom}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Numéro CCP:</span>
                <span className="detail-value">{selectedApprenti.numeroCCP}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Spécialité:</span>
                <span className="detail-value">{selectedApprenti.specialite}</span>
              </div>
              <button className="btn-primary" onClick={handleDetailsClose}>Fermer</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-header">
            <h2>Liste des Apprentis</h2>
            <button className="btn-primary" onClick={handleAddNew}>+ Ajouter un apprenti</button>
          </div>
          
          {/* Section de recherche */}
          <div className="search-container">
            <div className="search-box">
              <div className="search-icon">
                {iconSearch}
              </div>
              <input 
                type="text" 
                placeholder="Rechercher..." 
                value={searchTerm} 
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>
            <div className="search-criteria">
              <label>Critère: </label>
              <select value={searchCriteria} onChange={handleCriteriaChange}>
                <option value="nom">Nom</option>
                <option value="prenom">Prénom</option>
                <option value="numeroCCP">Numéro CCP</option>
                <option value="specialite">Spécialité</option>
              </select>
            </div>
          </div>
          
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Numéro CCP</th>
                <th>Spécialité</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApprentis.map((apprenti) => (
                <tr key={apprenti.idApprenti}>
                  <td>{apprenti.idApprenti}</td>
                  <td>{apprenti.nom}</td>
                  <td>{apprenti.prenom}</td>
                  <td>{apprenti.numeroCCP}</td>
                  <td>{apprenti.specialite}</td>
                  <td className="actions-cell">
                    <button className="icon-button view-icon" onClick={() => handleDetails(apprenti)} data-tooltip="Consulter">
                      {iconView}
                    </button>
                    <button className="icon-button edit-icon" onClick={() => handleEdit(apprenti)} data-tooltip="Modifier">
                      {iconEdit}
                    </button>
                    <button className="icon-button delete-icon" onClick={() => handleDelete(apprenti.idAS)} data-tooltip="Supprimer">
                      {iconDelete}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredApprentis.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-table">
                    {apprentis.length === 0 ? "Aucun apprenti disponible" : "Aucun résultat correspondant à votre recherche"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ApprentisPage;