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
    7: [ // Dimanche
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
    <div className="emploi-container">
      <h1 className="emploi-title">
        Emploi du Temps des Stagiaires et Apprentis
      </h1>
      
      <div className="days-container">
        {daysOfWeek.map((day) => (
          <div
            key={day.id}
            className={`day-card ${selectedDay && selectedDay.id === day.id ? 'selected' : ''}`}
            onClick={() => handleDayClick(day)}
          >
            <h3>{day.name}</h3>
          </div>
        ))}
      </div>
      
      <div className="stagiaires-section">
        <h3>
          {selectedDay 
            ? `Stagiaires/Apprentis du ${selectedDay.name}` 
            : "Sélectionnez un jour pour voir les stagiaires/apprentis"}
        </h3>
        
        <div className="stagiaires-list">
          {selectedDay ? (
            stagiairesList.length > 0 ? (
              <table className="stagiaires-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Type</th>
                    <th>Spécialité</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stagiairesList.map((stagiaire) => (
                    <tr key={stagiaire.id} onClick={() => handleStagiaireClick(stagiaire)}>
                      <td>{stagiaire.id}</td>
                      <td>{stagiaire.nom}</td>
                      <td>{stagiaire.prenom}</td>
                      <td>{stagiaire.type}</td>
                      <td>{stagiaire.specialite}</td>
                      <td>
                        <button className="details-button">Détails</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-stagiaires">
                Aucun stagiaire/apprenti n'est prévu pour ce jour.
              </div>
            )
          ) : (
            <div className="no-stagiaires">
              Veuillez sélectionner un jour de la semaine.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmploiPage;