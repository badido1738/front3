import React, { useState } from "react";
import { Link } from "react-router-dom";
import ThemesForm from "../form/ThemesForm";
import "../form/form.css";
import"../pages/page.css";

function ThemesPage() {
  const [showForm, setShowForm] = useState(false);
  const [themes, setThemes] = useState([
    {
      idTheme: 1,
      titre: "Développement d'une application web de gestion",
      description: "Création d'une application web pour la gestion des stagiaires et apprentis."
    },
    {
      idTheme: 2,
      titre: "Étude sur l'automatisation des processus industriels",
      description: "Analyse et mise en place de solutions pour automatiser les processus de production."
    },
    {
        idTheme: 3,
        titre: " ....... ",
        description: "......."
      },
    
      {
        idTheme: 4,
        titre: "...........",
        description: "............"
      },
  ]);
  
  const [editingTheme, setEditingTheme] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce thème ?")) {
      setThemes(themes.filter(theme => theme.idTheme !== id));
    }
  };

  const handleEdit = (theme) => {
    setEditingTheme(theme);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingTheme(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTheme(null);
  };

  // Cette fonction sera appelée après l'ajout ou la modification d'un thème
  const handleFormSubmit = (formData) => {
    if (editingTheme) {
      // Mise à jour d'un thème existant
      setThemes(themes.map(t => t.idTheme === editingTheme.idTheme ? { ...formData } : t));
    } else {
      // Ajout d'un nouveau thème
      const newId = themes.length > 0 ? Math.max(...themes.map(t => t.idTheme)) + 1 : 1;
      setThemes([...themes, { ...formData, idTheme: newId }]);
    }
    setShowForm(false);
  };

  return (
    <div className="page-container">
      {showForm ? (
        <div className="form-overlay">
          <div className="form-container">
            <div className="form-header">
              <h3>{editingTheme ? "Modifier le thème" : "Ajouter un thème"}</h3>
              <button className="close-button" onClick={handleFormClose}>×</button>
            </div>
            <ThemesForm 
              initialData={editingTheme} 
              onSubmit={handleFormSubmit} 
              onCancel={handleFormClose}
            />
          </div>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-header">
            <h2>Liste des Thèmes</h2>
            <button className="btn-primary" onClick={handleAddNew}>+ Ajouter un thème</button>
          </div>
          
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Titre</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {themes.map((theme) => (
                <tr key={theme.idTheme}>
                  <td>{theme.idTheme}</td>
                  <td>{theme.titre}</td>
                  <td className="description-cell">{theme.description.length > 100 ? theme.description.substring(0, 100) + '...' : theme.description}</td>
                  <td className="actions-cell">
                    <button className="btn-edit" onClick={() => handleEdit(theme)}>Modifier</button>
                    <button className="btn-delete" onClick={() => handleDelete(theme.idTheme)}>Supprimer</button>
                  </td>
                </tr>
              ))}
              {themes.length === 0 && (
                <tr>
                  <td colSpan="4" className="empty-table">Aucun thème disponible</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ThemesPage;