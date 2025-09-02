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
      try {
        let result;
        if (origin === 'fournisseur') {
          result = await cltFrsService.deleteFournisseur(clientFournisseur.id);
        } else {
          result = await cltFrsService.deleteClient(clientFournisseur.id);
        }
        
        if (result.success) {
          onSuppressionResult('success');
        } else {
          onSuppressionResult(result.error || 'Erreur lors de la suppression');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        onSuppressionResult(error.response?.data?.error || 'Erreur lors de la suppression');
      }
    }
  };

  const getPhoto = () => {
    if (clientFournisseur.photo) {
      return clientFournisseur.photo;
    }
    if (origin === 'fournisseur') {
      return '/src/assets/fournisseur1.jpg';
    }
    return '/src/assets/client1.jpg';
  };

  return (
    <>
      <div className="detail-clt-frs">
        <div className="detail-clt-frs__photo">
          <img 
            src={getPhoto()} 
            alt={`Photo ${origin === 'fournisseur' ? 'fournisseur' : 'client'}`}
            width="100" 
            height="100" 
          />
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
            <span>{clientFournisseur.email}</span>
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

      {/* Section détails supplémentaires */}
      {showDetails && (
        <div className="detail-clt-frs__details-section">
          <div className="detail-clt-frs__details-header">
            <h4>Informations détaillées</h4>
          </div>
          <div className="detail-clt-frs__details-content">
            <div className="detail-clt-frs__details-grid">
              <div className="detail-clt-frs__details-item">
                <strong>ID:</strong> {clientFournisseur.id}
              </div>
              <div className="detail-clt-frs__details-item">
                <strong>Date de création:</strong> {clientFournisseur.dateCreation ? new Date(clientFournisseur.dateCreation).toLocaleDateString() : 'Non spécifiée'}
              </div>
              <div className="detail-clt-frs__details-item">
                <strong>Dernière modification:</strong> {clientFournisseur.dateModification ? new Date(clientFournisseur.dateModification).toLocaleDateString() : 'Non spécifiée'}
              </div>
              <div className="detail-clt-frs__details-item">
                <strong>Statut:</strong> {clientFournisseur.actif ? 'Actif' : 'Inactif'}
              </div>
              {clientFournisseur.entreprise && (
                <div className="detail-clt-frs__details-item">
                  <strong>Entreprise:</strong> {clientFournisseur.entreprise.nom}
                </div>
              )}
              {clientFournisseur.categorie && (
                <div className="detail-clt-frs__details-item">
                  <strong>Catégorie:</strong> {clientFournisseur.categorie.nom}
                </div>
              )}
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
