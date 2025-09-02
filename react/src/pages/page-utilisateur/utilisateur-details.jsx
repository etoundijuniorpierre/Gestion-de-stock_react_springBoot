import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserService } from '../../services/user/user.service';

const UtilisateurDetails = () => {
  const [utilisateur, setUtilisateur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const userService = new UserService();

  useEffect(() => {
    if (id) {
      findUtilisateurById(id);
    }
  }, [id]);

  const findUtilisateurById = async (userId) => {
    try {
      setLoading(true);
      const user = await userService.findById(userId);
      if (user && user.id) {
        setUtilisateur(user);
      } else {
        setError('Utilisateur non trouvé');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      setError(error.message || 'Erreur lors de la récupération de l\'utilisateur');
    } finally {
      setLoading(false);
    }
  };

  const retourListe = () => {
    navigate('/dashboard/utilisateurs');
  };

  const modifierUtilisateur = () => {
    navigate(`/dashboard/nouvelutilisateur/${id}`);
  };

  const formatAdresse = (adresse) => {
    if (!adresse) return 'Non renseignée';
    const parts = [
      adresse.adresse1,
      adresse.adresse2,
      adresse.ville,
      adresse.codePostale,
      adresse.pays
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Non renseignée';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non renseignée';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR');
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <h4>Erreur</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={retourListe}>
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  if (!utilisateur) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          <h4>Utilisateur non trouvé</h4>
          <button className="btn btn-primary" onClick={retourListe}>
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Détails de l'utilisateur</h2>
            <div>
              <button className="btn btn-warning me-2" onClick={modifierUtilisateur}>
                <i className="fas fa-pencil-alt"></i>&nbsp;Modifier
              </button>
              <button className="btn btn-secondary" onClick={retourListe}>
                <i className="fas fa-arrow-left"></i>&nbsp;Retour
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h5>Informations personnelles</h5>
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <td><strong>Nom :</strong></td>
                        <td>{utilisateur.nom || 'Non renseigné'}</td>
                      </tr>
                      <tr>
                        <td><strong>Prénom :</strong></td>
                        <td>{utilisateur.prenom || 'Non renseigné'}</td>
                      </tr>
                      <tr>
                        <td><strong>Email :</strong></td>
                        <td>{utilisateur.email || 'Non renseigné'}</td>
                      </tr>
                      <tr>
                        <td><strong>Date de naissance :</strong></td>
                        <td>{formatDate(utilisateur.dateDeNaissance)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="col-md-6">
                  <h5>Adresse</h5>
                  <p>{formatAdresse(utilisateur.adresse)}</p>
                  
                  {utilisateur.entreprise && (
                    <>
                      <h5>Entreprise</h5>
                      <p><strong>Nom :</strong> {utilisateur.entreprise.nom || 'Non renseigné'}</p>
                      <p><strong>Description :</strong> {utilisateur.entreprise.description || 'Non renseignée'}</p>
                    </>
                  )}
                  
                  {utilisateur.roles && utilisateur.roles.length > 0 && (
                    <>
                      <h5>Rôles</h5>
                      <ul className="list-unstyled">
                        {utilisateur.roles.map((role, index) => (
                          <li key={index} className="badge bg-primary me-1">
                            {role.roleName}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UtilisateurDetails;
