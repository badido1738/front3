import React, { useState } from "react";
import "./DocumentsGeneration.css";

function DocumentsGeneration({ listeStagiaires, listeStages, listeApprentis }) {
  const [selectedDocument, setSelectedDocument] = useState("");
  const [selectedItem, setSelectedItem] = useState("");

  const renderSecondSelect = () => {
    if (!selectedDocument) return null;

    let options = [];
    let label = "";

    switch (selectedDocument) {
      case "attestation":
        options = listeStagiaires || [];
        label = "Sélectionner le stagiaire";
        break;
      case "priseEnCharge":
        options = listeStages || [];
        label = "Sélectionner le stage";
        break;
      case "fichePosition":
        options = listeApprentis || [];
        label = "Sélectionner l'apprenti";
        break;
    }

    return (
      <div className="form-group">
        <label className="form-label">{label}</label>
        <select
          className="form-select"
          value={selectedItem}
          onChange={(e) => setSelectedItem(e.target.value)}
        >
          <option value="">-- Sélectionner --</option>
          {options.map((item) => (
            <option key={item.id} value={item.id}>
              {selectedDocument === "priseEnCharge" 
                ? `${item.sujet || item.titre} (ID: ${item.id})`
                : selectedDocument === "attestation"
                ? `${item.nom} ${item.prenom} (ID: ${item.id})`
                : `${item.nom} ${item.prenom}`
              }
            </option>
          ))}
        </select>
      </div>
    );
  };

  const handleDocumentGeneration = () => {
    if (!selectedItem) {
      alert("Veuillez sélectionner un élément");
      return;
    }

    switch (selectedDocument) {
      case "priseEnCharge":
        generatePriseEnCharge(selectedItem);
        break;
      case "attestation":
        generateAttestation(selectedItem);
        break;
      case "fichePosition":
        generateFichePosition(selectedItem);
        break;
      default:
        alert("Veuillez sélectionner un type de document");
    }
  };

  const generatePriseEnCharge = (stageId) => {
    console.log("Génération de la prise en charge pour le stage:", stageId);
  };

  const generateAttestation = (stagiaireId) => {
    console.log("Génération de l'attestation pour le stagiaire:", stagiaireId);
  };

  const generateFichePosition = (apprentiId) => {
    console.log("Génération de la fiche de position pour l'apprenti:", apprentiId);
  };

  return (
    <div className="documents-container">
      <div className="documents-card">
        <h2 className="documents-title">Génération de Documents</h2>
        <div className="documents-form">
          <div className="form-group">
            <label htmlFor="documentType" className="form-label">
              Type de document
            </label>
            <select
              className="form-select"
              id="documentType"
              value={selectedDocument}
              onChange={(e) => {
                setSelectedDocument(e.target.value);
                setSelectedItem("");
              }}
            >
              <option value="">Sélectionnez un type de document</option>
              <option value="priseEnCharge">Prise en charge</option>
              <option value="attestation">Attestation</option>
              <option value="fichePosition">Fiche de position</option>
            </select>
          </div>
          {renderSecondSelect()}
          <button
            className="generate-btn"
            onClick={handleDocumentGeneration}
            disabled={!selectedDocument || !selectedItem}
          >
            <i className="fas fa-file-pdf"></i>
            Générer le document
          </button>
        </div>
      </div>
    </div>
  );
}

export default DocumentsGeneration;