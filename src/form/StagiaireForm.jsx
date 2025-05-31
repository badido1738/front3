import React, { useState, useEffect } from "react";
import "../form/form.css";

function StagiaireForm({ initialData, onSubmit, onCancel }) {
  // Main form state
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    dateN: "",
    numTel: "",
    lieuN: "",
    email: "",
    niveauEtude: "",
    idStage: "",
    idEtab: "",
    idspecialite: ""
  });

  // Secondary form states
  const [showSpecialiteForm, setShowSpecialiteForm] = useState(false);
  const [showEtabForm, setShowEtabForm] = useState(false);
  const [newSpecialite, setNewSpecialite] = useState({ nom: '' });
  const [newEtablissement, setNewEtablissement] = useState({
    nomEtab: '',
    adr: '',
    typeEtab: ''
  });

  // Other states
  const [errors, setErrors] = useState({});
  const [stages, setStages] = useState([]);
  const [etablissements, setEtablissements] = useState([]);
  const [specialites, setSpecialites] = useState([]);

  // Auth fetch utility
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

  // Initial data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [specialitesRes, etablissementsRes, stagesRes] = await Promise.all([
          authFetch("http://localhost:8080/specialites"),
          authFetch("http://localhost:8080/etablissements"), 
          authFetch("http://localhost:8080/stages")
        ]);

        const [specialitesData, etablissementsData, stagesData] = await Promise.all([
          specialitesRes.json(),
          etablissementsRes.json(),
          stagesRes.json()
        ]);

        setSpecialites(specialitesData);
        setEtablissements(etablissementsData);
        setStages(stagesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Initialize form with existing data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        nom: initialData.nom || "",
        prenom: initialData.prenom || "",
        dateN: initialData.dateN || "",
        numTel: initialData.numTel || "",
        lieuN: initialData.lieuN || "",
        email: initialData.email || "",
        niveauEtude: initialData.niveauEtude || "",
        idStage: initialData.stage?.idStage || "",
        idEtab: initialData.etablissement?.idEtab || "",
        idspecialite: initialData.specialite?.idspecialite || ""
      });
    }
  }, [initialData]);

  // Form validation
  const validate = () => {
    const newErrors = {};

    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est requis.";
    } else if (!/^[A-Za-zÀ-ÿ\s\-]{2,50}$/.test(formData.nom)) {
      newErrors.nom = "Nom invalide (lettres, espaces, tirets, 2-50 caractères).";
    }

    if (!formData.prenom.trim()) {
      newErrors.prenom = "Le prénom est requis.";
    } else if (!/^[A-Za-zÀ-ÿ\s\-]{2,50}$/.test(formData.prenom)) {
      newErrors.prenom = "Prénom invalide (lettres, espaces, tirets, 2-50 caractères).";
    }

    if (!formData.dateN) {
      newErrors.dateN = "La date de naissance est requise.";
    } else {
      const birthDate = new Date(formData.dateN);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear() - 
        (today.getMonth() < birthDate.getMonth() || 
        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate()) ? 1 : 0);
      
      if (birthDate > today) {
        newErrors.dateN = "La date de naissance doit être dans le passé.";
      } else if (age < 17) {
        newErrors.dateN = "L'âge doit être supérieur ou égal à 17 ans.";
      }
    }

    if (formData.numTel && !/^(05|06|07|08|09)[0-9]{8}$/.test(formData.numTel)) {
      newErrors.numTel = "Numéro de téléphone invalide (10 chiffres, commence par 05-09).";
    }

    if (!formData.lieuN.trim()) {
      newErrors.lieuN = "Le lieu de naissance est requis.";
    } else if (!/^[A-Za-zÀ-ÿ\s\-]{2,50}$/.test(formData.lieuN)) {
      newErrors.lieuN = "Lieu invalide (lettres, espaces, tirets, 2-50 caractères).";
    }

    if (formData.email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(formData.email)) {
      newErrors.email = "Adresse e-mail invalide.";
    }

    if (!formData.niveauEtude) newErrors.niveauEtude = "Le niveau d'étude est requis.";
    if (!formData.idspecialite) newErrors.idspecialite = "La spécialité est requise.";
    if (!formData.idEtab) newErrors.idEtab = "L'établissement est requis.";
    if (!formData.idStage) newErrors.idStage = "Le stage est requis.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'idspecialite' && value === 'autre') {
      setShowSpecialiteForm(true);
      return;
    }
    
    if (name === 'idEtab' && value === 'autre') {
      setShowEtabForm(true);
      return;
    }

    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: undefined });
  };

  // Handle new specialite submission
  const handleAddSpecialite = async (e) => {
    e.preventDefault();
    try {
      const response = await authFetch("http://localhost:8080/specialites", {
        method: 'POST',
        body: JSON.stringify(newSpecialite)
      });
      const data = await response.json();
      setSpecialites([...specialites, data]);
      setFormData({ ...formData, idspecialite: data.idspecialite });
      setShowSpecialiteForm(false);
      setNewSpecialite({ nom: '' });
    } catch (error) {
      console.error("Error adding specialite:", error);
      alert("Erreur lors de l'ajout de la spécialité");
    }
  };

  // Handle new etablissement submission
  const handleAddEtablissement = async (e) => {
    e.preventDefault();
    try {
      const response = await authFetch("http://localhost:8080/etablissements", {
        method: 'POST',
        body: JSON.stringify(newEtablissement)
      });
      const data = await response.json();
      setEtablissements([...etablissements, data]);
      setFormData({ ...formData, idEtab: data.idEtab });
      setShowEtabForm(false);
      setNewEtablissement({ nomEtab: '', adr: '', typeEtab: '' });
    } catch (error) {
      console.error("Error adding etablissement:", error);
      alert("Erreur lors de l'ajout de l'établissement");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

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
        lieuN: formData.lieuN,
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
        <div className="form-app-header">
          <h2>{initialData ? "Modifier un stagiaire" : "Ajouter un stagiaire"}</h2>
          <button type="button" className="close-tab-button" onClick={onCancel}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Personal Information */}
            <div className="form-group">
              <label>Nom :</label>
              <input 
                type="text" 
                name="nom" 
                className="form-input"
                placeholder="Entrer le nom" 
                value={formData.nom} 
                onChange={handleChange} 
                required 
              />
              {errors.nom && <span className="form-error">{errors.nom}</span>}
            </div>

            <div className="form-group">
              <label>Prénom :</label>
              <input 
                type="text" 
                name="prenom" 
                className="form-input"
                placeholder="Entrer le prénom" 
                value={formData.prenom} 
                onChange={handleChange} 
                required 
              />
              {errors.prenom && <span className="form-error">{errors.prenom}</span>}
            </div>

            <div className="form-group">
              <label>Date de Naissance :</label>
              <input
                type="date"
                name="dateN"
                className="form-input"
                value={formData.dateN}
                onChange={handleChange}
                required
              />
              {errors.dateN && <span className="form-error">{errors.dateN}</span>}
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
              {errors.numTel && <span className="form-error">{errors.numTel}</span>}
            </div>

            <div className="form-group">
              <label>Lieu de naissance :</label>
              <input 
                type="text" 
                name="lieuN" 
                className="form-input"
                placeholder="Entrer le lieu de naissance" 
                value={formData.lieuN} 
                onChange={handleChange} 
                required 
              />
              {errors.lieuN && <span className="form-error">{errors.lieuN}</span>}
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
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Niveau d'étude :</label>
              <select 
                name="niveauEtude" 
                className="form-select"
                value={formData.niveauEtude} 
                onChange={handleChange}
                required
              >
                <option value="">- Sélectionner le niveau -</option>
                <option value="premiére">Première</option>
                <option value="deuxiéme">Deuxième</option>
                <option value="troisiéme">Troisième</option>
                <option value="quatrieme">Quatrième</option>
                <option value="cinquéme">Cinquième</option>
              </select>
              {errors.niveauEtude && <span className="form-error">{errors.niveauEtude}</span>}
            </div>

            <div className="form-group">
              <label>Spécialité :</label>
              {!showSpecialiteForm ? (
                <select
                  name="idspecialite"
                  className="form-select"
                  value={formData.idspecialite}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Sélectionnez une spécialité --</option>
                  {specialites.map(spec => (
                    <option key={spec.idspecialite} value={spec.idspecialite}>
                      {spec.nom}
                    </option>
                  ))}
                  <option value="autre">Autre...</option>
                </select>
              ) : (
                <div className="secondary-form">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Nom de la spécialité"
                    value={newSpecialite.nom}
                    onChange={(e) => setNewSpecialite({ nom: e.target.value })}
                  />
                  <div className="secondary-form-buttons">
                    <button type="button" onClick={handleAddSpecialite}>Ajouter</button>
                    <button type="button" onClick={() => setShowSpecialiteForm(false)}>Annuler</button>
                  </div>
                </div>
              )}
              {errors.idspecialite && <span className="form-error">{errors.idspecialite}</span>}
            </div>

            <div className="form-group">
              <label>Établissement :</label>
              {!showEtabForm ? (
                <select 
                  name="idEtab" 
                  className="form-select"
                  value={formData.idEtab}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Sélectionner un établissement --</option>
                  {etablissements.map(etab => (
                    <option key={etab.idEtab} value={etab.idEtab}>
                      {etab.nomEtab}
                    </option>
                  ))}
                  <option value="autre">Autre...</option>
                </select>
              ) : (
                <div className="secondary-form">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Nom de l'établissement"
                    value={newEtablissement.nomEtab}
                    onChange={(e) => setNewEtablissement({ ...newEtablissement, nomEtab: e.target.value })}
                  />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Adresse"
                    value={newEtablissement.adr}
                    onChange={(e) => setNewEtablissement({ ...newEtablissement, adr: e.target.value })}
                  />
                  <select
                    className="form-select"
                    value={newEtablissement.typeEtab}
                    onChange={(e) => setNewEtablissement({ ...newEtablissement, typeEtab: e.target.value })}
                  >
                    <option value="">-- Type d'établissement --</option>
                    <option value="universite">Université</option>
                    <option value="institut">Institut</option>
                    <option value="ecole">École</option>
                  </select>
                  <div className="secondary-form-buttons">
                    <button type="button" onClick={handleAddEtablissement}>Ajouter</button>
                    <button type="button" onClick={() => setShowEtabForm(false)}>Annuler</button>
                  </div>
                </div>
              )}
              {errors.idEtab && <span className="form-error">{errors.idEtab}</span>}
            </div>

            <div className="form-group">
              <label>Stage :</label>
              <select 
                name="idStage" 
                className="form-select"
                value={formData.idStage} 
                onChange={handleChange}
                required
              >
                <option value="">- Sélectionner un stage -</option>
                {stages.map((stage) => (
                  <option key={stage.idStage} value={stage.idStage}>
                    {stage.theme?.titre}
                  </option>
                ))}
              </select>
              {errors.idStage && <span className="form-error">{errors.idStage}</span>}
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