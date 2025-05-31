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
          <button className="close-button">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="auth-icon">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          
          <h2>Connexion</h2>
          <p className="auth-subtitle">Veuillez entrer vos identifiants</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur</label>
            <div className="input-container">
              <svg className="input-icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Entrez votre nom d'utilisateur"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <div className="input-container">
              <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                id="password"
                type="password"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                required
                placeholder="Entrez votre mot de passe"
              />
            </div>
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