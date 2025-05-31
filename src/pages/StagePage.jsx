import React, { useState, useEffect } from "react";
import StageForm from "../form/StageForm";
import "../form/form.css";
import "../pages/page.css";

function StagePage() {
  const [stagiairesParStage, setStagiairesParStage] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);
  const [editingStage, setEditingStage] = useState(null);
  const [stages, setStages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("type");

  // Move fetchStagiairesForStage inside component
const fetchStagiairesForStage = async (stageId) => {
  try {
    const token = localStorage.getItem('token');
    const [stagiairesRes, apprentisRes] = await Promise.all([
      fetch('http://localhost:8080/stagiaires', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }),
      fetch('http://localhost:8080/apprentis', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
    ]);

    if (!stagiairesRes.ok || !apprentisRes.ok) {
      throw new Error('Erreur lors de la récupération des stagiaires');
    }

    const [stagiairesData, apprentisData] = await Promise.all([
      stagiairesRes.json(),
      apprentisRes.json()
    ]);

    // First, get all apprentis for this stage
    const apprentisForStage = apprentisData
      .filter(a => a.stage?.idStage === stageId)
      .map(a => ({ ...a, type: 'APPRENTI' }));

    // Get the IDs of apprentis to exclude them from stagiaires
    const apprentisIds = apprentisForStage.map(a => a.idAS);

    // Then get stagiaires, excluding those who are also apprentis
    const stagiairesForStage = stagiairesData
      .filter(s => s.stage?.idStage === stageId && !apprentisIds.includes(s.idAS))
      .map(s => ({ ...s, type: 'STAGIAIRE' }));

    // Combine both arrays
    const allStagiaires = [...apprentisForStage, ...stagiairesForStage];

    setStagiairesParStage(allStagiaires);
  } catch (error) {
    console.error("Erreur:", error);
    setStagiairesParStage([]);
  }
};

  const getDuree = (dateDebut, dateFin) => {
  if (!dateDebut || !dateFin) return "—";
  
  const start = new Date(dateDebut);
  const end = new Date(dateFin);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 30) {
    return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  } else {
    const months = Math.floor(diffDays / 30);
    const remainingDays = diffDays % 30;
    return `${months} mois${months > 1 ? '' : ''} ${remainingDays > 0 ? `et ${remainingDays} jour${remainingDays > 1 ? 's' : ''}` : ''}`;
  }
};

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:8080/stages', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
         console.log("Stages GET :", data); 
      setStages(data);
    })
    .catch(error => {
      console.error("Erreur lors de la récupération des stages:", error);
    });
  }, []);

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
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce stage ?")) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/stages/${id}`, {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setStages(stages.filter(stage => stage.idStage !== id));
          alert("Stage supprimé avec succès");
        } else if (response.status === 409 || response.status === 500 ) {
          const errorData = await response.json();
          alert(`Impossible de supprimer : ${errorData.message || 
                "Ce stage est lié à des stagiaires. Supprimez d'abord les stagiaires associés."}`);
        } else if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
      } catch (error) {
        console.error("Erreur:", error);
        alert("Une erreur est survenue lors de la suppression");
      }
    }
  };

  const handleEdit = (stage) => {
    setEditingStage(stage);
    setShowForm(true);
  };

const handleDetails = (stage) => {
  setSelectedStage(stage);
  setShowDetails(true);
  fetchStagiairesForStage(stage.idStage);
};

  const handleDetailsClose = () => {
    setShowDetails(false);
    setSelectedStage(null);
  };

  const handleAddNew = () => {
    setEditingStage(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingStage(null);
  };

  const handleFormSubmit = (formData) => {
    if (editingStage) {
      setStages(stages.map(s => s.idStage === editingStage.idStage ? { ...formData } : s));
    } else {
      const newId = stages.length > 0 ? Math.max(...stages.map(s => s.idStage)) + 1 : 1;
      setStages([...stages, { ...formData, idStage: newId }]);
    }
    setShowForm(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCriteriaChange = (e) => {
    setSearchCriteria(e.target.value);
  };

  const filteredStages = stages.filter(stage => {
    const value = stage[searchCriteria]?.toString().toLowerCase() || '';
    return value.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="page-container">
      {showForm ? (
        <div className="form-overlay">
          <div className="form-container">
            <div className="form-header"></div>
            <StageForm 
              initialData={editingStage} 
              onSubmit={handleFormSubmit} 
              onCancel={handleFormClose}
            />
          </div>
        </div>
      ) : showDetails ? (
        <div className="form-overlay">
          <div className="form-container">
            <div className="form-header">
              <h3>Détails du stage</h3>
              <button className="close-button" onClick={handleDetailsClose}>×</button>
            </div>
                <div className="details-container">
                  <h4>Informations du stage</h4>
                  <div className="details-section">
                    <div className="detail-item">
                      <span className="detail-label">ID:</span>
                      <span className="detail-value">{selectedStage.idStage}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Date Début:</span>
                      <span className="detail-value">{selectedStage.dateDebut}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Date Fin:</span>
                      <span className="detail-value">{selectedStage.dateFin}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Durée:</span>
                      <span className="detail-value">{getDuree(selectedStage.dateDebut, selectedStage.dateFin)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Type:</span>
                      <span className="detail-value">{selectedStage.type}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Direction:</span>
                      <span className="detail-value">{selectedStage.direction?.designation}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Thème:</span>
                      <span className="detail-value">{selectedStage.theme?.titre}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Description du thème:</span>
                      <span className="detail-value">{selectedStage.theme?.description || 'Aucune description'}</span>
                    </div>
                  </div>

                  <h4>Stagiaires inscrits</h4>
                  <div className="details-section">
                    {stagiairesParStage.length > 0 ? (
                      <table className="details-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Type</th>
                            <th>Spécialité</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stagiairesParStage.map((stagiaire) => (
                            <tr key={stagiaire.idAS}>
                              <td>{stagiaire.idAS}</td>
                              <td>{stagiaire.nom}</td>
                              <td>{stagiaire.prenom}</td>
                              <td>{stagiaire.type === 'STAGIAIRE' ? 'Stagiaire' : 'Apprenti'}</td>
                              <td>{stagiaire.specialite?.nom || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="no-data-message">Aucun stagiaire inscrit à ce stage</div>
                    )}
                  </div>

                  <div className="details-footer">
                    <button className="btn-primary" onClick={handleDetailsClose}>Fermer</button>
                  </div>
                </div>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-header">
            <h2>Liste des Stages</h2>
            <button className="btn-primary" onClick={handleAddNew}>+ Ajouter un stage</button>
          </div>
          
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
                <option value="type">Type</option>
                <option value="dateDebut">Date Début</option>
                <option value="dateFin">Date Fin</option>
                <option value="direction?.designation">Direction</option>
              </select>
            </div>
          </div>
          
// ...existing code...
          <table className="data-table">
<thead>
  <tr>
    <th>ID</th>
    <th>Date Début</th>
    <th>Date Fin</th>
    <th>Durée</th>
    <th>Type</th>
    <th>Direction</th>
    <th>Thème</th>
    <th>Actions</th>
  </tr>
</thead>
            <tbody>
              {filteredStages.map((stage) => (
                <tr key={stage.idStage}>
                  <td>{stage.idStage}</td>
                  <td>{stage.dateDebut}</td>
                  <td>{stage.dateFin}</td>
                  <td>{getDuree(stage.dateDebut, stage.dateFin)}</td>
                  <td>{stage.type}</td>
                  <td>{stage.direction?.designation}</td>
                  <td>
                    <span
                      title={stage.theme?.titre || ""}
                      style={{
                        display: "inline-block",
                        maxWidth: 120,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        verticalAlign: "bottom",
                        cursor: stage.theme?.titre ? "pointer" : "default"
                      }}
                    >
                      {stage.theme?.titre
                        ? stage.theme.titre.length > 20
                          ? stage.theme.titre.slice(0, 20) + "..."
                          : stage.theme.titre
                        : "—"}
                    </span>
                  </td>
                   <td className="actions-cell">
                    <button 
                      className="icon-button view-icon" 
                      onClick={() => handleDetails(stage)} 
                      data-tooltip="Consulter"
                    >
                      {iconView}
                    </button>
                    <button 
                      className="icon-button edit-icon" 
                      onClick={() => handleEdit(stage)} 
                      data-tooltip="Modifier"
                    >
                      {iconEdit}
                    </button>
                    <button 
                      className="icon-button delete-icon" 
                      onClick={() => handleDelete(stage.idStage)} 
                      data-tooltip="Supprimer"
                    >
                      {iconDelete}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredStages.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-table">
                    {stages.length === 0 ? "Aucun stage disponible" : "Aucun résultat correspondant à votre recherche"}
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

export default StagePage;