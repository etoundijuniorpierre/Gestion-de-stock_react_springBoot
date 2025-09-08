import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CltfrsService } from '../../services/cltfrs/cltfrs.service';
import './detail-cmd-clt.scss';

const DetailCmdClt = ({ client, onSuppressionResult }) => {
  const navigate = useNavigate();
  const cltFrsService = new CltfrsService();

  const modifierClient = () => {
    if (client.id) {
      navigate(`/dashboard/nouveauclient/${client.id}`);
    }
  };

  const confirmerEtSupprimer = async () => {
    if (client.id) {
      const result = await cltFrsService.deleteClient(client.id);
      
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
      <div className="detail-cmd-clt">
        <div className="detail-cmd-clt__photo">
          {client.photo && (
            <img 
              src={client.photo} 
              alt="Photo client"
              width="100" 
              height="100" 
            />
          )}
        </div>

        <div className="detail-cmd-clt__info">
          <div className="detail-cmd-clt__info-item">
            <i className="fas fa-info-circle detail-cmd-clt__icon"></i>
            <span>{client.nom}</span>
          </div>
          <div className="detail-cmd-clt__info-item">
            <i className="fas fa-info-circle detail-cmd-clt__icon"></i>
            <span>{client.prenom}</span>
          </div>
          <div className="detail-cmd-clt__info-item">
            <i className="fas fa-phone-alt detail-cmd-clt__icon"></i>
            <span>{client.numTel}</span>
          </div>
          <div className="detail-cmd-clt__info-item">
            <i className="fas fa-envelope detail-cmd-clt__icon"></i>
            <span>{client.email}</span>
          </div>
        </div>

        <div className="detail-cmd-clt__address">
          <div className="detail-cmd-clt__info-item">
            <i className="fas fa-home detail-cmd-clt__icon"></i>
            <span>{client.adresse?.adresse1}&nbsp;{client.adresse?.adresse2}</span>
          </div>
          <div className="detail-cmd-clt__info-item">
            <i className="fas fa-map-marker-alt detail-cmd-clt__icon"></i>
            <span>{client.adresse?.codePostale}&nbsp;{client.adresse?.ville}</span>
          </div>
          <div className="detail-cmd-clt__info-item">
            <i className="fas fa-globe-europe detail-cmd-clt__icon"></i>
            <span>{client.adresse?.pays}</span>
          </div>
        </div>

        <div className="detail-cmd-clt__actions">
          <button 
            type="button" 
            className="detail-cmd-clt__btn detail-cmd-clt__btn--edit"
            onClick={modifierClient}
          >
            <i className="fas fa-pencil-alt"></i>&nbsp;Modifier
          </button>
          <button 
            type="button" 
            className="detail-cmd-clt__btn detail-cmd-clt__btn--delete"
            onClick={() => {
              const modal = document.getElementById(`modalDelete${client.id}`);
              if (modal) {
                modal.classList.add('show');
                modal.style.display = 'block';
              }
            }}
          >
            <i className="fas fa-trash-alt"></i>&nbsp;Supprimer
          </button>
          <button type="button" className="detail-cmd-clt__btn detail-cmd-clt__btn--details">
            <i className="far fa-list-alt"></i>&nbsp;Details
          </button>
        </div>
      </div>

      <div 
        className="detail-cmd-clt__modal" 
        id={`modalDelete${client.id}`}
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="detail-cmd-clt__modal-dialog">
          <div className="detail-cmd-clt__modal-content">
            <div className="detail-cmd-clt__modal-header">
              <h5 className="detail-cmd-clt__modal-title">Confirmation</h5>
              <button 
                type="button" 
                className="detail-cmd-clt__modal-close"
                onClick={() => {
                  const modal = document.getElementById(`modalDelete${client.id}`);
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
            <div className="detail-cmd-clt__modal-body">
              Êtes-vous sûr de vouloir supprimer ce client ?
            </div>
            <div className="detail-cmd-clt__modal-footer">
              <button 
                type="button" 
                className="detail-cmd-clt__modal-btn detail-cmd-clt__modal-btn--secondary"
                onClick={() => {
                  const modal = document.getElementById(`modalDelete${client.id}`);
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
                className="detail-cmd-clt__modal-btn detail-cmd-clt__modal-btn--danger"
                onClick={() => {
                  confirmerEtSupprimer();
                  const modal = document.getElementById(`modalDelete${client.id}`);
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

export default DetailCmdClt;
