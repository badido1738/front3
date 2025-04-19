import React, { useState, useEffect } from "react";
import "../form/form.css";

function ThemesForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    idTheme: "",
    titre: "",
    description: ""
  });

  // Initialiser le formulaire avec les données existantes pour modification
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        // Assurez-vous que toutes les propriétés nécessaires sont présentes
        idTheme: initialData.idTheme || "",
        titre: initialData.titre || "",
        description: initialData.description || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h3>Veuillez saisir les informations du thème</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Ajout d'un champ caché pour l'ID si on est en mode édition */}
            {initialData && (
              <input type="hidden" name="idTheme" value={formData.idTheme} />
            )}
            
            <div className="form-group">
              <label>ID Thème :</label>
              <input 
                type="text" 
                name="idTheme" 
                className="form-input"
                placeholder="Entrer l'ID du thème" 
                required 
                value={formData.idTheme} 
                onChange={handleChange} 
                disabled={initialData ? true : false}
              />
            </div>
            
            <div className="form-group">
              <label>Titre :</label>
              <input 
                type="text" 
                name="titre" 
                className="form-input"
                placeholder="Entrer le titre du thème" 
                required 
                value={formData.titre} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description détaillée :</label>
            <textarea 
              name="description" 
              className="form-input"
              placeholder="Description détaillée du thème"
              rows="4"
              required
              value={formData.description} 
              onChange={handleChange} 
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-primary">
              {initialData ? "Modifier" : "Ajouter le thème"}
            </button>
            {onCancel && (
              <button type="button" className="btn-secondary" onClick={onCancel}>
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ThemesForm;