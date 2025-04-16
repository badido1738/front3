import React, { useState } from "react";

function ProfileForm() {
  const [formData, setFormData] = useState({
    idUser: "",
    nom: "",
    role: "",
    motDePasse: "",
    idEmp: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Utilisateur ajouté : ${formData.nom}`);
    console.log("Données soumises :", formData);
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h3>Veuillez saisir les informations de l'utilisateur</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>ID Utilisateur :</label>
              <input
                type="text"
                name="idUser"
                className="form-input"
                placeholder="Entrer l'ID de l'utilisateur"
                required
                value={formData.idUser}
                onChange={handleChange}
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
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileForm;
