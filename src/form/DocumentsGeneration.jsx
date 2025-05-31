import React, { useState, useEffect } from "react";
import "./DocumentsGeneration.css";
import { jsPDF } from 'jspdf';
import logo from '../assets/Sonatrach.svg.png';

function DocumentsGeneration() {
  // Déclarer tous les hooks au début du composant
  const [selectedDocument, setSelectedDocument] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [presenceData, setPresenceData] = useState({});
  
  // Données de test BADIDOUUUUUUUUUUUUUUUUUUUUUUUUUU n7ihm ki tkml tlinker
  const [stages, setStages] = useState([]);

  // Données de test pour les stagiaires
  const [stagiaires, setStagiaires] = useState([]);

  // Données de test pour les apprentis
  const [apprentis, setApprentis] = useState([]);

  const [etablissements, setEtablissements] = useState([]);


  // Fonction pour rafraîchir les données
const refreshData = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('No authentication token found');
    window.location.href = '/login';
    return;
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // Récupérer les stages
  fetch('http://localhost:8080/stages', { headers })
    .then(res => {
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          window.location.href = '/login';
        }
        throw new Error('Erreur réseau');
      }
      return res.json();
    })
    .then(data => setStages(data))
    .catch(err => console.error('Erreur lors de la récupération des stages:', err));

  // Récupérer les stagiaires
  fetch('http://localhost:8080/stagiaires', { headers })
    .then(res => {
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          window.location.href = '/login';
        }
        throw new Error('Erreur réseau');
      }
      return res.json();
    })
    .then(data => setStagiaires(data))
    .catch(err => console.error('Erreur lors de la récupération des stagiaires:', err));

  // Récupérer les apprentis
  fetch('http://localhost:8080/apprentis', { headers })
    .then(res => {
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          window.location.href = '/login';
        }
        throw new Error('Erreur réseau');
      }
      return res.json();
    })
    .then(data => setApprentis(data))
    .catch(err => console.error('Erreur lors de la récupération des apprentis:', err));

        fetch('http://localhost:8080/etablissements', { headers })
      .then(res => {
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            window.location.href = '/login';
          }
          throw new Error('Erreur réseau');
        }
        return res.json();
      })
      .then(data => setEtablissements(data))
      .catch(err => console.error('Erreur lors de la récupération des établissements:', err));
  
};

  // Charger les données au montage du composant
  useEffect(() => {
    refreshData();
  }, []);

  const renderSecondSelect = () => {
    if (!selectedDocument) return null;

    let options = [];
    let label = "";

    switch (selectedDocument) {
      case "priseEnCharge":
        options = stages;
        label = "Sélectionner le stage";
        break;
      case "attestation":
        options = stagiaires;
        label = "Sélectionner le stagiaire";
        break;
      case "fichePosition":
        options = apprentis;
        label = "Sélectionner l'apprenti";
        break;
    }

    return (
      <div className="form-group">
        <label className="form-label">{label}</label>
        <select
          className="form-select"
          value={selectedItem}
          onChange={(e) => setSelectedItem(e.target.value)}
        >
          <option value="">-- Sélectionner --</option>
          {options.map((item) => (
            <option 
              key={item.idStage || item.idAS || item.idAS} 
              value={item.idStage || item.idAS || item.idAS}
            >
              {selectedDocument === "priseEnCharge" 
                ? `${item.type} - ID: ${item.idStage} (${item.theme?.titre || "Sans thème"})`
                : selectedDocument === "attestation"
                ? `${item.nom} ${item.prenom} - ID: ${item.idAS}`
                : `${item.nom} ${item.prenom} - ID: ${item.idAS}`
              }
            </option>
          ))}
        </select>
      </div>
    );
  };

  const handleCalendarSubmit = () => {
    generateFichePosition(selectedItem);
    setShowCalendar(false);
    setPresenceData({});
  };

  const generateFichePosition = (apprentiId) => {
    const apprenti = apprentis.find(a => a.idAS === parseInt(apprentiId));
    if (!apprenti) {
      alert("Apprenti non trouvé");
      return;
    }

    const doc = new jsPDF();
    const currentDate = new Date();
    const month = currentDate.toLocaleString('fr-FR', { month: 'long' });
    const year = currentDate.getFullYear();
    
    // En-tête avec logo (taille réduite)
    doc.addImage(logo, 'PNG', 10, 5, 20, 20); // Modifié de Y=10 à Y=5
    
    // Titre et période
    doc.setFontSize(12);
    doc.text('FICHE DE POSITION', 105, 15, { align: 'center' });
    doc.setFontSize(10);
const day = String(currentDate.getDate()).padStart(2, '0');
const monthNum = String(currentDate.getMonth() + 1).padStart(2, '0');
doc.text(
  `Pointage de la période du : 01-${monthNum}-${year} au : ${day}-${monthNum}-${year}`,
  105,
  22,
  { align: 'center' }
);    doc.text('Page : 1/1', 160, 22);
    
    // Informations de l'apprenti
    doc.setFontSize(10);
    doc.text(`Matricule : DG${apprenti.idAS.toString().padStart(5, '0')}`, 20, 35);
    doc.text(`Nom : ${apprenti.nom}`, 80, 35);
    doc.text(`Prénom : ${apprenti.prenom}`, 140, 35);
    doc.text('Fonction : APP GESTIONNAIRE', 20, 42);
    doc.text('Structure : Direction Centrale Digitalisation&Système d\'Information', 20, 49);
    
    // Tableau des présences
    let startY = 55;
    const cellHeight = 7;
    
    // En-tête du tableau de présence avec colonnes ajustées et déplacées vers la gauche
    doc.rect(15, startY, 15, cellHeight); // Date (déplacé de 20 à 15)
    doc.rect(30, startY, 15, cellHeight); // J (déplacé de 35 à 30)
    doc.rect(45, startY, 20, cellHeight); // Pos. (déplacé de 50 à 45)
    doc.rect(65, startY, 35, cellHeight); // Observations (déplacé de 70 à 65)
    
    doc.text('Date', 18, startY + 5); // Ajusté de 23 à 18
    doc.text('J', 35, startY + 5); // Ajusté de 40 à 35
    doc.text('Pos.', 50, startY + 5); // Ajusté de 55 à 50
    doc.text('Observations', 70, startY + 5); // Ajusté de 75 à 70
    
    // Corps du tableau
    startY += cellHeight;
    const daysOfWeek = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
    const today = currentDate.getDate();
    
    // Initialiser les compteurs pour chaque type de pointage
    let countP = 0;
    let countAA = 0;
    let countF = 0;
    let countRH = 0;
    
    Array.from({ length: today }, (_, i) => i + 1).forEach(day => {
        const date = new Date(year, currentDate.getMonth(), day);
        const dayOfWeek = daysOfWeek[date.getDay()];
        
        doc.rect(15, startY, 15, cellHeight); // Date
        doc.rect(30, startY, 15, cellHeight); // J
        doc.rect(45, startY, 20, cellHeight); // Pos.
        doc.rect(65, startY, 35, cellHeight); // Observations
        
        doc.text(String(day), 20, startY + 5);
        doc.text(dayOfWeek, 35, startY + 5);
        
        // Marquer automatiquement les vendredis (5) et samedis (6) comme RH
        const dayData = presenceData[day] || {
          etat: (date.getDay() === 5 || date.getDay() === 6) ? "mission" : "present",
          observation: ""
        };
        
        const etatAffiche = {
          "present": "P",
          "absent": "AA",
          "conge": "F",
          "mission": "RH"
        }[dayData.etat];
        
        // Incrémenter les compteurs
        switch (etatAffiche) {
          case "P":
            countP++;
            break;
          case "AA":
            countAA++;
            break;
          case "F":
            countF++;
            break;
          case "RH":
            countRH++;
            break;
        }
        
        doc.text(etatAffiche, 50, startY + 5);
        
        if (dayData.observation) {
          doc.text(dayData.observation, 75, startY + 5);
        }
        
        startY += cellHeight;
    });
      
    // État du pointage - aligné à droite avec largeur augmentée
    doc.rect(105, 55, 100, 40);
    doc.text('ETAT DU POINTAGE', 130, 60);
    doc.text('Type pointage :', 110, 70);
    doc.text('AA    F    P    RH', 110, 77);
    doc.text('Nb Jours :', 110, 85);
    doc.text(`${countAA}    ${countF}    ${countP}    ${countRH}`, 110, 92);
      
      // Primes et indemnités - aligné à droite avec largeur augmentée
      doc.rect(105, 100, 100, 80);
      doc.text('PRIMES ET INDEMNITES', 125, 105);
      doc.text('PANIER :', 110, 115);
      doc.text('RETENUE PANIER :', 110, 125);
      doc.text('NOURRITURE :', 110, 135);
      doc.text('ITZIN :', 110, 145);
      doc.text('IZCV :', 110, 155);
      doc.text('IND.ROUTE :', 110, 165);
      doc.text('RETARD :', 110, 175);
      
      // Observations générales - aligné à droite avec largeur augmentée
      doc.rect(105, 185, 100, 40);
      doc.text('OBSERVATIONS', 125, 190);
      
      // Zone de signature - alignée à droite avec largeur augmentée et montée plus haut
      const signatureStartX = 105;
      const signatureWidth = 100;
      const signatureHeight = 45;
      const headerHeight = 15;
      
      // Position Y fixe pour la signature, sans dépendre de startY
      const signatureY = 230;
      
      // Création du tableau principal
      doc.rect(signatureStartX, signatureY, signatureWidth, signatureHeight);
      
      // Lignes de séparation verticales
      doc.line(signatureStartX + 33, signatureY, signatureStartX + 33, signatureY + signatureHeight);
      doc.line(signatureStartX + 66, signatureY, signatureStartX + 66, signatureY + signatureHeight);
      
      // Ligne horizontale pour séparer les en-têtes
      doc.line(signatureStartX, signatureY + headerHeight, signatureStartX + signatureWidth, signatureY + headerHeight);
      
      // Texte des en-têtes
      doc.setFontSize(9);
      
      // Première colonne
      doc.text('Visa Service', signatureStartX + 5, signatureY + 8);
      doc.text('personnel', signatureStartX + 5, signatureY + 13);
      
      // Deuxième colonne
      doc.text('Mois Exploitation', signatureStartX + 35, signatureY + 8);
      doc.text('paie', signatureStartX + 40, signatureY + 13);
      
      // Troisième colonne
      doc.text('Cachet et Signature', signatureStartX + 70, signatureY + 8);
      doc.text('Responsable', signatureStartX + 75, signatureY + 13);
      
      doc.setFontSize(10);
      
     
      
      doc.save(`fiche_position_${apprentiId}_${month}_${year}.pdf`);
    };

    const handleDocumentGeneration = () => {
      switch (selectedDocument) {
        case "fichePosition":
          setShowCalendar(true);
          break;
        case "priseEnCharge":
          generatePriseEnCharge(selectedItem);
          break;
        case "attestation":
          generateAttestation(selectedItem);
          break;
        default:
          alert("Veuillez sélectionner un type de document");
      }
    };

const generatePriseEnCharge = (stageId) => {
    // Trouver le stage
    const stage = stages.find(s => s.idStage === parseInt(stageId));
    if (!stage) {
        alert("Stage non trouvé");
        return;
    }

    // Trouver les stagiaires associés à ce stage
 const stagiairesDuStage = stagiaires.filter(s => s.stage?.idStage === parseInt(stageId));

    console.log("Stage sélectionné:", stage);
    console.log("Stagiaires trouvés:", stagiairesDuStage);
    console.log("Structure d'un stagiaire:", stagiairesDuStage[0]);
    
    //

    // Créer le document PDF
    const doc = new jsPDF();
    
    // Cadre du document
    doc.rect(10, 10, 190, 277);
    
    // En-tête avec logo
    doc.addImage(logo, 'PNG', 15, 15, 20, 20);
    
    // En-tête administratif
    doc.setFontSize(10);
    doc.text('DIRECTION GÉNÉRALE', 15, 45);
    doc.text('DIRECTION CENTRALE DIGITALISATION', 15, 50);
    doc.text('ET SYSTEME D\'INFORMATION', 15, 55);
    doc.text('N° _____/SUPP/FOR/DC-DSI/2024', 15, 65);
    
    // Zone photo
    doc.rect(160, 15, 30, 40);
    doc.text('PHOTOS', 170, 35);
    
    // Titre avec fond bleu clair
    doc.setFillColor(200, 230, 250);
    doc.rect(15, 80, 120, 10, 'F');
    doc.setFontSize(11);
    doc.text('PRISE EN CHARGE STAGE', 45, 87);
    
    // Cases à cocher
    doc.setFontSize(9);
    doc.rect(140, 77, 5, 5);
    doc.text('Avec prise en charge transport', 147, 81);
    doc.rect(140, 84, 5, 5);
    doc.text('Avec prise en charge restauration', 147, 88);
    doc.rect(140, 91, 5, 5);
    doc.text('Sans prise en charge', 147, 95);
    
    // Grand tableau principal
    const startY = 100;
    const tableHeight = 120;
    
    // Bordures extérieures du tableau
    doc.line(15, startY, 195, startY);
    doc.line(195, startY, 195, startY + tableHeight);
    doc.line(15, startY + tableHeight, 195, startY + tableHeight);
    doc.line(15, startY, 15, startY + tableHeight);
    
    // Première colonne avec fond gris
    doc.setFillColor(240, 240, 240);
    doc.rect(15, startY, 30, tableHeight, 'F');
    
    // Texte "Encadrement professionnel"
    doc.text('Encadrement', 17, startY + 35);
    doc.text('professionnel', 17, startY + 40);
    
    // Lignes verticales séparatrices
    doc.line(45, startY, 45, startY + tableHeight);
    doc.line(120, startY, 120, startY + tableHeight);
    
    // Structure du tableau
    let currentY = startY;
    const rowHeight = 10;
    
    // Structure d'encadrement
    doc.text('Structure d\'encadrement', 50, currentY + 7);
    doc.text('DC-DSI', 132, currentY + 7);
    
    // Nom et Prénom des stagiaires
    currentY += rowHeight;
    doc.line(45, currentY, 195, currentY);
    doc.text('Nom et Prénom des stagiaires', 50, currentY + 7);




// Affichage dynamique des stagiaires (2 par ligne : rectangles et noms)
if (stagiairesDuStage.length > 0) {
  let height = 2;
  for (let i = 0; i < stagiairesDuStage.length; i += 2) {
    // Premier rectangle (premier stagiaire de la ligne)
    doc.rect(125, currentY + height, 30, 6);
    // Deuxième rectangle (deuxième stagiaire de la ligne, si existe)
    if (i + 1 < stagiairesDuStage.length) {
      doc.rect(160, currentY + height, 30, 6);
    }
    // Affichage des noms/prénoms
    doc.text(
      `${stagiairesDuStage[i].nom} ${stagiairesDuStage[i].prenom}`.trim(),
      127,
      currentY + height + 4
    );
    if (i + 1 < stagiairesDuStage.length) {
      doc.text(
        `${stagiairesDuStage[i + 1].nom} ${stagiairesDuStage[i + 1].prenom}`.trim(),
        162,
        currentY + height + 4
      );
    }
    height += 6;
  }
}
// Thème de stage
currentY += rowHeight * 2;
doc.line(45, currentY, 195, currentY);
doc.text('Thème de stage', 50, currentY + 7);

const themeText = stage.theme?.titre || '';
const themeLines = doc.splitTextToSize(themeText, 60); // 60mm de large max

// Affiche chaque ligne du thème à la suite, en sautant de 5 en 5 en Y
themeLines.forEach((line, idx) => {
  doc.text(line, 125, currentY + 7 + idx * 5);
});
    // Encadreur
    currentY += rowHeight;
    doc.line(45, currentY, 195, currentY);
    doc.text('Nom de l\'encadreur', 50, currentY + 7);
    doc.text(stage.encadrant?.nom  || '', 125, currentY + 7);
    doc.text(stage.encadrant?.prenom || '', 160, currentY + 7);
    doc.text('N° poste', 150, currentY + 7);
    
    // Fonction
    currentY += rowHeight;
    doc.line(45, currentY, 195, currentY);
    doc.text('Fonction de l\'encadreur', 50, currentY + 7);
    doc.text(stage.fonctionEncadreur || '', 125, currentY + 7);
    doc.text('e-mail', 150, currentY + 7);
    
    // Date début et fin
    currentY += rowHeight;
    doc.line(45, currentY, 195, currentY);
    doc.text('Date début et fin de stage', 50, currentY + 7);
    doc.text('Du', 125, currentY + 7);
    doc.text(new Date(stage.dateDebut).toLocaleDateString('fr-FR'), 135, currentY + 7);
    doc.text('Au', 155, currentY + 7);
    doc.text(new Date(stage.dateFin).toLocaleDateString('fr-FR'), 165, currentY + 7);
    
    // Jours de réception et cases à cocher
    currentY += rowHeight;
    doc.line(45, currentY, 195, currentY);
    doc.text('Jours de réception', 50, currentY + 7);
    
    const joursColonne1 = [
        { text: 'Dimanche', y: 0 },
        { text: 'Lundi', y: 7 },
        { text: 'Mardi', y: 14 }
    ];
    
    const joursColonne2 = [
        { text: 'Mercredi', y: 0 },
        { text: 'Jeudi', y: 7 }
    ];
    
    joursColonne1.forEach(jour => {
        doc.rect(140, currentY + 3 + jour.y, 4, 4);
        doc.text(jour.text, 146, currentY + 6 + jour.y);
    });
    
    joursColonne2.forEach(jour => {
        doc.rect(170, currentY + 3 + jour.y, 4, 4);
        doc.text(jour.text, 176, currentY + 6 + jour.y);
    });
    
    // Section logistique
    const logistiqueY = startY + tableHeight + 10;
    doc.rect(15, logistiqueY, 180, 25);
    doc.setFillColor(240, 240, 240);
    doc.rect(15, logistiqueY, 30, 25, 'F');
    doc.text('Prise en charge', 17, logistiqueY + 8);
    doc.text('logistique', 17, logistiqueY + 13);
    
    doc.line(45, logistiqueY, 45, logistiqueY + 25);
    doc.text('Visa du Département Catering', 50, logistiqueY + 8);
    doc.line(45, logistiqueY + 12, 195, logistiqueY + 12);
    doc.text('Visa du Département Transport', 50, logistiqueY + 20);
    
    // Zone de signature
    const signatureY = logistiqueY + 35;
    doc.rect(15, signatureY, 180, 20);
    doc.line(105, signatureY, 105, signatureY + 20);
    doc.text('Responsable habilité de la Structure', 17, signatureY + 8);
    doc.text('(de rang de Directeur et plus)', 17, signatureY + 13);
    doc.text('Le Directeur Formation &', 110, signatureY + 8);
    doc.text('Planification RH', 110, signatureY + 13);
    
    // Sauvegarder le PDF
    doc.save(`prise_en_charge_${stageId}.pdf`);
};

  const generateAttestation = (stagiaireId) => {
      const stagiaire = stagiaires.find(s => s.idAS === parseInt(stagiaireId));
      if (!stagiaire) {
        alert("Stagiaire non trouvé");
        return;
      }
    
const stage = stages.find(s => s.idStage === stagiaire.stage?.idStage);
if (!stage) {
    alert("Stage associé non trouvé");
    return;
}
    
      const doc = new jsPDF();
      const currentDate = new Date();
      
      // Ajout du cadre autour du document
      doc.setDrawColor(255, 0, 0); 
      // Couleur du cadre (rouge)
      doc.rect(10, 10, 190, 277);
      doc.setDrawColor(0, 0, 0);
      
      // En-tête avec logo (taille réduite)
      doc.addImage(logo, 'PNG', 15, 15, 20, 20);
      
      // Informations de l'entreprise (taille réduite)
      doc.setFontSize(9);
      doc.text('DCP - RHU', 15, 45);
      doc.text('DIRECTION FORMATION & PLANIFICATION RH', 15, 50);
      doc.text('DEPARTEMENT GESTION DE LA FORMATION SIEGE', 15, 55);
      doc.text(`N° ${stagiaireId} /2024`, 15, 60);
      
      // Titre souligné (taille légèrement réduite)
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('ATTESTATION DE STAGE', 105, 65, { align: 'center' });
      const titleWidth = doc.getTextWidth('ATTESTATION DE STAGE');
      doc.line(105 - titleWidth/2, 67, 105 + titleWidth/2, 67);
      
      // Corps du texte (taille réduite)
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Je soussigné(e) : ', 15, 85);
      doc.setFont('helvetica', 'bold');
      doc.text('Le Directeur Formation & Planification RH', 50, 85);
      
      doc.setFont('helvetica', 'normal');
      doc.text('Atteste que l\'étudiant(e) : ', 15, 100);
      doc.setFont('helvetica', 'bold');
      doc.text(`${stagiaire.nom} ${stagiaire.prenom}`, 60, 100);
      doc.setFont('helvetica', 'normal');
      doc.text('né(e) le : ', 110, 100);
      doc.setFont('helvetica', 'bold');
      doc.text(`${stagiaire.dateN}`, 130, 100);
      doc.text(`${stagiaire.lieuN}`, 180, 100);
      doc.setFont('helvetica', 'normal');
      doc.text('Inscrit(e) à : ', 15, 125);
      doc.setFont('helvetica', 'bold');
      doc.text(`${etablissements.find(e => e.idEtab === stagiaire.etablissement?.idEtab)?.nomEtab || ''}`, 50, 125);
      
      doc.setFont('helvetica', 'normal');
      doc.text('A effectué un stage pratique ayant pour thème ', 15, 140);
      doc.setFont('helvetica', 'bold');
      doc.text(`« ${stage.theme?.titre} ».`, 120, 140);
      
      doc.setFont('helvetica', 'normal');
      doc.text('A : ', 15, 155);
      doc.setFont('helvetica', 'bold');
      doc.text('La Direction Centrale Digitalisation et Système d\'Information', 25, 155);
      
      doc.setFont('helvetica', 'normal');
      doc.text('Durant la période du : ', 15, 170);
      doc.setFont('helvetica', 'bold');
      doc.text(`${new Date(stage.dateDebut).toLocaleDateString('fr-FR')} au ${new Date(stage.dateFin).toLocaleDateString('fr-FR')}.`, 65, 170);
      
      // Date et signature (taille réduite)
      doc.text('Fait à : Alger', 120, 200);
      doc.text(`Le : ${currentDate.toLocaleDateString('fr-FR')}`, 160, 200);
      
      doc.setFont('helvetica', 'bold');
      doc.text('Le Directeur Formation & Planification RH', 120, 220);
      
      // Mention légale en bas (taille réduite)
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('Cette attestation est délivrée pour servir et faire valoir ce que de droit.', 15, 260);
      
      doc.save(`attestation_stage_${stagiaireId}.pdf`);
  };

  const renderCalendar = () => {
    if (!showCalendar) return null;

    const currentDate = new Date();
    const today = currentDate.getDate();

    return (
      <div className="calendar-modal-overlay">
        <div className="calendar-modal">
          <div className="calendar-modal-header">
            <h3>Calendrier des présences - {currentDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}</h3>
            <button className="close-btn" onClick={() => setShowCalendar(false)}>×</button>
          </div>
          <div className="calendar-modal-content">
            <table className="presence-table">
              <thead>
                <tr>
                  <th>Jour</th>
                  <th>État</th>
                  <th>Observation</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: today }, (_, i) => i + 1).map(day => {
                  const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                  const isWeekend = date.getDay() === 5 || date.getDay() === 6; // Vendredi ou Samedi

                  return (
                    <tr key={day}>
                      <td>{day} {currentDate.toLocaleString('fr-FR', { month: 'long' })}</td>
                      <td>
                        {isWeekend ? (
                          <span className="weekend-status">RH</span>
                        ) : (
                          <select
                            value={presenceData[day]?.etat || 'present'}
                            onChange={(e) => setPresenceData(prev => ({
                              ...prev,
                              [day]: {
                                ...prev[day],
                                etat: e.target.value,
                                observation: prev[day]?.observation || ''
                              }
                            }))}
                            className="presence-select"
                          >
                            <option value="present">P</option>
                            <option value="absent">AA</option>
                            <option value="conge">F</option>
                            <option value="mission">RH</option>
                          </select>
                        )}
                      </td>
                      <td>
                        <input
                          type="text"
                          value={presenceData[day]?.observation || ''}
                          onChange={(e) => setPresenceData(prev => ({
                            ...prev,
                            [day]: {
                              ...prev[day],
                              etat: isWeekend ? 'mission' : (prev[day]?.etat || 'present'),
                              observation: e.target.value
                            }
                          }))}
                          placeholder="Ajouter une note..."
                          className="observation-input"
                          disabled={isWeekend}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="calendar-modal-footer">
            <button className="cancel-btn" onClick={() => setShowCalendar(false)}>
              Annuler
            </button>
            <button className="submit-btn" onClick={handleCalendarSubmit}>
              Générer le document
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="documents-container">
      <div className="documents-card">
        <div className="documents-header">
          <h2 className="documents-title">
            <i className="fas fa-file-alt"></i> 
            Génération de Documents Administratifs
          </h2>
          <div className="header-actions">
            <button 
              className="refresh-btn"
              onClick={refreshData}
              title="Rafraîchir les listes"
            >
              <i className="fas fa-sync-alt"></i>
              Actualiser
            </button>
          </div>
        </div>

        <div className="documents-form">
          <div className="form-group">
            <label htmlFor="documentType" className="form-label">
              <i className="fas fa-file-signature"></i>
              Type de document administratif
            </label>
            <select
              className="form-select"
              id="documentType"
              value={selectedDocument}
              onChange={(e) => {
                setSelectedDocument(e.target.value);
                setSelectedItem("");
              }}
            >
              <option value="">-- Sélectionnez un type de document --</option>
              <option value="priseEnCharge">Prise en charge </option>
              <option value="attestation">Attestation de stage</option>
              <option value="fichePosition">Fiche de position </option>
            </select>
          </div>

          {renderSecondSelect()}

          <div className="form-actions">
            <button
              className="generate-btn"
              onClick={handleDocumentGeneration}
              disabled={!selectedDocument || !selectedItem}
            >
              <i className="fas fa-file-pdf"></i>
              Générer le document
            </button>
          </div>
        </div>
      </div>
      {renderCalendar()}
    </div>
  );
}

export default DocumentsGeneration;



