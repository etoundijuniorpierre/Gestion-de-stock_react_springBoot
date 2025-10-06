import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CltfrsService } from '../../services/cltfrs/cltfrs.service';
import './detail-clt-frs.scss';

const DetailCltFrs = ({ clientFournisseur, origin, onSuppressionResult }) => {
  const navigate = useNavigate();
  const cltFrsService = new CltfrsService();
  const [showDetails, setShowDetails] = useState(false);

  const modifier = () => {
    if (clientFournisseur.id) {
      if (origin === 'fournisseur') {
        navigate(`/dashboard/nouveaufournisseur/${clientFournisseur.id}`);
      } else {
        navigate(`/dashboard/nouveauclient/${clientFournisseur.id}`);
      }
    }
  };

  const confirmerEtSupprimer = async () => {
    if (clientFournisseur.id) {
      let result;
      if (origin === 'fournisseur') {
        result = await cltFrsService.deleteFournisseur(clientFournisseur.id);
      } else {
        result = await cltFrsService.deleteClient(clientFournisseur.id);
      }
      
      if (result.success) {
        onSuppressionResult('success');
      } else {
        // Afficher le message d'erreur spécifique selon le type
        const errorMessage = origin === 'fournisseur' 
          ? "Impossible de supprimer un fournisseur qui a déjà des commandes fournisseurs"
          : "Impossible de supprimer un client qui a déjà des commandes clients";
        onSuppressionResult(errorMessage);
      }
    }
  };

  const getPhoto = () => {
    return clientFournisseur.photo || null;
  };

  return (
    <>
      <div className="detail-clt-frs">
        <div className="detail-clt-frs__photo">
          {getPhoto() && (
            <img 
              src={getPhoto()} 
              alt={`Photo ${origin === 'fournisseur' ? 'fournisseur' : 'client'}`}
              width="100" 
              height="100" 
            />
          )}
        </div>

        {/* Details */}
        <div className="detail-clt-frs__info">
          <div className="detail-clt-frs__info-item">
            <i className="fas fa-info-circle detail-clt-frs__icon"></i>
            <span>{clientFournisseur.nom}</span>
          </div>
          <div className="detail-clt-frs__info-item">
            <i className="fas fa-info-circle detail-clt-frs__icon"></i>
            <span>{clientFournisseur.prenom}</span>
          </div>
          <div className="detail-clt-frs__info-item">
            <i className="fas fa-phone-alt detail-clt-frs__icon"></i>
            <span>{clientFournisseur.numTel}</span>
          </div>
          <div className="detail-clt-frs__info-item">
            <i className="fas fa-envelope detail-clt-frs__icon"></i>
            <span>{clientFournisseur.mail || clientFournisseur.email || 'N/A'}</span>
          </div>
        </div>

        {/* Details adresse */}
        <div className="detail-clt-frs__address">
          <div className="detail-clt-frs__info-item">
            <i className="fas fa-home detail-clt-frs__icon"></i>
            <span>{clientFournisseur.adresse?.adresse1}&nbsp;{clientFournisseur.adresse?.adresse2}</span>
          </div>
          <div className="detail-clt-frs__info-item">
            <i className="fas fa-map-marker-alt detail-clt-frs__icon"></i>
            <span>{clientFournisseur.adresse?.codePostale}&nbsp;{clientFournisseur.adresse?.ville}</span>
          </div>
          <div className="detail-clt-frs__info-item">
            <i className="fas fa-globe-europe detail-clt-frs__icon"></i>
            <span>{clientFournisseur.adresse?.pays}</span>
          </div>
        </div>

        {/* Boutons action */}
        <div className="detail-clt-frs__actions">
          <button 
            type="button" 
            className="detail-clt-frs__btn detail-clt-frs__btn--edit"
            onClick={modifier}
          >
            <i className="fas fa-pencil-alt"></i>&nbsp;Modifier
          </button>
          <button 
            type="button" 
            className="detail-clt-frs__btn detail-clt-frs__btn--delete"
            onClick={() => {
              const modal = document.getElementById(`modalDelete${clientFournisseur.id}`);
              if (modal) {
                modal.classList.add('show');
                modal.style.display = 'block';
              }
            }}
          >
            <i className="fas fa-trash-alt"></i>&nbsp;Supprimer
          </button>
          <button 
            type="button" 
            className="detail-clt-frs__btn detail-clt-frs__btn--details"
            onClick={() => setShowDetails(!showDetails)}
          >
            <i className="far fa-list-alt"></i>&nbsp;{showDetails ? 'Masquer' : 'Details'}
          </button>
        </div>
      </div>

      {/* Section détails supplémentaires - Show only personal info when details is clicked */}
      {showDetails && (
        <div className="detail-clt-frs__details-section">
          <div className="detail-clt-frs__details-header">
            <h4>Informations personnelles</h4>
          </div>
          <div className="detail-clt-frs__details-content">
            <div className="detail-clt-frs__details-grid">
              <div className="detail-clt-frs__details-item">
                <strong>Nom:</strong> {clientFournisseur.nom}
              </div>
              <div className="detail-clt-frs__details-item">
                <strong>Prénom:</strong> {clientFournisseur.prenom}
              </div>
              <div className="detail-clt-frs__details-item">
                <strong>Email:</strong> {clientFournisseur.mail || clientFournisseur.email || 'N/A'}
              </div>
              <div className="detail-clt-frs__details-item">
                <strong>Téléphone:</strong> {clientFournisseur.numTel}
              </div>
              <div className="detail-clt-frs__details-item">
                <strong>Adresse:</strong> {clientFournisseur.adresse?.adresse1} {clientFournisseur.adresse?.adresse2}
              </div>
              <div className="detail-clt-frs__details-item">
                <strong>Code postal:</strong> {clientFournisseur.adresse?.codePostale}
              </div>
              <div className="detail-clt-frs__details-item">
                <strong>Ville:</strong> {clientFournisseur.adresse?.ville}
              </div>
              <div className="detail-clt-frs__details-item">
                <strong>Pays:</strong> {clientFournisseur.adresse?.pays}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <div 
        className="detail-clt-frs__modal" 
        id={`modalDelete${clientFournisseur.id}`}
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="detail-clt-frs__modal-dialog">
          <div className="detail-clt-frs__modal-content">
            <div className="detail-clt-frs__modal-header">
              <h5 className="detail-clt-frs__modal-title">Confirmation</h5>
              <button 
                type="button" 
                className="detail-clt-frs__modal-close"
                onClick={() => {
                  const modal = document.getElementById(`modalDelete${clientFournisseur.id}`);
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
            <div className="detail-clt-frs__modal-body">
              Êtes-vous sûr de vouloir supprimer ce {origin === 'fournisseur' ? 'fournisseur' : 'client'} ?
            </div>
            <div className="detail-clt-frs__modal-footer">
              <button 
                type="button" 
                className="detail-clt-frs__modal-btn detail-clt-frs__modal-btn--secondary"
                onClick={() => {
                  const modal = document.getElementById(`modalDelete${clientFournisseur.id}`);
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
                className="detail-clt-frs__modal-btn detail-clt-frs__modal-btn--danger"
                onClick={() => {
                  confirmerEtSupprimer();
                  const modal = document.getElementById(`modalDelete${clientFournisseur.id}`);
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

export default DetailCltFrs;