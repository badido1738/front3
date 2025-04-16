import React, { useState } from "react";

function FichePositionForm() {
  const [formData, setFormData] = useState({
    idPosition: "",
    titrePoste: "",
    typePoste: "",
    description: "",
    exigences: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Position ajoutée : ${formData.titrePoste}`);
    console.log("Données soumises :", formData);
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h3>Veuillez saisir les informations de la position</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>ID Position :</label>
              <input
                type="text"
                name="idPosition"
                className="form-input"
                placeholder="Entrer l'ID de la position"
                required
                value={formData.idPosition}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Titre du Poste :</label>
              <input
                type="text"
                name="titrePoste"
                className="form-input"
                placeholder="Entrer le titre du poste"
                required
                value={formData.titrePoste}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Type de Poste :</label>
              <input
                type="text"
                name="typePoste"
                className="form-input"
                placeholder="Entrer le type du poste"
                required
                value={formData.typePoste}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Description :</label>
              <textarea
                name="description"
                className="form-input"
                placeholder="Décrire la position"
                required
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Exigences :</label>
              <textarea
                name="exigences"
                className="form-input"
                placeholder="Décrire les exigences"
                required
                value={formData.exigences}
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

export default FichePositionForm;
