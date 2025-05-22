import React, { useState, useEffect } from "react";
import "../form/form.css";

function StagiaireForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    dateN: "",
    numTel: "",
    type: "",
    email: "",
    niveauEtude: "",
    idStage: "",
    idEtab: "",
    idspecialite: ""
  });

  const [stages, setStages] = useState([]);
  const [etablissements, setEtablissements] = useState([]);
  const [specialites, setSpecialites] = useState([]);

  const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      throw new Error('No authentication token');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        window.location.href = '/login';
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  };

  useEffect(() => {
    const fetchSpecialites = async () => {
      try {
        const response = await authFetch("http://localhost:8080/specialites");
        const data = await response.json();
        setSpecialites(data);
      } catch (err) {
        console.error("Error fetching specialites:", err);
      }
    };
    fetchSpecialites();
  }, []);

  useEffect(() => {
    const fetchEtablissements = async () => {
      try {
        const response = await authFetch("http://localhost:8080/etablissements");
        const data = await response.json();
        setEtablissements(data);
      } catch (err) {
        console.error("Error fetching etablissements:", err);
      }
    };
    fetchEtablissements();
  }, []);

  useEffect(() => {
    const fetchStages = async () => {
      try {
        const response = await authFetch("http://localhost:8080/stages");
        const data = await response.json();
        setStages(data);
      } catch (error) {
        console.error("Error fetching stages:", error);
      }
    };
    fetchStages();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        nom: initialData.nom || "",
        prenom: initialData.prenom || "",
        dateN: initialData.dateN|| "",
        numTel: initialData.numTel || "",
        email: initialData.email || "",
        niveauEtude: initialData.niveauEtude || "",
        type: initialData.type || "",
        idStage: initialData.stage?.idStage || "",
        idEtab: initialData.etablissement?.idEtab || "",
        idspecialite: initialData.specialite?.idspecialite || ""
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const action = initialData ? "modifier" : "ajouter";
  if (!window.confirm(`Êtes-vous sûr de vouloir ${action} ce stagiaire ?`)) {
    return;
  }

  try {
    const payload = {
      nom: formData.nom,
      prenom: formData.prenom,
      dateN: formData.dateN,
      numTel: formData.numTel,
      type: formData.type,
      email: formData.email,
      niveauEtude: formData.niveauEtude,
      stage: formData.idStage ? { idStage: formData.idStage } : null,
      etablissement: formData.idEtab ? { idEtab: formData.idEtab } : null,
      specialite: formData.idspecialite ? { idspecialite: formData.idspecialite } : null
    };

    const url = initialData
      ? `http://localhost:8080/stagiaires/${initialData.idAS}`
      : "http://localhost:8080/stagiaires";

    const method = initialData ? "PUT" : "POST";

    const response = await authFetch(url, {
      method,
      body: JSON.stringify(payload),
    });

    let data = null;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    }

    console.log(`Stagiaire ${initialData ? "modifié" : "ajouté"} avec succès:`, data);
    onSubmit(data);

    if (window.confirm(`Stagiaire ${initialData ? "modifié" : "ajouté"} avec succès! Actualiser la page ?`)) {
      window.location.reload();
    }
  } catch (error) {
    console.error("Erreur:", error);
    alert(`Erreur: ${error.message}`);
  }
};


  return (
    <div className="form-container">
      <div className="form-card">
        {/* En-tête de formulaire avec l'icône X de fermeture */}
        <div className="form-app-header">
          <h2>{initialData ? "Modifier un stagiaire" : "Ajouter un stagiaire"}</h2>
          <button type="button" className="close-tab-button" onClick={onCancel} aria-label="Fermer">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
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
              <label>Date de Naissance :</label>
              <input
                type="date"
                name="dateN"
                className="form-input"
                required
                value={formData.dateN}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Numéro de téléphone :</label>
              <input 
                type="tel" 
                name="numTel" 
                className="form-input"
                placeholder="Entrer le numéro" 
                value={formData.numTel} 
                onChange={handleChange} 
              />
            </div>

            <div className="form-group">
              <label>Type :</label>
              <select 
                name="type" 
                className="form-select"
                value={formData.type} 
                onChange={handleChange}
              >
                <option value="">- Sélectionner le type -</option>
                <option value="Stagiaire">Stagiaire</option>
                <option value="Apprentis">Apprentis</option>
              </select>
            </div>

            <div className="form-group">
              <label>E-mail :</label>
              <input 
                type="email" 
                name="email" 
                className="form-input"
                placeholder="Entrer l'e-mail" 
                value={formData.email} 
                onChange={handleChange} 
              />
            </div>

            <div className="form-group">
              <label>Niveau d'étude :</label>
              <select 
                name="niveauEtude" 
                className="form-select"
                value={formData.niveauEtude} 
                onChange={handleChange}
              >
                <option value="">- Sélectionner le niveau -</option>
                <option value="premiére">premiére</option>
                <option value="troisiéme">troisiéme</option>
                <option value="quatrieme">quatrieme</option>
                <option value="cinquéme">cinquéme</option>
              </select>
            </div>

            <div className="form-group">
              <label>Spécialité :</label>
              <select
                name="idspecialite"
                className="form-select"
                value={formData.idspecialite}
                onChange={handleChange}
              >
                <option value="">-- Sélectionnez une spécialité --</option>
                {specialites.map(spec => (
                  <option key={spec.idspecialite} value={spec.idspecialite}>
                    {spec.nom}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Établissement :</label>
              <select 
                name="idEtab" 
                className="form-select"
                value={formData.idEtab}
                onChange={handleChange}
              >
                <option value="">-- Sélectionner un établissement --</option>
                {etablissements.map(etab => (
                  <option key={etab.idEtab} value={etab.idEtab}>
                    {etab.nomEtab}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Stage :</label>
              <select 
                name="idStage" 
                className="form-select"
                value={formData.idStage} 
                onChange={handleChange}
              >
                <option value="">- Sélectionner un stage -</option>
                {stages.map((stage) => (
                  <option key={stage.idStage} value={stage.idStage}>
                    {stage.titre}
                  </option>
                ))}
              </select>
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

export default StagiaireForm;