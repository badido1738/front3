import React, { useState } from "react";

function DocumentsForm() {
  const [formData, setFormData] = useState({
    idDoc: "",
    typeDoc: "",
    description: "",
    pieceJointe: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Document ajouté : ${formData.typeDoc}`);
    console.log("Données soumises :", formData);
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h3>Veuillez saisir les informations du document</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>ID Document :</label>
              <input
                type="text"
                name="idDoc"
                className="form-input"
                placeholder="Entrer l'ID du document"
                required
                value={formData.idDoc}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Type de Document :</label>
              <input
                type="text"
                name="typeDoc"
                className="form-input"
                placeholder="Entrer le type de document"
                required
                value={formData.typeDoc}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Description :</label>
              <textarea
                name="description"
                className="form-input"
                placeholder="Décrire le document"
                required
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Pièce Jointe :</label>
              <input
                type="file"
                name="pieceJointe"
                className="form-input"
                required
                onChange={(e) => setFormData({ ...formData, pieceJointe: e.target.files[0] })}
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

export default DocumentsForm;
