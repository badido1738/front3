import React, { useState } from "react";
import { Link } from "react-router-dom";
import StagiaireForm from "../form/StagiaireForm";
import "../form/form.css";
import"../pages/page.css";


function StagiairesPage() {
  const [showForm, setShowForm] = useState(false);
  const [stagiaires, setStagiaires] = useState([
    {
      id: 1,
      nom: "Dupont",
      prenom: "Jean",
      numeroStage: "n1",
      specialite: "Informatique"
    },
    {
      id: 2,
      nom: "Martin",
      prenom: "Sophie",
      numeroStage: "n2",
      specialite: "Électronique"
    },
    // Vous pouvez ajouter d'autres données de test ici
  ]);
  
  const [editingStagiaire, setEditingStagiaire] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce stagiaire ?")) {
      setStagiaires(stagiaires.filter(stagiaire => stagiaire.id !== id));
    }
  };

  const handleEdit = (stagiaire) => {
    setEditingStagiaire(stagiaire);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingStagiaire(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingStagiaire(null);
  };

  // Cette fonction sera appelée après l'ajout ou la modification d'un stagiaire
  const handleFormSubmit = (formData) => {
    if (editingStagiaire) {
      // Mise à jour d'un stagiaire existant
      setStagiaires(stagiaires.map(s => s.id === editingStagiaire.id ? { ...formData, id: s.id } : s));
    } else {
      // Ajout d'un nouveau stagiaire
      const newId = stagiaires.length > 0 ? Math.max(...stagiaires.map(s => s.id)) + 1 : 1;
      setStagiaires([...stagiaires, { ...formData, id: newId }]);
    }
    setShowForm(false);
  };

  return (
    <div className="page-container">
      {showForm ? (
        <div className="form-overlay">
          <div className="form-container">
            <div className="form-header">
              <h3>{editingStagiaire ? "Modifier le stagiaire" : "Ajouter un stagiaire"}</h3>
              <button className="close-button" onClick={handleFormClose}>×</button>
            </div>
            <StagiaireForm 
              initialData={editingStagiaire} 
              onSubmit={handleFormSubmit} 
              onCancel={handleFormClose}
            />
          </div>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-header">
            <h2>Liste des Stagiaires</h2>
            <button className="btn-primary" onClick={handleAddNew}>+ Ajouter un stagiaire</button>
          </div>
          
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Numéro de stage</th>
                <th>Spécialité</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stagiaires.map((stagiaire) => (
                <tr key={stagiaire.id}>
                  <td>{stagiaire.id}</td>
                  <td>{stagiaire.nom}</td>
                  <td>{stagiaire.prenom}</td>
                  <td>{stagiaire.numeroStage}</td>
                  <td>{stagiaire.specialite}</td>
                  <td className="actions-cell">
                    <button className="btn-edit" onClick={() => handleEdit(stagiaire)}>Modifier</button>
                    <button className="btn-delete" onClick={() => handleDelete(stagiaire.id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
              {stagiaires.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-table">Aucun stagiaire disponible</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default StagiairesPage;