import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserService } from '../../services/user/user.service';
import ButtonAction from '../../components/button-action/button.jsx';
import Pagination from '../../components/pagination/pagination.jsx';

const PageUtilisateur = () => {
  const [listUtilisateurs, setListUtilisateurs] = useState([]);
  const [selectedUserIdToDelete, setSelectedUserIdToDelete] = useState(-1);
  const [errorMsgs, setErrorMsgs] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();
  const userService = new UserService();

  useEffect(() => {
    findAllUtilisateurs();
  }, []);

  const findAllUtilisateurs = async () => {
    try {
      setLoading(true);
      const utilisateurs = await userService.findAll();
      setListUtilisateurs(utilisateurs);
      setErrorMsgs('');
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      setErrorMsgs(error.message || 'Erreur lors de la récupération des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const nouvelUtilisateur = () => {
    navigate('/dashboard/nouvelutilisateur');
  };

  const modifierUtilisateur = (id) => {
    navigate(`/dashboard/nouvelutilisateur/${id}`);
  };

  const voirDetailsUtilisateur = (id) => {
    // Pour l'instant, on navigue vers la page de modification
    // Vous pouvez créer une page de détails séparée plus tard
    navigate(`/dashboard/utilisateur-details/${id}`);
  };

  const confirmerEtSupprimerUser = async () => {
    if (selectedUserIdToDelete !== -1) {
      try {
        await userService.delete(selectedUserIdToDelete);
        setSelectedUserIdToDelete(-1);
        setShowDeleteModal(false);
        findAllUtilisateurs();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setErrorMsgs(error.message || 'Erreur lors de la suppression de l\'utilisateur');
      }
    }
  };

  const annulerSuppressionUser = () => {
    setSelectedUserIdToDelete(-1);
    setShowDeleteModal(false);
  };

  const selectUserPourSupprimer = (id) => {
    setSelectedUserIdToDelete(id);
    setShowDeleteModal(true);
  };

  const formatAdresse = (adresse) => {
    if (!adresse) return 'N/A';
    const parts = [
      adresse.adresse1,
      adresse.adresse2,
      adresse.ville,
      adresse.codePostale,
      adresse.pays
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : 'N/A';
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

  return (
    <div className="col">
      <div className="row m-3">
        <div className="col-md-8 p-0">
          <h1>Liste des utilisateurs</h1>
        </div>
        <div className="col-md-4 text-right">
          <ButtonAction
            onClick={nouvelUtilisateur}
            text="Nouvel utilisateur"
          />
        </div>
      </div>
      
      <div className="col m-3">
        {errorMsgs && (
          <div className="row col-md-12 alert alert-danger">
            {errorMsgs}
          </div>
        )}
        
        {listUtilisateurs.length === 0 ? (
          <div className="row col-md-12 custom-border mb-3 p-3">
            <div className="col-md-12 text-center">
              Aucun utilisateur trouvé
            </div>
          </div>
        ) : (
          listUtilisateurs.map((utilisateur) => (
            <div key={utilisateur.id} className="row col-md-12 custom-border mb-3 p-3">
              <div className="col-md-2 custom-border-right">
                <strong>Nom:</strong> {utilisateur.nom || 'N/A'}
              </div>
              <div className="col-md-2 custom-border-right">
                <strong>Prénom:</strong> {utilisateur.prenom || 'N/A'}
              </div>
              <div className="col-md-2 custom-border-right">
                <strong>Email:</strong> {utilisateur.email || 'N/A'}
              </div>
              <div className="col-md-3 custom-border-right">
                <strong>Adresse:</strong> {formatAdresse(utilisateur.adresse)}
              </div>
              <div className="col-md-3">
                <div className="row">
                  <div className="col-md-3">
                    <button 
                      type="button" 
                      className="btn btn-link text-primary" 
                      onClick={() => voirDetailsUtilisateur(utilisateur.id)}
                    >
                      <i className="far fa-list-alt"></i>&nbsp;Détails
                    </button>
                  </div>
                  <div className="col-md-3">
                    <button 
                      type="button" 
                      className="btn btn-link text-warning" 
                      onClick={() => modifierUtilisateur(utilisateur.id)}
                    >
                      <i className="fas fa-pencil-alt"></i>&nbsp;Modifier
                    </button>
                  </div>
                  <div className="col-md-3">
                    <button 
                      type="button" 
                      className="btn btn-link text-danger" 
                      onClick={() => selectUserPourSupprimer(utilisateur.id)}
                    >
                      <i className="fas fa-trash-alt"></i>&nbsp;Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {listUtilisateurs.length > 0 && (
        <div className="row mb-3">
          <div className="col-md-12 text-center">
            <Pagination />
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmation</h5>
                <button 
                  type="button" 
                  className="close" 
                  onClick={annulerSuppressionUser}
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Êtes-vous sûr de vouloir supprimer cet utilisateur ?
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={annulerSuppressionUser}
                >
                  <i className="fas fa-ban"></i>&nbsp;Annuler
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={confirmerEtSupprimerUser}
                >
                  <i className="fas fa-trash-alt"></i>&nbsp;Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageUtilisateur;
