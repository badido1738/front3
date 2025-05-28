import React, { useState, useEffect } from "react";
import "../form/form.css";

function ProfileForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    idUser: "",
    username: "",
    role: "",
    motDePasse: "",
    idEmp: ""  // ajout du champ employé
  });

  const [employes, setEmployes] = useState([]);

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

  // Initialiser le formulaire avec les données existantes
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        motDePasse: initialData.motDePasse || "",
        idEmp: initialData.idEmp || ""
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

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

    console.log("Final payload:", payload);

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
        alert(`Erreur: ${errorData.message || errorData.error || response.statusText}`);
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
            </div>

            <div className="form-group">
              <label>Role :</label>
              <select
                name="role"
                className="form-select"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="">- Sélectionner le role -</option>
                <option value="ROLE_admin">Admin</option>
                <option value="ROLE_sousAdmin">Sous-Admin</option>
                <option value="ROLE_agentCirculation">Agent de Circulation</option>
              </select>
            </div>

            <div className="form-group">
              <label>Mot de Passe :</label>
              <input
                type="password"
                name="motDePasse"
                className="form-input"
                placeholder="Entrer le mot de passe"
                required
                value={formData.motDePasse}
                onChange={handleChange}
              />
            </div>

            {/* Nouveau champ pour l'employé */}
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
