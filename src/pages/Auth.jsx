import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css'; // Import the CSS file

function Auth() {
  const [username, setUsername] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const response = await axios.post('http://localhost:8080/auth/login', {
        username,
        motDePasse,
      });

      if (response.data && response.data.token) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        
        // Store role if available
        if (response.data.role) {
          localStorage.setItem('role', response.data.role);
        }
        
        // Log token and role to console
        console.log('Token:', response.data.token);
        console.log('Role:', response.data.role || 'No role provided');
        
        // Try to extract role from JWT token
        try {
          const tokenPayload = JSON.parse(atob(response.data.token.split('.')[1]));
          console.log('Token payload:', tokenPayload);
          
          if (tokenPayload.role || tokenPayload.roles) {
            const extractedRole = tokenPayload.role || tokenPayload.roles;
            console.log('Role from token:', extractedRole);
            
            // Store extracted role if not explicitly provided in response
            if (!response.data.role) {
              localStorage.setItem('role', 
                Array.isArray(extractedRole) ? extractedRole[0] : extractedRole);
            }
          }
        } catch (e) {
          console.log('Could not decode token. It may not be in JWT format.');
        }
        
        // Redirect to auth-check which will then redirect to the main page
        navigate('/auth-check');
      } else {
        throw new Error("Format de réponse invalide du serveur");
      }
    } catch (error) {
      setErrorMsg("Nom d'utilisateur ou mot de passe incorrect");
      console.error("Erreur de connexion:", error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Connexion</h2>
          <div className="auth-divider"></div>
        </div>
        
        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Entrez votre nom d'utilisateur"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
              placeholder="Entrez votre mot de passe"
            />
          </div>
          
          <button type="submit" className="auth-button">
            Se connecter
          </button>
          
          {errorMsg && (
            <div className="error-message">
              {errorMsg}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Auth;