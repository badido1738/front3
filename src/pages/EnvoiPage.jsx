import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EnvoiPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [directions, setDirections] = useState([]);
  const [stagiaires, setStagiaires] = useState([]);
  const [apprentis, setApprentis] = useState([]);
  const [currentUserDirection, setCurrentUserDirection] = useState('');

  const documentTypeOptions = [
    "Contrat",
    "Convention",
    "Attestation de Stage",
    "Fiche de Position",
    "Prise en Charge",
    "Autre"
  ];

  const [formData, setFormData] = useState({
    typeDocument: '',
    autreTypeDocument: '',
    stagiaire: '',
    autreStagiaire: '',
    directionReception: '',
    autreDirectionReception: '',
    notes: ''
  });

  const [showAutreTypeDocument, setShowAutreTypeDocument] = useState(false);
  const [showAutreStagiaire, setShowAutreStagiaire] = useState(false);
  const [showAutreDirectionReception, setShowAutreDirectionReception] = useState(false);
  const [errors, setErrors] = useState({});

  const getToken = () => localStorage.getItem('token');

  const fetchWithAuth = async (url) => {
    const token = getToken();
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erreur lors de la récupération depuis ${url}:`, error);
      throw error;
    }
  };

  const fetchUserProfile = async () => {
    const token = getToken();
    try {
      const response = await fetch("http://localhost:8080/utilisateurs/profile", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  };

// Update the useEffect section where data is fetched and combined
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);

      // Get user profile (which includes direction info)
      const profile = await fetchUserProfile();
      if (profile && profile.designationDirection) {
        setCurrentUserDirection(profile.designationDirection);
      }

      const directionsData = await fetchWithAuth("http://localhost:8080/directions");
      setDirections(directionsData);

      // Fetch both stagiaires and apprentis
      const [stagiairesData, apprentisData] = await Promise.all([
        fetchWithAuth("http://localhost:8080/stagiaires"),
        fetchWithAuth("http://localhost:8080/apprentis")
      ]);

      // First, process apprentis
      const apprentisProcessed = apprentisData.map(a => ({ 
        ...a, 
        type: 'Apprenti' 
      }));

      // Get IDs of apprentis to exclude from stagiaires
      const apprentisIds = apprentisProcessed.map(a => a.idAS);

      // Process stagiaires, excluding those who are also apprentis
      const stagiairesProcessed = stagiairesData
        .filter(s => !apprentisIds.includes(s.idAS))
        .map(s => ({ 
          ...s, 
          type: 'Stagiaire' 
        }));

      // Combine filtered lists
      const combinedTrainees = [...apprentisProcessed, ...stagiairesProcessed];

      setStagiaires(combinedTrainees);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  fetchData();
}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'typeDocument') setShowAutreTypeDocument(value === 'Autre');
    if (name === 'stagiaire') setShowAutreStagiaire(value === 'Autre');
    if (name === 'directionReception') setShowAutreDirectionReception(value === 'Autre');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.typeDocument.trim()) newErrors.typeDocument = 'Le type de document est requis';
    else if (formData.typeDocument === 'Autre' && !formData.autreTypeDocument.trim())
      newErrors.autreTypeDocument = 'Veuillez préciser le type de document';

    if (!formData.stagiaire.trim()) newErrors.stagiaire = 'Le stagiaire/apprenti est requis';
    else if (formData.stagiaire === 'Autre' && !formData.autreStagiaire.trim())
      newErrors.autreStagiaire = 'Veuillez préciser le stagiaire/apprenti';

    if (!formData.directionReception.trim()) newErrors.directionReception = 'La direction est requise';
    else if (formData.directionReception === 'Autre' && !formData.autreDirectionReception.trim())
      newErrors.autreDirectionReception = 'Veuillez préciser la direction';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const prepareDataForSubmission = () => {
    const dataToSubmit = { ...formData };

    if (formData.typeDocument === 'Autre') {
      dataToSubmit.typeDocument = formData.autreTypeDocument;
    }

    if (formData.stagiaire === 'Autre') {
      dataToSubmit.stagiaire = formData.autreStagiaire;
    } else {
      const selectedTrainee = stagiaires.find(t =>
        `${t.prenom} ${t.nom}` === formData.stagiaire
      );
      if (selectedTrainee) dataToSubmit.traineeType = selectedTrainee.type;
    }

    if (formData.directionReception === 'Autre') {
      dataToSubmit.directionReception = formData.autreDirectionReception;
    }

    delete dataToSubmit.autreTypeDocument;
    delete dataToSubmit.autreStagiaire;
    delete dataToSubmit.autreDirectionReception;

    return dataToSubmit;
  };

  const createNotification = async (documentData) => {
    const token = getToken();
    
    // Determine person type
    let personType = 'stagiaire'; // default
    if (documentData.stagiaire !== 'Autre') {
      const selectedTrainee = stagiaires.find(t =>
        `${t.prenom} ${t.nom}` === documentData.stagiaire
      );
      if (selectedTrainee) {
        personType = selectedTrainee.type.toLowerCase();
      }
    }

    const notificationData = {
      sendingDirection: currentUserDirection,
      receivingDirection: documentData.directionReception,
      documentType: documentData.typeDocument,
      concernedPerson: documentData.stagiaire,
      personType: personType,
      date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
      status: 'pending', // Initial status for sent notifications
      viewed: false,
      type: 'sent'
    };

    try {
      const response = await fetch("http://localhost:8080/notifications", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(notificationData)
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de la notification");
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création de la notification:', error);
      // Don't fail the whole process if notification creation fails
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const dataToSubmit = prepareDataForSubmission();

      const token = getToken();
      
      // Send the document
      const response = await fetch("http://localhost:8080/documents", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSubmit)
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }
        throw new Error("Erreur lors de l'envoi du document");
      }

      const result = await response.json();
      
      // Create notification after successful document submission
      await createNotification(dataToSubmit);
      
      alert('Document envoyé avec succès!');
      console.log('Succès:', result);

      // Reset form
      setFormData({
        typeDocument: '',
        autreTypeDocument: '',
        stagiaire: '',
        autreStagiaire: '',
        directionReception: '',
        autreDirectionReception: '',
        notes: ''
      });
      setShowAutreTypeDocument(false);
      setShowAutreStagiaire(false);
      setShowAutreDirectionReception(false);
    } catch (err) {
      console.error(err);
      alert('Une erreur est survenue lors de l\'envoi du document');
    } finally {
      setLoading(false);
    }
  };

  if (loading && directions.length === 0) return <div className="envoi-page-container">Chargement en cours...</div>;
  if (error) return <div className="envoi-page-container">Erreur: {error}</div>;

  return (
    <div className="envoi-page-container">
      <h1 className="envoi-page-title">Signaler l'envoi d'un document</h1>
      <form onSubmit={handleSubmit}>
        <div className="envoi-form-row">
          {/* Type Document */}
          <div className="envoi-form-group">
            <label htmlFor="typeDocument" className="envoi-form-label">Type du document :</label>
            <select
              id="typeDocument"
              name="typeDocument"
              value={formData.typeDocument}
              onChange={handleChange}
              className="envoi-form-select"
              disabled={loading}
            >
              <option value="">Sélectionnez le type</option>
              {documentTypeOptions.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
            </select>
            {errors.typeDocument && <p className="envoi-form-error">{errors.typeDocument}</p>}
            {showAutreTypeDocument && (
              <input
                type="text"
                name="autreTypeDocument"
                value={formData.autreTypeDocument}
                onChange={handleChange}
                placeholder="Précisez le type de document"
                className="envoi-form-input"
              />
            )}
            {errors.autreTypeDocument && <p className="envoi-form-error">{errors.autreTypeDocument}</p>}
          </div>

          {/* Stagiaire */}
          <div className="envoi-form-group">
            <label htmlFor="stagiaire" className="envoi-form-label">Stagiaire/Apprenti :</label>
            <select
              id="stagiaire"
              name="stagiaire"
              value={formData.stagiaire}
              onChange={handleChange}
              className="envoi-form-select"
              disabled={loading}
            >
              <option value="">Sélectionnez un stagiaire</option>
              {stagiaires.map((t, i) => (
                <option key={i} value={`${t.prenom} ${t.nom}`}>
                  {`${t.prenom} ${t.nom} (${t.type})`}
                </option>
              ))}
              <option value="Autre">Autre</option>
            </select>
            {errors.stagiaire && <p className="envoi-form-error">{errors.stagiaire}</p>}
            {showAutreStagiaire && (
              <input
                type="text"
                name="autreStagiaire"
                value={formData.autreStagiaire}
                onChange={handleChange}
                placeholder="Précisez le stagiaire/apprenti"
                className="envoi-form-input"
              />
            )}
            {errors.autreStagiaire && <p className="envoi-form-error">{errors.autreStagiaire}</p>}
          </div>

          {/* Direction */}
          <div className="envoi-form-group">
            <label htmlFor="directionReception" className="envoi-form-label">Direction destinataire :</label>
            <select
              id="directionReception"
              name="directionReception"
              value={formData.directionReception}
              onChange={handleChange}
              className="envoi-form-select"
              disabled={loading}
            >
              <option value="">Sélectionnez une direction</option>
              {directions.map((d, i) => (
                <option key={i} value={d.designation}>{d.designation}</option>
              ))}
              <option value="Autre">Autre</option>
            </select>
            {errors.directionReception && <p className="envoi-form-error">{errors.directionReception}</p>}
            {showAutreDirectionReception && (
              <input
                type="text"
                name="autreDirectionReception"
                value={formData.autreDirectionReception}
                onChange={handleChange}
                placeholder="Précisez la direction"
                className="envoi-form-input"
              />
            )}
            {errors.autreDirectionReception && <p className="envoi-form-error">{errors.autreDirectionReception}</p>}
          </div>
        </div>

        {/* Current User Direction Info */}
        {currentUserDirection && (
          <div className="envoi-form-group">
            <p className="current-direction-info">
              <strong>Direction expéditrice:</strong> {currentUserDirection}
            </p>
          </div>
        )}

        {/* Notes */}
        <div className="envoi-form-group">
          <label htmlFor="notes" className="envoi-form-label">Notes ou commentaires :</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            className="envoi-form-textarea"
            disabled={loading}
          />
        </div>

        <div className="envoi-form-buttons">
          <button
            type="submit"
            className="envoi-form-button envoi-button-submit"
            disabled={loading}
          >
            {loading ? 'Envoi en cours...' : 'Envoyer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EnvoiPage;