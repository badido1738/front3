import React, { useState, useEffect } from "react";
import "../form/form.css";

function ProfileForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    idUser: "",
    username: "",
    role: "",
    motDePasse: ""
  });




  // Initialiser le formulaire avec les données existantes pour modification
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        motDePasse: initialData.motDePasse || "",
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
      ...formData
    };

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

    // First check if response is successful (status 200-299)
    if (response.ok) {
      try {
        // Try to parse JSON only if there's content
        const data = response.status !== 204 ? await response.json() : null;
        
        console.log(`Profil ${initialData ? "modifié" : "ajouté"} avec succès:`, data);
        
        // Clear success message
        alert(`Profil ${initialData ? "modifié" : "ajouté"} avec succès!`);
        
        onSubmit(data);
        
        if (window.confirm(`Voulez-vous actualiser la page ?`)) {
          window.location.reload();
        }
      } catch (jsonError) {
        // This handles cases where response is OK but has no JSON body
        console.log(`Operation succeeded but no data returned`);
        alert(`Profil ${initialData ? "modifié" : "ajouté"} avec succès!`);
        onSubmit({});
      }
    } else {
      // Handle error cases
      try {
        const errorData = await response.json();
        const errorMessage = errorData.message || 
                           errorData.error ||
                           `Erreur ${response.status}: ${response.statusText}`;
        
        console.error("Erreur serveur:", errorMessage);
        alert(`Erreur: ${errorMessage}`);

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      } catch (parseError) {
        console.error("Erreur lors de la lecture de la réponse:", parseError);
        alert(`Erreur technique. Code: ${response.status}`);
      }
    }
  } catch (networkError) {
    console.error("Erreur réseau:", networkError);
    alert("Erreur de connexion au serveur. Veuillez réessayer plus tard.");
  }
};

  return (
    <div className="form-container">
      <div className="form-card">
        {/* En-tête de formulaire avec l'icône X de fermeture */}
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