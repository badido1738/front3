import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import StagiaireForm from "../form/StagiaireForm";
import "../form/form.css";
import"../pages/page.css";


function StagiairesPage() {
  const [showForm, setShowForm] = useState(false);
  const [stagiaires, setStagiaires] = useState([]);
  const [editingStagiaire, setEditingStagiaire] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/sa')
      .then(res => {
        return res.json();
      })
      .then(data => {
        setStagiaires(data);
      })
  }, [])


  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce stagiaire ?")) {
      try {
        const response = await fetch(`http://localhost:8080/sa/${id}`, {
          method: "DELETE",
        });
  
        if (response.ok) {
          window.location.reload();
          setStagiaires(stagiaires.filter(stagiaire => stagiaire.id !== id));
          console.log("Stagiaire supprimé avec succès");
        } else {
          const errorText = await response.text();
          console.error("Erreur lors de la suppression :", errorText);
        }
      } catch (error) {
        console.error("Erreur réseau :", error);
      }
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

  const handleFormSubmit = async (formData) => {  
    setShowForm(false);
    setEditingStagiaire(null);
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
                <tr key={stagiaire.idAS}>
                  <td>{stagiaire.idAS}</td>
                  <td>{stagiaire.nom}</td>
                  <td>{stagiaire.prenom}</td>
                  <td>{stagiaire.idStage}</td>
                  <td>{stagiaire.idSpecialite}</td> 
                  <td className="actions-cell">
                    <button className="btn-edit" onClick={() => handleEdit(stagiaire)}>Modifier</button>
                    <button className="btn-delete" onClick={() => handleDelete(stagiaire.idAS)}>Supprimer</button>
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