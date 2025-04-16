

export default function Home() {
  return (
    <div className="home-container">
      <h1>Bienvenue dans l'application de Gestion des Stagiaires</h1>
      <p>Utilisez le menu à gauche pour naviguer entre les différentes sections :</p>
      <ul>
        <li>Profil - Gérez votre profil utilisateur</li>
        <li>Stagiaire / Apprenti - Gérez les informations des stagiaires/apprentis</li>
        <li>Documents - Consultez et gérez les documents</li>
        <li>Fiche de Position - Consultez et gérez les fiches de position</li>
        <li>Stage - Gérez les informations concernant les stages</li>
      </ul>
    </div>
  );
}