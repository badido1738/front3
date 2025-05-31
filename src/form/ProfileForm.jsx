import React, { useState, useEffect } from "react";
import "../form/form.css";

function ProfileForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    idUser: "",
    username: "",
    role: "",
    motDePasse: "",
    idEmp: ""
  });

  const [employes, setEmployes] = useState([]);
  const [allProfiles, setAllProfiles] = useState([]);
  const [errors, setErrors] = useState({});

  // Charger les employés depuis l'API au chargement
  useEffect(() => {
    async function fetchEmployes() {
      try {
        const res = await fetch("http://localhost:8080/employes", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setEmployes(data);
        } else {
          console.error("Erreur lors de la récupération des employés");
        }
      } catch (error) {
        console.error("Erreur réseau lors de la récupération des employés :", error);
      }
    }
    fetchEmployes();
  }, []);

  // Charger tous les profils pour la validation
  useEffect(() => {
    async function fetchProfiles() {
      try {
        const res = await fetch("http://localhost:8080/utilisateurs", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setAllProfiles(data);
        } else {
          setAllProfiles([]);
        }
      } catch {
        setAllProfiles([]);
      }
    }
    fetchProfiles();
  }, []);

  // Initialiser le formulaire avec les données existantes
  useEffect(() => {
    if (initialData) {
      setFormData({
        idUser: initialData.idUser || "",
        username: initialData.username || "",
        role: initialData.role || "",
        motDePasse: initialData.motDePasse || "",
        idEmp: initialData.idEmp || (initialData.employe?.idEmp || "")
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors(prev => ({ ...prev, [e.target.name]: undefined }));
  };

  const validate = () => {
    const newErrors = {};

    // Username requis et unique
    if (!formData.username.trim()) {
      newErrors.username = "Le nom d'utilisateur est requis.";
    } else {
      const usernameExists = allProfiles.some(
        p =>
          p.username === formData.username &&
          (!initialData || p.idUser !== initialData.idUser)
      );
      if (usernameExists) {
        newErrors.username = "Ce nom d'utilisateur est déjà attribué.";
      }

          if (!initialData && !formData.motDePasse.trim()) {
      newErrors.motDePasse = "Le mot de passe est requis.";
    } else if (!initialData && formData.motDePasse.length < 8) {
      newErrors.motDePasse = "Le mot de passe doit contenir au moins 8 caractères.";
    }
    }

    // Rôle requis
    if (!formData.role.trim()) {
      newErrors.role = "Le rôle est requis.";
    }

    // Mot de passe requis (uniquement à la création)
    if (!initialData && !formData.motDePasse.trim()) {
      newErrors.motDePasse = "Le mot de passe est requis.";
    }

    // Employé requis et unique
    if (!formData.idEmp) {
      newErrors.idEmp = "L'employé est requis.";
    } else {
      const empExists = allProfiles.some(
        p =>
          (p.idEmp === formData.idEmp || p.employe?.idEmp === formData.idEmp) &&
          (!initialData || p.idUser !== initialData.idUser)
      );
      if (empExists) {
        newErrors.idEmp = "Cet employé a déjà un profil.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const action = initialData ? "modifier" : "ajouter";
    if (!window.confirm(`Êtes-vous sûr de vouloir ${action} ce profil ?`)) {
      return;
    }

    try {
      const payload = {
        ...formData,
        employe: { idEmp: formData.idEmp }
      };
      delete payload.idEmp;

      if (!initialData) {
        // Pour l'ajout, motDePasse doit être présent
        payload.motDePasse = formData.motDePasse;
      } else {
        // Pour la modification, ne pas envoyer motDePasse si vide
        if (!formData.motDePasse) delete payload.motDePasse;
      }

      const url = initialData
        ? `http://localhost:8080/utilisateurs/${initialData.idUser}`
        : "http://localhost:8080/auth/register";

      const method = initialData ? "PUT" : "POST";

      const headers = {
        "Content-Type": "application/json",
        ...(initialData && {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        })
      };

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        try {
          const data = response.status !== 204 ? await response.json() : null;
          alert(`Profil ${initialData ? "modifié" : "ajouté"} avec succès!`);
          onSubmit(data);
          if (window.confirm(`Voulez-vous actualiser la page ?`)) {
            window.location.reload();
          }
        } catch {
          alert(`Profil ${initialData ? "modifié" : "ajouté"} avec succès!`);
          onSubmit({});
        }
      } else {
        try {
          const errorData = await response.json();
          alert(`Erreur: ${errorData.message || errorData.error || response.statusText} (Employe probablement déjà utilisé)`);
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }
        } catch {
          alert(`Erreur technique. Code: ${response.status}`);
        }
      }
    } catch (networkError) {
      alert("Erreur de connexion au serveur. Veuillez réessayer plus tard.");
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-app-header">
          <h2>{initialData ? "Modifier un profil" : "Ajouter un profil"}</h2>
          <button type="button" className="close-tab-button" onClick={onCancel} aria-label="Fermer">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {initialData && (
              <input type="hidden" name="idUser" value={formData.idUser} />
            )}

            <div className="form-group">
              <label>Username :</label>
              <input
                type="text"
                name="username"
                className="form-input"
                placeholder="Entrer le username"
                required
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && <span className="form-error">{errors.username}</span>}
            </div>

            <div className="form-group">
              <label>Role :</label>
              <select
                name="role"
                className="form-select"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">- Sélectionner le role -</option>
                <option value="ROLE_admin">Admin</option>
                <option value="ROLE_sousAdmin">Sous-Admin</option>
                <option value="ROLE_agentCirculation">Agent de Circulation</option>
              </select>
              {errors.role && <span className="form-error">{errors.role}</span>}
            </div>

            <div className="form-group">
              <label>Mot de Passe :</label>
              <input
                type="password"
                name="motDePasse"
                className="form-input"
                placeholder="Entrer le mot de passe"
                required={!initialData}
                value={formData.motDePasse}
                onChange={handleChange}
              />
              {errors.motDePasse && <span className="form-error">{errors.motDePasse}</span>}
            </div>

            <div className="form-group">
              <label>Employé :</label>
              <select
                name="idEmp"
                className="form-select"
                value={formData.idEmp}
                onChange={handleChange}
                required
              >
                <option value="">-- Sélectionner un employé --</option>
                {employes.map(emp => (
                  <option key={emp.idEmp} value={emp.idEmp}>
                    {emp.nom} {emp.prenom} - {emp.poste}
                  </option>
                ))}
              </select>
              {errors.idEmp && <span className="form-error">{errors.idEmp}</span>}
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

export default ProfileForm;