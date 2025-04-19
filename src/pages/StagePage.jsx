import React, { useState } from "react";
import StageForm from "../form/StageForm";
import "../form/form.css";
import "../pages/page.css";

function StagePage() {
  const [showForm, setShowForm] = useState(false);
  const [stages, setStages] = useState([
    {
      idStage: 1,
      dateDebut: "2025-03-01",
      dateFin: "2025-06-01",
      duree: "3 mois",
      type: "Stage PFE",
      idDirection: "DSI"
    },
    {
      idStage: 2,
      dateDebut: "2025-02-15",
      dateFin: "2025-05-15",
      duree: "3 mois",
      type: "Stage Pratique",
      idDirection: "DP"
    }
  ]);
  
  const [editingStage, setEditingStage] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce stage ?")) {
      setStages(stages.filter(stage => stage.idStage !== id));
    }
  };

  const handleEdit = (stage) => {
    setEditingStage(stage);
    setShowForm(true);
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
      // Mise à jour d'un stage existant
      setStages(stages.map(s => s.idStage === editingStage.idStage ? { ...formData } : s));
    } else {
      // Ajout d'un nouveau stage
      const newId = stages.length > 0 ? Math.max(...stages.map(s => s.idStage)) + 1 : 1;
      setStages([...stages, { ...formData, idStage: newId }]);
    }
    setShowForm(false);
  };

  return (
    <div className="page-container">
      {showForm ? (
        <div className="form-overlay">
          <div className="form-container">
            <div className="form-header">
              <h3>{editingStage ? "Modifier le stage" : "Ajouter un stage"}</h3>
              <button className="close-button" onClick={handleFormClose}>×</button>
            </div>
            <StageForm 
              initialData={editingStage} 
              onSubmit={handleFormSubmit} 
              onCancel={handleFormClose}
            />
          </div>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-header">
            <h2>Liste des Stages</h2>
            <button className="btn-primary" onClick={handleAddNew}>+ Ajouter un stage</button>
          </div>
          
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date Début</th>
                <th>Date Fin</th>
                <th>Durée</th>
                <th>Type</th>
                <th>Direction</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stages.map((stage) => (
                <tr key={stage.idStage}>
                  <td>{stage.idStage}</td>
                  <td>{stage.dateDebut}</td>
                  <td>{stage.dateFin}</td>
                  <td>{stage.duree}</td>
                  <td>{stage.type}</td>
                  <td>{stage.idDirection}</td>
                  <td className="actions-cell">
                    <button className="btn-edit" onClick={() => handleEdit(stage)}>Modifier</button>
                    <button className="btn-delete" onClick={() => handleDelete(stage.idStage)}>Supprimer</button>
                  </td>
                </tr>
              ))}
              {stages.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-table">Aucun stage disponible</td>
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