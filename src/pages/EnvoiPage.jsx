import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import "../form/StagiaireForm.css";

const EnvoiPage = () => {
  const navigate = useNavigate();
  
  // Les options pour les directions
  const directionOptions = [
    "Direction de Formation",
    "Système d'Information",
    "Ressources Humaines",
    "Autre"
  ];
  
  // État pour gérer les champs du formulaire
  const [formData, setFormData] = useState({
    directionEnvoi: '',
    autreDirectionEnvoi: '',
    nomDocument: '',
    nomStagiaire: '',
    directionReception: '',
    autreDirectionReception: '',
    notes: ''
  });

  // État pour suivre si "Autre" est sélectionné
  const [showAutreDirectionEnvoi, setShowAutreDirectionEnvoi] = useState(false);
  const [showAutreDirectionReception, setShowAutreDirectionReception] = useState(false);

  // État pour gérer les erreurs de validation
  const [errors, setErrors] = useState({});

  // Gérer les changements dans les champs de texte
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Gestion spéciale pour les listes déroulantes de direction
    if (name === 'directionEnvoi') {
      setShowAutreDirectionEnvoi(value === 'Autre');
    }
    if (name === 'directionReception') {
      setShowAutreDirectionReception(value === 'Autre');
    }
  };

  // Valider le formulaire
  const validateForm = () => {
    const newErrors = {};
    
    // Validation de la direction d'envoi
    if (!formData.directionEnvoi.trim()) {
      newErrors.directionEnvoi = 'La direction d\'envoi est requise';
    } else if (formData.directionEnvoi === 'Autre' && !formData.autreDirectionEnvoi.trim()) {
      newErrors.autreDirectionEnvoi = 'Veuillez préciser la direction d\'envoi';
    }
    
    if (!formData.nomDocument.trim()) {
      newErrors.nomDocument = 'Le nom du document est requis';
    }
    
    if (!formData.nomStagiaire.trim()) {
      newErrors.nomStagiaire = 'Le nom du stagiaire/apprenti est requis';
    }
    
    // Validation de la direction de réception
    if (!formData.directionReception.trim()) {
      newErrors.directionReception = 'La direction de réception est requise';
    } else if (formData.directionReception === 'Autre' && !formData.autreDirectionReception.trim()) {
      newErrors.autreDirectionReception = 'Veuillez préciser la direction de réception';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Préparer les données pour l'envoi
  const prepareDataForSubmission = () => {
    const dataToSubmit = { ...formData };
    
    // Remplacer la direction d'envoi par la valeur personnalisée si "Autre" est sélectionné
    if (formData.directionEnvoi === 'Autre') {
      dataToSubmit.directionEnvoi = formData.autreDirectionEnvoi;
    }
    
    // Remplacer la direction de réception par la valeur personnalisée si "Autre" est sélectionné
    if (formData.directionReception === 'Autre') {
      dataToSubmit.directionReception = formData.autreDirectionReception;
    }
    
    // Supprimer les champs auxiliaires
    delete dataToSubmit.autreDirectionEnvoi;
    delete dataToSubmit.autreDirectionReception;
    
    return dataToSubmit;
  };

  // Gérer la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Préparer les données
      const dataToSubmit = prepareDataForSubmission();
      
      // Dans un cas réel, vous enverriez ces données à un serveur
      // Par exemple avec axios ou fetch
      console.log('Données du formulaire soumises:', dataToSubmit);
      
      // Simuler un envoi réussi
      alert('Document envoyé avec succès!');
      
      // Réinitialiser le formulaire
      setFormData({
        directionEnvoi: '',
        autreDirectionEnvoi: '',
        nomDocument: '',
        nomStagiaire: '',
        directionReception: '',
        autreDirectionReception: '',
        notes: ''
      });
      
      // Réinitialiser les états d'affichage
      setShowAutreDirectionEnvoi(false);
      setShowAutreDirectionReception(false);
    }
  };

  // Naviguer vers la page d'historique avec l'URL correcte
  const goToHistorique = () => {
    navigate('/documents/historique');
  };

  return (
    <div className="envoi-page-container">
      <h1 className="envoi-page-title">
        Envoi de Document
      </h1>
      
      <form onSubmit={handleSubmit}>
        
        {/* Deuxième ligne de 2 inputs */}
        <div className="envoi-form-row">
          {/* Nom du stagiaire/apprenti */}
          {/* Nom du document */}
          <div className="envoi-form-group">
            <label htmlFor="nomDocument" className="envoi-form-label">
              Type du document:
            </label>
            <input
              type="text"
              id="nomDocument"
              name="nomDocument"
              value={formData.nomDocument}
              onChange={handleChange}
              className="envoi-form-input"
            />
            {errors.nomDocument && (
              <p className="envoi-form-error">{errors.nomDocument}</p>
            )}
          </div>

          <div className="envoi-form-group">
            <label htmlFor="nomStagiaire" className="envoi-form-label">
              Stagiaire/apprenti concerné:
            </label>
            <input
              type="text"
              id="nomStagiaire"
              name="nomStagiaire"
              value={formData.nomStagiaire}
              onChange={handleChange}
              className="envoi-form-input"
            />
            {errors.nomStagiaire && (
              <p className="envoi-form-error">{errors.nomStagiaire}</p>
            )}
          </div>
          
          {/* Direction qui reçoit le document */}
          <div className="envoi-form-group">
            <label htmlFor="directionReception" className="envoi-form-label">
              Direction :
            </label>
            <select
              id="directionReception"
              name="directionReception"
              value={formData.directionReception}
              onChange={handleChange}
              className="envoi-form-select"
            >
              <option value="">Sélectionnez une direction</option>
              {directionOptions.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
            {errors.directionReception && (
              <p className="envoi-form-error">{errors.directionReception}</p>
            )}
            
            {showAutreDirectionReception && (
              <div className="autre-direction-input">
                <input
                  type="text"
                  id="autreDirectionReception"
                  name="autreDirectionReception"
                  value={formData.autreDirectionReception}
                  onChange={handleChange}
                  placeholder="Précisez la direction de réception"
                  className="envoi-form-input"
                />
                {errors.autreDirectionReception && (
                  <p className="envoi-form-error">{errors.autreDirectionReception}</p>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Notes ou commentaires */}
        <div className="envoi-form-group">
          <label htmlFor="notes" className="envoi-form-label">
            Notes ou commentaires:
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            className="envoi-form-textarea"
          />
        </div>
        
        {/* Boutons d'action */}
        <div className="envoi-form-buttons">
          <button
            type="submit"
            className="envoi-form-button envoi-button-submit"
          >
            Envoyer 
          </button>
          
        </div>
      </form>
    </div>
  );
};

export default EnvoiPage;