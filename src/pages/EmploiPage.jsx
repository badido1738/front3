import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmploiPage.css';

function EmploiPage() {
  const navigate = useNavigate();

  // État pour stocker le jour sélectionné
  const [selectedDay, setSelectedDay] = useState(null);

  // État pour stocker la liste des stagiaires/apprentis
  const [stagiairesList, setStagiairesList] = useState([]);

  // Jours de la semaine
  const daysOfWeek = [
    { id: 1, name: "Lundi" },
    { id: 2, name: "Mardi" },
    { id: 3, name: "Mercredi" },
    { id: 4, name: "Jeudi" },
    { id: 7, name: "Dimanche" },
  ];

  const [stages, setStages] = useState([]);
  const [stagiaires, setStagiaires] = useState([]);
  const [apprentis, setApprentis] = useState([]);

  // Charger les données au montage
  useEffect(() => {
    const token = localStorage.getItem('token');
    // Charger les stages
    fetch('http://localhost:8080/stages', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setStages);

    // Charger les stagiaires
    fetch('http://localhost:8080/stagiaires', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setStagiaires);

    // Charger les apprentis
    fetch('http://localhost:8080/apprentis', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setApprentis);
  }, []);

const loadStagiairesForDay = (dayName) => {
  // Trouver les stages qui ont ce jour dans jourDeRecep
  const stagesForDay = stages.filter(stage =>
    stage.jourDeRecep && stage.jourDeRecep.split(',').map(j => j.trim()).includes(dayName)
  );
  const stageIds = stagesForDay.map(s => s.idStage);

  // First, process apprentis
  const apprentisForDay = apprentis
    .filter(a => stageIds.includes(a.stage?.idStage))
    .map(a => ({ 
      ...a, 
      type: 'APPRENTI',
      id: a.idAS // Ensure consistent ID field
    }));

  // Get IDs of apprentis to exclude from stagiaires
  const apprentisIds = apprentisForDay.map(a => a.idAS);

  // Process stagiaires, excluding those who are also apprentis
  const stagiairesForDay = stagiaires
    .filter(s => stageIds.includes(s.stage?.idStage) && !apprentisIds.includes(s.idAS))
    .map(s => ({ 
      ...s, 
      type: 'STAGIAIRE',
      id: s.idAS // Ensure consistent ID field
    }));

  // Combine filtered lists
  const combinedList = [...apprentisForDay, ...stagiairesForDay];
  setStagiairesList(combinedList);
};

  // Gérer le clic sur un jour
  const handleDayClick = (day) => {
    setSelectedDay(day);
    loadStagiairesForDay(day.name);
  };

  // Recharger la liste si le jour sélectionné ou les données changent
  useEffect(() => {
    if (selectedDay) {
      loadStagiairesForDay(selectedDay.name);
    }
    // eslint-disable-next-line
  }, [selectedDay, stages, stagiaires, apprentis]);

  // Fonction pour afficher les détails d'un stagiaire
  const handleStagiaireClick = (stagiaire) => {
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
    </tr>
  </thead>
  <tbody>
    {stagiairesList.map((stagiaire) => (
      <tr key={stagiaire.id}>
        <td>{stagiaire.id}</td>
        <td>{stagiaire.nom}</td>
        <td>{stagiaire.prenom}</td>
        <td>{stagiaire.type === 'APPRENTI' ? 'Apprenti' : 'Stagiaire'}</td>
        <td>{stagiaire.specialite?.nom || ""}</td>
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