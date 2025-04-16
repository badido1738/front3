import React, { useState } from "react";
/*import "./StagiaireForm.css"; */

function StagiaireForm() {
  
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    dateNaissance: "",
    telephone: "",
    type: "",
    numeroCCP: "",
    email: "",
    niveauEtude: "",
    numeroStage: "",
    specialite: "",
   
  });

  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Stagiaire ajouté : ${formData.nom} ${formData.prenom}`);
    console.log("Données soumises :", formData);
  };

 

  return (
    <div className="form-container">
      <div className="form-card">
        <h3>Veuillez saisir les information du stagiaire</h3>

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
              <label>Date de naissance :</label>
              <input 
                type="date" 
                name="dateNaissance" 
                className="form-input"
                required 
                value={formData.dateNaissance} 
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
                required 
                value={formData.telephone} 
                onChange={handleChange} 
              />
            </div>

            <div className="form-group">
              <label>Type :</label>
              <select 
                name="type" 
                className="form-select"
                required 
                value={formData.type} 
                onChange={handleChange}
              >
                <option value="">- Sélectionner le type -</option>
                <option value="Stage Pratique">Stage Pratique</option>
                <option value="Stage PFE">Stage PFE</option>
              </select>
            </div>

            <div className="form-group">
              <label>Numéro CCP :</label>
              <input 
                type="text" 
                name="numeroCCP" 
                className="form-input"
                placeholder="Entrer le numéro CCP" 
                required 
                value={formData.numeroCCP} 
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
                required 
                value={formData.email} 
                onChange={handleChange} 
              />
            </div>

            <div className="form-group">
              <label>Niveau d'étude :</label>
              <select 
                name="niveauEtude" 
                className="form-select"
                required 
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
                name="numéroStage" 
                className="form-select"
                required 
                value={formData.type} 
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
                required 
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
            <button type="submit" className="btn-primary">Ajouter</button>
           
          </div>
        </form>
      </div>
    </div>
  );
}

export default StagiaireForm;