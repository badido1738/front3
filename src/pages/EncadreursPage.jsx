import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import EncadreursForm from "../form/EncadreursForm";
import "../form/form.css";
import"../pages/page.css";

function EncadreursPage() {
  const [showForm, setShowForm] = useState(false);
  const [encadreurs, setEncadreurs] = useState([]);
  
  const [editingEncadreur, setEditingEncadreur] = useState(null);

    useEffect(() => {
      fetch('http://localhost:8080/encadrants')
        .then(res => {
          return res.json();
        })
        .then(data => {
          setEncadreurs(data);
        })
    }, [])

    const handleDelete = async (id) => {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer cet encardrant ?")) {
        try {
          const response = await fetch(`http://localhost:8080/encadrants/${id}`, {
            method: "DELETE",
          });
    
          if (response.ok) {
            window.location.reload();
            setEncadrants(stagiaires.filter(encadrant => encadrant.id !== id));
            console.log("Encadrant supprimé avec succès");
          } else {
            const errorText = await response.text();
            console.error("Erreur lors de la suppression :", errorText);
          }
        } catch (error) {
          console.error("Erreur réseau :", error);
        }
      }
    };

  const handleEdit = (encadreur) => {
    setEditingEncadreur(encadreur);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingEncadreur(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingEncadreur(null);
  };

  // Cette fonction sera appelée après l'ajout ou la modification d'un encadreur
  const handleFormSubmit = (formData) => {
    if (editingEncadreur) {
      // Mise à jour d'un encadreur existant
      setEncadreurs(encadreurs.map(e => e.idEncd === editingEncadreur.idEncd ? { ...formData } : e));
    } else {
      // Ajout d'un nouveau encadreur
      const newId = encadreurs.length > 0 ? Math.max(...encadreurs.map(e => e.idEncd)) + 1 : 1;
      setEncadreurs([...encadreurs, { ...formData, idEncd: newId }]);
    }
    setShowForm(false);
  };

  return (
    <div className="page-container">
      {showForm ? (
        <div className="form-overlay">
          <div className="form-container">
            <div className="form-header">
              <h3>{editingEncadreur ? "Modifier l'encadreur" : "Ajouter un encadreur"}</h3>
              <button className="close-button" onClick={handleFormClose}>×</button>
            </div>
            <EncadreursForm 
              initialData={editingEncadreur} 
              onSubmit={handleFormSubmit} 
              onCancel={handleFormClose}
            />
          </div>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-header">
            <h2>Liste des Encadreurs</h2>
            <button className="btn-primary" onClick={handleAddNew}>+ Ajouter un encadreur</button>
          </div>
          
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Poste</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {encadreurs.map((encadreur) => (
                <tr key={encadreur.idEncd}>
                  <td>{encadreur.idEncd}</td>
                  <td>{encadreur.nom}</td>
                  <td>{encadreur.prenom}</td>
                  <td>{encadreur.poste}</td>
                  <td>{encadreur.email}</td>
                  <td className="actions-cell">
                    <button className="btn-edit" onClick={() => handleEdit(encadreur)}>Modifier</button>
                    <button className="btn-delete" onClick={() => handleDelete(encadreur.idEncd)}>Supprimer</button>
                  </td>
                </tr>
              ))}
              {encadreurs.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-table">Aucun encadreur disponible</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default EncadreursPage;