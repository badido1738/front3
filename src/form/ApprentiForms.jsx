import React, { useState, useEffect } from "react";
import "../form/form.css";

function ApprentiForms({ initialData, onSubmit, onCancel }) {
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
    

  // Initialiser le formulaire avec les données existantes pour modification
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
  if (!window.confirm(`Êtes-vous sûr de vouloir ${action} cet apprenti ?`)) {
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
      ? `http://localhost:8080/apprentis/${initialData.idAS}`
      : "http://localhost:8080/apprentis";

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

    console.log(`Apprenti ${initialData ? "modifié" : "ajouté"} avec succès:`, data);
    onSubmit(data);

    if (window.confirm(`Apprenti ${initialData ? "modifié" : "ajouté"} avec succès! Actualiser la page ?`)) {
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
          <h2>{initialData ? "Modifier un apprenti" : "Ajouter un apprenti"}</h2>
          <button type="button" className="close-tab-button" onClick={onCancel} aria-label="Fermer">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Ajout d'un champ caché pour l'ID si on est en mode édition */}
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
              <label>Date de naissance :</label>
              <input 
                type="date" 
                name="dateNaissance" 
                className="form-input"
                //required 
                value={formData.dateNaissance} 
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
                //required 
                value={formData.email} 
                onChange={handleChange} 
              />
            </div>

            <div className="form-group">
              <label>Numéro de téléphone :</label>
              <input 
                type="tel" 
                name="telephone" 
                className="form-input"
                placeholder="Entrer le numéro" 
                //required 
                value={formData.telephone} 
                onChange={handleChange} 
              />
            </div>

            <div className="form-group">
              <label>Numéro CCP :</label>
              <input 
                type="text" 
                name="numeroCCP" 
                className="form-input"
                placeholder="Entrer le numéro CCP" 
                //required 
                value={formData.numeroCCP} 
                onChange={handleChange} 
              />
            </div>

            <div className="form-group">
              <label>Type :</label>
              <select 
                name="type" 
                className="form-select"
                //required 
                value={formData.type} 
                onChange={handleChange}
              >
                <option value="">- Sélectionner le type -</option>
                <option value="Stage Pratique">Stage Pratique</option>
                <option value="Stage PFE">Stage PFE</option>
              </select>
            </div>

            <div className="form-group">
              <label>Niveau d'étude :</label>
              <select 
                name="niveauEtude" 
                className="form-select"
                //required 
                value={formData.niveauEtude} 
                onChange={handleChange}
              >
                <option value="">- Sélectionner le niveau -</option>
                <option value="Bac">Bac</option>
                <option value="Licence">Licence</option>
                <option value="Master">Master</option>
                <option value="Doctorat">Doctorat</option>
              </select>
            </div>

            <div className="form-group">
              <label>Numéro de stage :</label>
              <select 
                name="numeroStage" 
                className="form-select"
                //required 
                value={formData.numeroStage} 
                onChange={handleChange}
              >
                <option value="">- Sélectionner le numéro-</option>
                <option value="n1">n1</option>
                <option value="n2">n2</option>
              </select> 
            </div>

            <div className="form-group">
              <label>Spécialité :</label>
              <select 
                name="specialite" 
                className="form-select"
                //required 
                value={formData.specialite} 
                onChange={handleChange}
              >
                <option value="">- Sélectionner la spécialité -</option>
                <option value="Informatique">Informatique</option>
                <option value="Électronique">Électronique</option>
                <option value="Mécanique">Mécanique</option>
                <option value="Génie Civil">Génie Civil</option>
                <option value="Automatisme">Automatisme</option>
                <option value="HSE">HSE</option>
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

export default ApprentiForms;