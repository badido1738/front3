import React, { useState } from "react";

function StageForm() {
  const [formData, setFormData] = useState({
    idStage: "",
    dateDebut: "",
    dateFin: "",
    duree: "",
    jourDeRecep: "",
    typeDePC: "",
    type: "",
    idDirection: "",
    idEnca: "",
    idTheme: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Stage ajouté : ${formData.idStage}`);
    console.log("Données soumises :", formData);
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h3>Veuillez saisir les informations du stage</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>ID Stage :</label>
              <input
                type="text"
                name="idStage"
                className="form-input"
                placeholder="Entrer l'ID du stage"
                required
                value={formData.idStage}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Date de Début :</label>
              <input
                type="date"
                name="dateDebut"
                className="form-input"
                required
                value={formData.dateDebut}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Date de Fin :</label>
              <input
                type="date"
                name="dateFin"
                className="form-input"
                required
                value={formData.dateFin}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Durée :</label>
              <input
                type="text"
                name="duree"
                className="form-input"
                placeholder="Entrer la durée"
                required
                value={formData.duree}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Jour de Réception :</label>
              <input
                type="text"
                name="jourDeRecep"
                className="form-input"
                placeholder="Jour de réception"
                required
                value={formData.jourDeRecep}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Type de Pointage :</label>
              <input
                type="text"
                name="typeDePC"
                className="form-input"
                placeholder="Type de pointage"
                required
                value={formData.typeDePC}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Type :</label>
              <input
                type="text"
                name="type"
                className="form-input"
                placeholder="Type de stage"
                required
                value={formData.type}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>ID Direction :</label>
              <input
                type="text"
                name="idDirection"
                className="form-input"
                placeholder="ID de direction"
                required
                value={formData.idDirection}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>ID Enca :</label>
              <input
                type="text"
                name="idEnca"
                className="form-input"
                placeholder="ID Enca"
                required
                value={formData.idEnca}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>ID Thème :</label>
              <input
                type="text"
                name="idTheme"
                className="form-input"
                placeholder="ID Thème"
                required
                value={formData.idTheme}
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

export default StageForm;
