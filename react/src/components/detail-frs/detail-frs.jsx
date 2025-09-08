import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CltfrsService } from '../../services/cltfrs/cltfrs.service';
import './detail-frs.scss';

const DetailFrs = ({ fournisseur, onSuppressionResult }) => {
  const navigate = useNavigate();
  const cltFrsService = new CltfrsService();

  const modifierFournisseur = () => {
    if (fournisseur.id) {
      navigate(`/dashboard/nouveaufournisseur/${fournisseur.id}`);
    }
  };

  const confirmerEtSupprimer = async () => {
    if (fournisseur.id) {
      const result = await cltFrsService.deleteFournisseur(fournisseur.id);
      
      if (result.success) {
        onSuppressionResult('success');
      } else {
        // Afficher le message d'erreur spécifique
        const errorMessage = result.error?.message || 'Erreur lors de la suppression';
        onSuppressionResult(errorMessage);
      }
    }
  };

  return (
    <>
      <div className="detail-fournisseur">
        <div className="detail-fournisseur__photo">
          {fournisseur.photo && (
            <img 
              src={fournisseur.photo} 
              alt="Photo fournisseur"
              width="100" 
              height="100" 
            />
          )}
        </div>

        <div className="detail-fournisseur__info">
          <div className="detail-fournisseur__info-item">
            <i className="fas fa-info-circle detail-fournisseur__icon"></i>
            <span>{fournisseur.nom}</span>
          </div>
          <div className="detail-fournisseur__info-item">
            <i className="fas fa-info-circle detail-fournisseur__icon"></i>
            <span>{fournisseur.prenom}</span>
          </div>
          <div className="detail-fournisseur__info-item">
            <i className="fas fa-phone-alt detail-fournisseur__icon"></i>
            <span>{fournisseur.numTel}</span>
          </div>
          <div className="detail-fournisseur__info-item">
            <i className="fas fa-envelope detail-fournisseur__icon"></i>
            <span>{fournisseur.email}</span>
          </div>
        </div>

        <div className="detail-fournisseur__address">
          <div className="detail-fournisseur__info-item">
            <i className="fas fa-home detail-fournisseur__icon"></i>
            <span>{fournisseur.adresse?.adresse1}&nbsp;{fournisseur.adresse?.adresse2}</span>
          </div>
          <div className="detail-fournisseur__info-item">
            <i className="fas fa-map-marker-alt detail-fournisseur__icon"></i>
            <span>{fournisseur.adresse?.codePostale}&nbsp;{fournisseur.adresse?.ville}</span>
          </div>
          <div className="detail-fournisseur__info-item">
            <i className="fas fa-globe-europe detail-fournisseur__icon"></i>
            <span>{fournisseur.adresse?.pays}</span>
          </div>
        </div>

        <div className="detail-fournisseur__actions">
          <button 
            type="button" 
            className="detail-fournisseur__btn detail-fournisseur__btn--edit"
            onClick={modifierFournisseur}
          >
            <i className="fas fa-pencil-alt"></i>&nbsp;Modifier
          </button>
          <button 
            type="button" 
            className="detail-fournisseur__btn detail-fournisseur__btn--delete"
            onClick={() => {
              const modal = document.getElementById(`modalDelete${fournisseur.id}`);
              if (modal) {
                modal.classList.add('show');
                modal.style.display = 'block';
              }
            }}
          >
            <i className="fas fa-trash-alt"></i>&nbsp;Supprimer
          </button>
          <button type="button" className="detail-fournisseur__btn detail-fournisseur__btn--details">
            <i className="far fa-list-alt"></i>&nbsp;Details
          </button>
        </div>
      </div>

      <div 
        className="detail-fournisseur__modal" 
        id={`modalDelete${fournisseur.id}`}
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="detail-fournisseur__modal-dialog">
          <div className="detail-fournisseur__modal-content">
            <div className="detail-fournisseur__modal-header">
              <h5 className="detail-fournisseur__modal-title">Confirmation</h5>
              <button 
                type="button" 
                className="detail-fournisseur__modal-close"
                onClick={() => {
                  const modal = document.getElementById(`modalDelete${fournisseur.id}`);
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
            <div className="detail-fournisseur__modal-body">
              Êtes-vous sûr de vouloir supprimer ce fournisseur ?
            </div>
            <div className="detail-fournisseur__modal-footer">
              <button 
                type="button" 
                className="detail-fournisseur__modal-btn detail-fournisseur__modal-btn--secondary"
                onClick={() => {
                  const modal = document.getElementById(`modalDelete${fournisseur.id}`);
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
                className="detail-fournisseur__modal-btn detail-fournisseur__modal-btn--danger"
                onClick={() => {
                  confirmerEtSupprimer();
                  const modal = document.getElementById(`modalDelete${fournisseur.id}`);
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

export default DetailFrs;
