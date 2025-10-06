import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserService } from '../../services/user/user.service';
import './detail-utilisateur.scss';

const DetailUtilisateur = ({ utilisateur, onSuppressionResult }) => {
  const navigate = useNavigate();
  const userService = new UserService();
  const [showDetails, setShowDetails] = useState(false);

  const modifier = () => {
    if (utilisateur.id) {
      navigate(`/dashboard/nouvelutilisateur/${utilisateur.id}`);
    }
  };

  const voirDetails = () => {
    if (utilisateur.id) {
      navigate(`/dashboard/utilisateur-details/${utilisateur.id}`);
    }
  };

  const confirmerEtSupprimer = async () => {
    if (utilisateur.id) {
      try {
        const result = await userService.delete(utilisateur.id);
        if (result.success) {
          onSuppressionResult('success');
        } else {
          onSuppressionResult(result.error?.message || "Erreur lors de la suppression de l'utilisateur");
        }
      } catch (error) {
        onSuppressionResult(error.message || "Erreur lors de la suppression de l'utilisateur");
      }
    }
  };

  const getPhoto = () => {
    return utilisateur.photo || null;
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

  return (
    <>
      <div className="detail-utilisateur">
        <div className="detail-utilisateur__photo">
          {getPhoto() ? (
            <img 
              src={getPhoto()} 
              alt="Photo utilisateur"
              width="100" 
              height="100" 
            />
          ) : (
            <div className="detail-utilisateur__photo-placeholder">
              <i className="fas fa-user"></i>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="detail-utilisateur__info">
          <div className="detail-utilisateur__info-item">
            <i className="fas fa-info-circle detail-utilisateur__icon"></i>
            <span>{utilisateur.nom || 'N/A'}</span>
          </div>
          <div className="detail-utilisateur__info-item">
            <i className="fas fa-info-circle detail-utilisateur__icon"></i>
            <span>{utilisateur.prenom || 'N/A'}</span>
          </div>
          <div className="detail-utilisateur__info-item">
            <i className="fas fa-envelope detail-utilisateur__icon"></i>
            <span>{utilisateur.email || 'N/A'}</span>
          </div>
          <div className="detail-utilisateur__info-item">
            <i className="fas fa-phone-alt detail-utilisateur__icon"></i>
            <span>{utilisateur.numTel || 'N/A'}</span>
          </div>
        </div>

        {/* Details adresse */}
        <div className="detail-utilisateur__address">
          <div className="detail-utilisateur__info-item">
            <i className="fas fa-home detail-utilisateur__icon"></i>
            <span>{formatAdresse(utilisateur.adresse)}</span>
          </div>
        </div>

        {/* Boutons action */}
        <div className="detail-utilisateur__actions">
          <button 
            type="button" 
            className="detail-utilisateur__btn detail-utilisateur__btn--view"
            onClick={voirDetails}
          >
            <i className="far fa-list-alt"></i>&nbsp;Détails
          </button>
          <button 
            type="button" 
            className="detail-utilisateur__btn detail-utilisateur__btn--edit"
            onClick={modifier}
          >
            <i className="fas fa-pencil-alt"></i>&nbsp;Modifier
          </button>
          <button 
            type="button" 
            className="detail-utilisateur__btn detail-utilisateur__btn--delete"
            onClick={() => {
              const modal = document.getElementById(`modalDelete${utilisateur.id}`);
              if (modal) {
                modal.classList.add('show');
                modal.style.display = 'block';
              }
            }}
          >
            <i className="fas fa-trash-alt"></i>&nbsp;Supprimer
          </button>
        </div>
      </div>

      {/* Section détails supplémentaires - Show only personal info when details is clicked */}
      {showDetails && (
        <div className="detail-utilisateur__details-section">
          <div className="detail-utilisateur__details-header">
            <h4>Informations personnelles</h4>
          </div>
          <div className="detail-utilisateur__details-content">
            <div className="detail-utilisateur__details-grid">
              <div className="detail-utilisateur__details-item">
                <strong>Nom:</strong> {utilisateur.nom || 'N/A'}
              </div>
              <div className="detail-utilisateur__details-item">
                <strong>Prénom:</strong> {utilisateur.prenom || 'N/A'}
              </div>
              <div className="detail-utilisateur__details-item">
                <strong>Email:</strong> {utilisateur.email || 'N/A'}
              </div>
              <div className="detail-utilisateur__details-item">
                <strong>Téléphone:</strong> {utilisateur.numTel || 'N/A'}
              </div>
              <div className="detail-utilisateur__details-item">
                <strong>Adresse:</strong> {utilisateur.adresse?.adresse1 || ''} {utilisateur.adresse?.adresse2 || ''}
              </div>
              <div className="detail-utilisateur__details-item">
                <strong>Code postal:</strong> {utilisateur.adresse?.codePostale || 'N/A'}
              </div>
              <div className="detail-utilisateur__details-item">
                <strong>Ville:</strong> {utilisateur.adresse?.ville || 'N/A'}
              </div>
              <div className="detail-utilisateur__details-item">
                <strong>Pays:</strong> {utilisateur.adresse?.pays || 'N/A'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <div 
        className="detail-utilisateur__modal" 
        id={`modalDelete${utilisateur.id}`}
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="detail-utilisateur__modal-dialog">
          <div className="detail-utilisateur__modal-content">
            <div className="detail-utilisateur__modal-header">
              <h5 className="detail-utilisateur__modal-title">Confirmation</h5>
              <button 
                type="button" 
                className="detail-utilisateur__modal-close"
                onClick={() => {
                  const modal = document.getElementById(`modalDelete${utilisateur.id}`);
                  if (modal) {
                    modal.classList.remove('show');
                    modal.style.display = 'none';
                  }
                }}
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="detail-utilisateur__modal-body">
              Êtes-vous sûr de vouloir supprimer cet utilisateur ?
            </div>
            <div className="detail-utilisateur__modal-footer">
              <button 
                type="button" 
                className="detail-utilisateur__modal-btn detail-utilisateur__modal-btn--secondary"
                onClick={() => {
                  const modal = document.getElementById(`modalDelete${utilisateur.id}`);
                  if (modal) {
                    modal.classList.remove('show');
                    modal.style.display = 'none';
                  }
                }}
              >
                <i className="fas fa-ban"></i>&nbsp;Annuler
              </button>
              <button 
                type="button" 
                className="detail-utilisateur__modal-btn detail-utilisateur__modal-btn--danger"
                onClick={() => {
                  confirmerEtSupprimer();
                  const modal = document.getElementById(`modalDelete${utilisateur.id}`);
                  if (modal) {
                    modal.classList.remove('show');
                    modal.style.display = 'none';
                  }
                }}
              >
                <i className="fas fa-trash-alt"></i>&nbsp;Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailUtilisateur;