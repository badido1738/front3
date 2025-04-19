import React, { useState, useEffect } from "react";
import "../form/form.css";

function StageForm({ initialData, onSubmit, onCancel }) {
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

  // Initialiser le formulaire avec les données existantes pour modification
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        jourDeRecep: initialData.jourDeRecep || "",
        typeDePC: initialData.typeDePC || "",
        idEnca: initialData.idEnca || "",
        idTheme: initialData.idTheme || ""
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
            <input type="hidden" name="idStage" value={formData.idStage} />
          )}

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
            <select
              name="type"
              className="form-select"
              required
              value={formData.type}
              onChange={handleChange}
            >
              <option value="">- Sélectionner le type -</option>
              <option value="Stage Pratique">Stage Pratique</option>
              <option value="Stage PFE">Stage PFE</option>
            </select>
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

export default StageForm;