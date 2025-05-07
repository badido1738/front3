import logo from '../assets/Sonatrach.svg.png';
function Authentification(){
    const[Nomutilisateur , SetNomutilisateur ]= useState('');
    const[Motdepasse, SetMotdepasse ]= useState('');



  const handleSubmit = event =>{
    event.preventDefault();
    
    alert ('nom saisi:$ {nom}');
    
  };

    return (
      <div>
        <div className="body">
        <img src={logo} alt="Logo Sonatrach" className="logo" />
   <form className="connecter slideIn" onSubmit={handleSubmit}>
<h3>Remplissez les champs requis pour vous connecter </h3>
   <label>  Nom utilisateur :  </label> 
 
 <input type="text"  placeholder =" entrer le nom d'utilisateur"required value= {Nomutilisateur} onChange={(event) =>
    SetNomutilisateur(event.target.value)}/>
    <br />
    <br />
      <label> Mot de passe :  </label>
  <input type="password"  placeholder=" entrer le mot de passe" required minLength="5" value= {Motdepasse} onChange={(event) =>
    SetMotdepasse(event.target.value)}/>
    
   <br />
   <br />
    <button type="submit">Se connecter</button>
    
   </form>

   </div>
   </div>
    );

    
}

export default Authentification;