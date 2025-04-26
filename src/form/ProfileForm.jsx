import React, { useState, useEffect } from "react";
import "../form/form.css";

function ProfileForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    idUser: "",
    username: "",
    role: "",
    motDePasse: "",
    idEmp: "",
  });

  const [employes, setEmployes] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        motDePasse: initialData.motDePasse || "",
      });
    }
  }, [initialData]);

  // 🔄 Récupération des employés
  useEffect(() => {
    fetch("http://localhost:8080/employes") // 🛠️ À adapter si ton endpoint est différent
      .then((res) => res.json())
      .then((data) => setEmployes(data))
      .catch((err) => console.error("Erreur lors du chargement des employés:", err));
  }, []);

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
    if (!window.confirm(`Êtes-vous sûr de vouloir ${action} ce profile ?`)) {
      return;
    }
  
    try {
      // Préparer les données à envoyer avec les bons formats d'ID
      /*const payload = {
        nom: formData.nom,
        prenom: formData.prenom,
        dateN: formData.dateN,
        numTel: formData.numTel,
        type: formData.type,
        email: formData.email,
        niveauEtude: formData.niveauEtude,
        stage: formData.idStage ? { idStage: formData.idStage } : null,
        etablissement: formData.idEtab ? { idEtab: formData.idEtab } : null,
        specialite: formData.idspecialite ? { idspecialite: formData.idspecialite } : null // Note lowercase "s" in idspecialite
      };
      
            
      console.log("Final payload:", payload);*/

      const payload = {
        ...formData,
        employe: { idEmp: formData.idEmp } // 🔗 lien vers l'employé
      };

      console.log("Final payload:", payload);

      const url = initialData 
        ? `http://localhost:8080/utilisateurs/${initialData.idUser}`
        : "http://localhost:8080/utilisateurs";
  
      const method = initialData ? "PUT" : "POST";
  
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      console.log(formData);

      if (response.ok) {
        const data = await response.json();
        console.log(`Profile ${initialData ? "modifié" : "ajouté"} avec succès:`, data);
        onSubmit(data);
        
        if (window.confirm(`Profile ${initialData ? "modifié" : "ajouté"} avec succès! Actualiser la page ?`)) {
          window.location.reload();
        } else {
          // Note: setShowForm is not defined in this component
          // You should either add it or remove this line
          // setShowForm(false);
        }
      } else {
        const errorText = await response.text();
        console.error("Erreur lors de l'envoi:", errorText);
        alert(`Erreur: ${errorText}`);
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
      alert("Erreur de connexion au serveur. Veuillez réessayer plus tard.");
    }
  };

  return (
    <div className="form-card">
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

      {/*}    <div className="form-group">
            <label>Rôle :</label>
            <input
              type="text"
              name="role"
              className="form-input"
              placeholder="Entrer le rôle"
              required
              value={formData.role}
              onChange={handleChange}
            />
          </div>  */}

          <div className="form-group">
              <label>Role :</label>
              <select 
                name="role" 
                className="form-select"
                value={formData.role} 
                onChange={handleChange}
              >
                <option value="">- Sélectionner le role -</option>
                <option value="admin">Admin</option>
                <option value="agent de circulation">Agent de circulatio</option>
                <option value="sous-admin">Sous-Admin</option>

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

          <div className="form-group">
            <label>Employé :</label>
            <select
              name="idEmp"
              className="form-select"
              value={formData.idEmp}
              onChange={handleChange}
              //required
            >
              <option value="">- Sélectionner un employé -</option>
              {employes.map((emp) => (
                <option key={emp.idEmp} value={emp.idEmp}>
                  {emp.nom} {emp.prenom} — {emp.poste}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-primary">
            {initialData ? "Modifier" : "Ajouter"}
          </button>
          {onCancel && (
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Annuler
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ProfileForm;