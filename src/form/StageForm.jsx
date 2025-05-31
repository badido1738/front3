import React, { useState, useEffect } from "react";
import "../form/form.css";

function StageForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    idStage: "",
    dateDebut: "",
    dateFin: "",
    jourDeRecep: [],
    typeDePC: [],
    type: "",
    idDirection: "",
    idEncd: "",
    idTheme: ""
  });

  const [directions, setDirections] = useState([]);
  const [encadrants, setEncadrants] = useState([]);
  const [themes, setThemes] = useState([]);
  const [errors, setErrors] = useState({});
  const [showThemeForm, setShowThemeForm] = useState(false);
  const [showDirectionForm, setShowDirectionForm] = useState(false);
  const [newTheme, setNewTheme] = useState({
    titre: '',
    description: ''
  });
  const [newDirection, setNewDirection] = useState({
    designation: ''
  });

// Update handleChange function
const handleChange = (e) => {
  const { name, value } = e.target;
  
  if (name === 'idTheme' && value === 'autre') {
    setShowThemeForm(true);
    return;
  }
  
  if (name === 'idDirection' && value === 'autre') {
    setShowDirectionForm(true);
    return;
  }

  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
  setErrors(prev => ({
    ...prev,
    [name]: undefined
  }));
};

  useEffect(() => {
    const fetchThemes = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch("http://localhost:8080/themes", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setThemes(data);
      } catch (err) {
        console.error("Erreur lors du chargement des thèmes :", err);
      }
    };

    fetchThemes();
  }, []);

  useEffect(() => {
    const fetchEncadrants = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch("http://localhost:8080/encadrants", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setEncadrants(data);
      } catch (err) {
        console.error("Erreur lors du chargement des encadrants :", err);
      }
    };

    fetchEncadrants();
  }, []);

  useEffect(() => {
    const fetchDirections = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch("http://localhost:8080/directions", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setDirections(data);
      } catch (err) {
        console.error("Erreur lors du chargement des directions :", err);
      }
    };

    fetchDirections();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        jourDeRecep: initialData.jourDeRecep ? initialData.jourDeRecep.split(',') : [],
        typeDePC: initialData.typeDePC ? initialData.typeDePC.split(',') : [],
        idEncd: initialData.encadrant?.id || "",
        idTheme: initialData.theme?.idTheme || "",
        idDirection: initialData.direction?.idDirection || "",
        idStage: initialData.idStage || initialData.idAS || ""
      });
    }
  }, [initialData]);

  // --- VALIDATION ---
  const validate = () => {
    const newErrors = {};

    // Date de début
    if (!formData.dateDebut) {
      newErrors.dateDebut = "La date de début est requise.";
    } else if (isNaN(new Date(formData.dateDebut))) {
      newErrors.dateDebut = "Date de début invalide.";
    }

    // Date de fin
    if (!formData.dateFin) {
      newErrors.dateFin = "La date de fin est requise.";
    } else if (isNaN(new Date(formData.dateFin))) {
      newErrors.dateFin = "Date de fin invalide.";
    }

    // Cohérence des dates
    if (
      formData.dateDebut &&
      formData.dateFin &&
      new Date(formData.dateFin) < new Date(formData.dateDebut)
    ) {
      newErrors.dateFin = "La date de fin doit être postérieure ou égale à la date de début.";
    }

       // Jour de réception : au moins un coché
    if (!formData.jourDeRecep || formData.jourDeRecep.length === 0) {
      newErrors.jourDeRecep = "Veuillez cocher au moins un jour de réception.";
    }

    // Type de prise en charge : au moins un coché
    if (!formData.typeDePC || formData.typeDePC.length === 0) {
      newErrors.typeDePC = "Veuillez cocher au moins un type de prise en charge.";
    }

    // Type
    if (!formData.type) {
      newErrors.type = "Le type de stage est requis.";
    }

    // Direction
    if (!formData.idDirection) {
      newErrors.idDirection = "La direction est requise.";
    }

    // Encadrant
    if (!formData.idEncd) {
      newErrors.idEncd = "L'encadrant est requis.";
    }

    // Thème
    if (!formData.idTheme) {
      newErrors.idTheme = "Le thème est requis.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleAddTheme = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch("http://localhost:8080/themes", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTheme)
    });
    const data = await response.json();
    setThemes([...themes, data]);
    setFormData({ ...formData, idTheme: data.idTheme });
    setShowThemeForm(false);
    setNewTheme({ titre: '', description: '' });
  } catch (error) {
    console.error("Error adding theme:", error);
    alert("Erreur lors de l'ajout du thème");
  }
};

const handleAddDirection = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch("http://localhost:8080/directions", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newDirection)
    });
    const data = await response.json();
    setDirections([...directions, data]);
    setFormData({ ...formData, idDirection: data.idDirection });
    setShowDirectionForm(false);
    setNewDirection({ designation: '' });
  } catch (error) {
    console.error("Error adding direction:", error);
    alert("Erreur lors de l'ajout de la direction");
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const action = initialData ? "modifier" : "ajouter";
    if (!window.confirm(`Êtes-vous sûr de vouloir ${action} ce stage ?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const payload = {
        ...formData,
        jourDeRecep: formData.jourDeRecep.join(','),
        typeDePC: formData.typeDePC.join(','),
        idDirection: undefined,
        idEncd: undefined,
        idTheme: undefined,
        direction: formData.idDirection ? { idDirection: formData.idDirection } : null,
        encadrant: formData.idEncd ? { id: formData.idEncd } : null,
        theme: formData.idTheme ? { idTheme: formData.idTheme } : null
      };

      const url = initialData 
        ? `http://localhost:8080/stages/${formData.idStage}`
        : "http://localhost:8080/stages";

      const method = initialData ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        onSubmit(data);
        if (window.confirm(`Stage ${initialData ? "modifié" : "ajouté"} avec succès! Actualiser la page ?`)) {
          window.location.reload();
        }
      } else {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || "Erreur lors de l'opération";
        alert(`Erreur: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
      alert("Erreur de connexion au serveur. Veuillez réessayer plus tard.");
    }
  };

  // Helper function to get encadrant display name
  const getEncadrantDisplayName = (encadrant) => {
    if (!encadrant) return "N/A";
    if (encadrant.employe) {
      return `${encadrant.employe.prenom} ${encadrant.employe.nom}`;
    }
    return encadrant.email || "Encadrant sans employé";
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-app-header">
          <h2>{initialData ? "Modifier un stage" : "Ajouter un stage"}</h2>
          <button type="button" className="close-tab-button" onClick={onCancel} aria-label="Fermer">
            ×
          </button>
        </div>

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
                value={formData.dateDebut}
                onChange={handleChange}
                required
              />
              {errors.dateDebut && <span className="form-error">{errors.dateDebut}</span>}
            </div>

            <div className="form-group">
              <label>Date de Fin :</label>
              <input
                type="date"
                name="dateFin"
                className="form-input"
                value={formData.dateFin}
                onChange={handleChange}
                required
              />
              {errors.dateFin && <span className="form-error">{errors.dateFin}</span>}
            </div>

            <div className="form-group"> 
            <div className="form-group"> 
              <label>Jours de Réception :</label>
              <div className="form-checkbox-group">
                {["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi"].map((jour) => (
                  <label key={jour} className="checkbox-label">
                    <input
                      type="checkbox"
                      value={jour}
                      checked={formData.jourDeRecep.includes(jour)}
                      onChange={(e) => {
                        const selected = formData.jourDeRecep.includes(jour)
                          ? formData.jourDeRecep.filter((j) => j !== jour)
                          : [...formData.jourDeRecep, jour];
                        setFormData({ ...formData, jourDeRecep: selected });
                      }}
                    />
                    {jour}
                  </label>
                ))}
              </div>
              {errors.jourDeRecep && <span className="form-error">{errors.jourDeRecep}</span>}
            </div>

            <div className="form-group">
              <label>Type de Prise en Charge :</label>
              <div className="form-checkbox-group">
                {["Transport", "Restauration", "Aucune"].map((type) => (
                  <label key={type} className="checkbox-label">
                    <input
                      type="checkbox"
                      value={type}
                      checked={formData.typeDePC.includes(type)}
                      onChange={(e) => {
                        const selected = formData.typeDePC.includes(type)
                          ? formData.typeDePC.filter((t) => t !== type)
                          : [...formData.typeDePC, type];
                        setFormData({ ...formData, typeDePC: selected });
                      }}
                    />
                    {type}
                  </label>
                ))}
              </div>
              {errors.typeDePC && <span className="form-error">{errors.typeDePC}</span>}
            </div>            </div>

            <div className="form-group">
              <label>Type :</label>
              <select
                name="type"
                className="form-select"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="">- Sélectionner le type -</option>
                <option value="Stage Pratique">Stage Pratique</option>
                <option value="Stage PFE">Stage PFE</option>
                <option value="Stage de Decouverte">Stage de Decouverte</option>
                <option value="Stage d'Apprentissage">Stage d'Apprentissage</option>
              </select>
              {errors.type && <span className="form-error">{errors.type}</span>}
            </div>

              <div className="form-group">
                <label>Direction :</label>
                {!showDirectionForm ? (
                  <select
                    name="idDirection"
                    className="form-select"
                    value={formData.idDirection}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Sélectionner une direction --</option>
                    {directions.map((dir) => (
                      <option key={dir.idDirection} value={dir.idDirection}>
                        {dir.designation}
                      </option>
                    ))}
                    <option value="autre">Autre...</option>
                  </select>
                ) : (
                  <div className="secondary-form">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Désignation de la direction"
                      value={newDirection.designation}
                      onChange={(e) => setNewDirection({ ...newDirection, designation: e.target.value })}
                    />
                    <div className="secondary-form-buttons">
                      <button type="button" onClick={handleAddDirection}>Ajouter</button>
                      <button type="button" onClick={() => setShowDirectionForm(false)}>Annuler</button>
                    </div>
                  </div>
                )}
                {errors.idDirection && <span className="form-error">{errors.idDirection}</span>}
              </div>

            <div className="form-group">
              <label>Encadrant :</label>
              <select
                name="idEncd"
                className="form-select"
                value={formData.idEncd}
                onChange={handleChange}
                required
              >
                <option value="">-- Sélectionner un encadrant --</option>
                {encadrants.map((enca) => (
                  <option key={enca.id} value={enca.id}>
                    {getEncadrantDisplayName(enca)}
                    {enca.email ? ` (${enca.email})` : ''}
                  </option>
                ))}
              </select>
              {errors.idEncd && <span className="form-error">{errors.idEncd}</span>}
            </div>

            <div className="form-group">
              <label>Thème :</label>
              {!showThemeForm ? (
                <select
                  name="idTheme"
                  className="form-select"
                  value={formData.idTheme}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Sélectionner un thème --</option>
                  {themes.map((theme) => (
                    <option key={theme.idTheme} value={theme.idTheme}>
                      {theme.titre}
                    </option>
                  ))}
                  <option value="autre">Autre...</option>
                </select>
              ) : (
                <div className="secondary-form">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Titre du thème"
                    value={newTheme.titre}
                    onChange={(e) => setNewTheme({ ...newTheme, titre: e.target.value })}
                  />
                  <textarea
                    className="form-input"
                    placeholder="Description du thème"
                    value={newTheme.description}
                    onChange={(e) => setNewTheme({ ...newTheme, description: e.target.value })}
                  />
                  <div className="secondary-form-buttons">
                    <button type="button" onClick={handleAddTheme}>Ajouter</button>
                    <button type="button" onClick={() => setShowThemeForm(false)}>Annuler</button>
                  </div>
                </div>
              )}
              {errors.idTheme && <span className="form-error">{errors.idTheme}</span>}
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

export default StageForm;