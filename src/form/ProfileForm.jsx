import React, { useState, useEffect } from "react";
import "../form/form.css";

function ProfileForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    idUser: "",
    nom: "",
    role: "",
    motDePasse: "",
    idEmp: "",
  });

  // Initialiser le formulaire avec les données existantes pour modification
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        motDePasse: initialData.motDePasse || "",
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
    <div className="form-card">
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {initialData && (
            <input type="hidden" name="idUser" value={formData.idUser} />
          )}
          
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
            <label>Rôle :</label>
            <input
              type="text"
              name="role"
              className="form-input"
              placeholder="Entrer le rôle"
              required
              value={formData.role}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Mot de Passe :</label>
            <input
              type="password"
              name="motDePasse"
              className="form-input"
              placeholder="Entrer le mot de passe"
              required
              value={formData.motDePasse}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>ID Employé :</label>
            <input
              type="text"
              name="idEmp"
              className="form-input"
              placeholder="Entrer l'ID employé"
              required
              value={formData.idEmp}
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
  );
}

export default ProfileForm;