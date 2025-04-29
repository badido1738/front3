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

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const action = initialData ? "modifier" : "ajouter";
    if (!window.confirm(`Êtes-vous sûr de vouloir ${action} ce theme ?`)) {
      return;
    }
  
    try {
      const url = initialData 
        ? `http://localhost:8080/themes/${initialData.idTheme}`
        : "http://localhost:8080/themes";
  
      const method = initialData ? "PUT" : "POST";
  
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(`Theme ${initialData ? "modifié" : "ajouté"} avec succès:`, data);
        onSubmit(data);
        
        if (window.confirm(`Theme ${initialData ? "modifié" : "ajouté"} avec succès! Actualiser la page ?`)) {
          window.location.reload();
        }
      } else {
        const errorText = await response.text();
        console.error("Erreur lors de l'envoi:", errorText);
        alert(`Erreur: ${errorText}`);
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
      alert("Erreur de connexion au serveur. Veuillez réessayer plus tard.");
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        {/* En-tête de formulaire avec l'icône X de fermeture */}
        <div className="form-app-header">
          <h2>{initialData ? "Modifier un thème" : "Ajouter un thème"}</h2>
          <button type="button" className="close-tab-button" onClick={onCancel} aria-label="Fermer">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Ajout d'un champ caché pour l'ID si on est en mode édition */}
            {initialData && (
              <input type="hidden" name="idTheme" value={formData.idTheme} />
            )}
            
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
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-primary">
              {initialData ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ThemesForm;