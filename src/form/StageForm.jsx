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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        encadrant: formData.idEncd ? { id: formData.idEncd } : null, // Changed from idEncd to id
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
            </div>

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
            </div>

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
            </div>

            <div className="form-group">
              <label>Direction :</label>
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
              </select>
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
            </div>

            <div className="form-group">
              <label>Thème :</label>
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

export default StageForm;