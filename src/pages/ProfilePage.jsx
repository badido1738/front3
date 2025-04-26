import React, { useState,useEffect } from "react";
import ProfileForm from "../form/ProfileForm";
import "../form/form.css";
import "../pages/page.css";

function ProfilePage() {
  const [showForm, setShowForm] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [editingProfile, setEditingProfile] = useState(null);


    useEffect(() => {
      fetch('http://localhost:8080/utilisateurs')
        .then(res => {
          return res.json();
        })
        .then(data => {
          setProfiles(data);
        })
    }, [])
  

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce stagiaire ?")) {
      try {
        const response = await fetch(`http://localhost:8080/utilisateurs/${id}`, {
          method: "DELETE",
        });
  
        if (response.ok) {
          window.location.reload();
          setProfiles(profiles.filter(profile => profile.id !== id));
          console.log("Profile supprimé avec succès");
        } else {
          const errorText = await response.text();
          console.error("Erreur lors de la suppression :", errorText);
        }
      } catch (error) {
        console.error("Erreur réseau :", error);
      }
    }
  };


  const handleEdit = (profile) => {
    setEditingProfile(profile);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingProfile(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProfile(null);
  };

  const handleFormSubmit = (formData) => {
    if (editingProfile) {
      // Mise à jour d'un profil existant
      setProfiles(profiles.map(p => p.idUser === editingProfile.idUser ? { ...formData } : p));
    } else {
      // Ajout d'un nouveau profil
      const newId = profiles.length > 0 ? Math.max(...profiles.map(p => p.idUser)) + 1 : 1;
      setProfiles([...profiles, { ...formData, idUser: newId }]);
    }
    setShowForm(false);
  };

  return (
    <div className="page-container">
      {showForm ? (
        <div className="form-overlay">
          <div className="form-container">
            <div className="form-header">
              <h3>{editingProfile ? "Modifier le profil" : "Ajouter un profil"}</h3>
              <button className="close-button" onClick={handleFormClose}>×</button>
            </div>
            <ProfileForm 
              initialData={editingProfile} 
              onSubmit={handleFormSubmit} 
              onCancel={handleFormClose}
            />
          </div>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-header">
            <h2>Liste des Profils</h2>
            <button className="btn-primary" onClick={handleAddNew}>+ Ajouter un profil</button>
          </div>
          
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Rôle</th>
                <th>ID Employé</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile) => (
                <tr key={profile.idUser}>
                  <td>{profile.idUser}</td>
                  <td>{profile.username}</td>
                  <td>{profile.role}</td>
                  <td>{profile.idEmp}</td>
                  <td className="actions-cell">
                    <button className="btn-edit" onClick={() => handleEdit(profile)}>Modifier</button>
                    <button className="btn-delete" onClick={() => handleDelete(profile.idUser)}>Supprimer</button>
                  </td>
                </tr>
              ))}
              {profiles.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty-table">Aucun profil disponible</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;