import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmploiPage.css';

function EmploiPage() {
  const navigate = useNavigate();
  
  // État pour stocker le jour sélectionné
  const [selectedDay, setSelectedDay] = useState(null);
  
  // État pour stocker la liste des stagiaires/apprentis
  const [stagiairesList, setStagiairesList] = useState([]);
  
  // Simuler des données pour les jours de la semaine (à remplacer par vos données réelles)
  const daysOfWeek = [
    { id: 1, name: "Lundi" },
    { id: 2, name: "Mardi" },
    { id: 3, name: "Mercredi" },
    { id: 4, name: "Jeudi" },
   
    { id: 7, name: "Dimanche" }, 
  ];
  
  // Simuler des données pour les stagiaires (à remplacer par des appels API réels)
  const mockStagiaires = {
    1: [ // Lundi
      { id: "ST001", nom: "Benali", prenom: "Ahmed", type: "Apprenti", specialite: "Informatique" },
      { id: "ST002", nom: "Saidi", prenom: "Karim", type: "Stage Pratique", specialite: "Électronique" },
      { id: "ST003", nom: "Cherifi", prenom: "Lamia", type: "Stage PFE", specialite: "Informatique" }
    ],
    2: [ // Mardi
      { id: "ST002", nom: "Saidi", prenom: "Karim", type: "Stage Pratique", specialite: "Électronique" },
      { id: "ST004", nom: "Amari", prenom: "Sofiane", type: "Apprenti", specialite: "Automatisme" }
    ],
    3: [ // Mercredi
      { id: "ST001", nom: "Benali", prenom: "Ahmed", type: "Apprenti", specialite: "Informatique" },
      { id: "ST005", nom: "Meziane", prenom: "Samira", type: "Stage PFE", specialite: "HSE" }
    ],
    4: [ // Jeudi
      { id: "ST003", nom: "Cherifi", prenom: "Lamia", type: "Stage PFE", specialite: "Informatique" },
      { id: "ST004", nom: "Amari", prenom: "Sofiane", type: "Apprenti", specialite: "Automatisme" },
      { id: "ST006", nom: "Boudiaf", prenom: "Yacine", type: "Stage Pratique", specialite: "Mécanique" }
    ],
    5: [ // Dimanche
      { id: "ST005", nom: "Meziane", prenom: "Samira", type: "Stage PFE", specialite: "HSE" },
      { id: "ST006", nom: "Boudiaf", prenom: "Yacine", type: "Stage Pratique", specialite: "Mécanique" }
    ]
  };
  
  // Fonction pour charger les stagiaires du jour sélectionné
  const loadStagiairesForDay = (dayId) => {
    // Dans une application réelle, vous feriez un appel API ici
    // Exemple: axios.get(`/api/stagiaires?jour=${dayId}`)
    
    // Simuler un chargement de données
    setTimeout(() => {
      setStagiairesList(mockStagiaires[dayId] || []);
    }, 300);
  };
  
  // Gérer le clic sur un jour
  const handleDayClick = (day) => {
    setSelectedDay(day);
    loadStagiairesForDay(day.id);
  };
  
  // Fonction pour afficher les détails d'un stagiaire
  const handleStagiaireClick = (stagiaire) => {
    // Navigation vers la page de détails du stagiaire
    // Selon votre structure d'application
    alert(`Voir les détails de ${stagiaire.nom} ${stagiaire.prenom}`);
    // navigate(`/stagiaires/${stagiaire.id}`);
  };
  
  return (
    <div className="envoi-page-container">
      <h1 className="envoi-page-title">
        Envoi de Document
      </h1>
      
      <form onSubmit={handleSubmit}>
        {/* Direction qui envoie le document */}
        <div className="envoi-form-group">
          <label htmlFor="directionEnvoi" className="envoi-form-label">
            Direction qui envoie le document:
          </label>
          <input
            type="text"
            id="directionEnvoi"
            name="directionEnvoi"
            value={formData.directionEnvoi}
            onChange={handleChange}
            className="envoi-form-input"
          />
          {errors.directionEnvoi && (
            <p className="envoi-form-error">{errors.directionEnvoi}</p>
          )}
        </div>
        
        {/* Nom du document */}
        <div className="envoi-form-group">
          <label htmlFor="nomDocument" className="envoi-form-label">
            Nom du document:
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
        
        {/* Le champ de sélection de fichier a été supprimé, nous gardons uniquement le nom du document */}
        
        {/* Nom du stagiaire/apprenti */}
        <div className="envoi-form-group">
          <label htmlFor="nomStagiaire" className="envoi-form-label">
            Nom du stagiaire/apprenti concerné:
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
            Direction qui reçoit le document:
          </label>
          <input
            type="text"
            id="directionReception"
            name="directionReception"
            value={formData.directionReception}
            onChange={handleChange}
            className="envoi-form-input"
          />
          {errors.directionReception && (
            <p className="envoi-form-error">{errors.directionReception}</p>
          )}
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
            Envoyer le document
          </button>
          
          <button
            type="button"
            onClick={goToHistorique}
            className="envoi-form-button envoi-button-historique"
          >
            Historique
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmploiPage;