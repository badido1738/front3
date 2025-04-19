import React, { useState, useEffect } from "react";
import "../form/form.css";

function EncadreursForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    idEncd: "",
    nom: "",
    prenom: "",
    poste: "",
    fonction: "",
    email: "",
  });

  // Initialiser le formulaire avec les données existantes pour modification
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        // Assurez-vous que toutes les propriétés nécessaires sont présentes
        idEncd: initialData.idEncd || "",
        nom: initialData.nom || "",
        prenom: initialData.prenom || "",
        poste: initialData.poste || "",
        fonction: initialData.fonction || "",
        email: initialData.email || "",
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
        <h3>Veuillez saisir les informations de l'encadreur</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Ajout d'un champ caché pour l'ID si on est en mode édition */}
            {initialData && (
              <input type="hidden" name="idEncd" value={formData.idEncd} />
            )}
            
            <div className="form-group">
              <label>ID Encadreur :</label>
              <input 
                type="text" 
                name="idEncd" 
                className="form-input"
                placeholder="Entrer l'ID de l'encadreur" 
                required 
                value={formData.idEncd} 
                onChange={handleChange} 
                disabled={initialData ? true : false}
              />
            </div>
            
            <div className="form-group">
              <label>Nom :</label>
              <input 
                type="text" 
                name="nom" 
                className="form-input"
                placeholder="Entrer le nom" 
                required 
                value={formData.nom} 
                onChange={handleChange} 
              />
            </div>

            <div className="form-group">
              <label>Prénom :</label>
              <input 
                type="text" 
                name="prenom" 
                className="form-input"
                placeholder="Entrer le prénom" 
                required 
                value={formData.prenom} 
                onChange={handleChange} 
              />
            </div>

            <div className="form-group">
              <label>Poste :</label>
              <input 
                type="text" 
                name="poste" 
                className="form-input"
                placeholder="Entrer le poste" 
                required 
                value={formData.poste} 
                onChange={handleChange} 
              />
            </div>

            <div className="form-group">
              <label>Fonction :</label>
              <input 
                type="text" 
                name="fonction" 
                className="form-input"
                placeholder="Entrer la fonction" 
                required 
                value={formData.fonction} 
                onChange={handleChange} 
              />
            </div>

            <div className="form-group">
              <label>E-mail :</label>
              <input 
                type="email" 
                name="email" 
                className="form-input"
                placeholder="Entrer l'e-mail" 
                required 
                value={formData.email} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-primary">
              {initialData ? "Modifier" : "Ajouter"}
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

export default EncadreursForm;