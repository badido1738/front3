export default function Footer() {
    return (
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <h2>Gestion des Stagiaires</h2>
            <p>Une solution efficace pour gérer les stagiaires de l'entreprise Sonatrach.</p>
          </div>
          <div className="footer-section">
            <h2>Liens Utiles</h2>
            <ul>
              <li><a href="#">Accueil</a></li>
              <li><a href="#">Tableau de Bord</a></li>
              <li><a href="#">Stagiaires</a></li>
              <li><a href="#">Paramètres</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h2>Contact</h2>
            <p>Email : support@sonatrach.com</p>
            <p>Téléphone : +213 123 456 789</p>
            <p>Adresse : Alger, Algérie</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Sonatrach - Tous droits réservés</p>
        </div>
      </footer>
    );
  }
  