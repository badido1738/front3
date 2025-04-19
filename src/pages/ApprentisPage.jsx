import React, { useState } from "react";
import { Link } from "react-router-dom";
import ApprentiForms from "../form/ApprentiForms";
import "../form/form.css";
import"../pages/page.css";

function ApprentisPage() {
  const [showForm, setShowForm] = useState(false);
  const [apprentis, setApprentis] = useState([
    {
      idApprenti: 1,
      nom: "Dubois",
      prenom: "Marie",
      numeroCCP: "CCP12345",
      specialite: "Mécanique"
    },
    {
      idApprenti: 2,
      nom: "Leroy",
      prenom: "Thomas",
      numeroCCP: "CCP67890",
      specialite: "Génie Civil"
    },
    // Vous pouvez ajouter d'autres données de test ici
  ]);
  
  const [editingApprenti, setEditingApprenti] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet apprenti ?")) {
      setApprentis(apprentis.filter(apprenti => apprenti.idApprenti !== id));
    }
  };

  const handleEdit = (apprenti) => {
    setEditingApprenti(apprenti);
    setShowForm(true);
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

  return (
    <div className="page-container">
      {showForm ? (
        <div className="form-overlay">
          <div className="form-container">
            <div className="form-header">
              <h3>{editingApprenti ? "Modifier l'apprenti" : "Ajouter un apprenti"}</h3>
              <button className="close-button" onClick={handleFormClose}>×</button>
            </div>
            <ApprentiForms 
              initialData={editingApprenti} 
              onSubmit={handleFormSubmit} 
              onCancel={handleFormClose}
            />
          </div>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-header">
            <h2>Liste des Apprentis</h2>
            <button className="btn-primary" onClick={handleAddNew}>+ Ajouter un apprenti</button>
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
              {apprentis.map((apprenti) => (
                <tr key={apprenti.idApprenti}>
                  <td>{apprenti.idApprenti}</td>
                  <td>{apprenti.nom}</td>
                  <td>{apprenti.prenom}</td>
                  <td>{apprenti.numeroCCP}</td>
                  <td>{apprenti.specialite}</td>
                  <td className="actions-cell">
                    <button className="btn-edit" onClick={() => handleEdit(apprenti)}>Modifier</button>
                    <button className="btn-delete" onClick={() => handleDelete(apprenti.idApprenti)}>Supprimer</button>
                  </td>
                </tr>
              ))}
              {apprentis.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-table">Aucun apprenti disponible</td>
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