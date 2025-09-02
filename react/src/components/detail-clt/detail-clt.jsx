import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CltfrsService } from '../../services/cltfrs/cltfrs.service';
import './detail-clt.scss';

const DetailClt = ({ client, onSuppressionResult }) => {
  const navigate = useNavigate();
  const cltFrsService = new CltfrsService();

  const modifierClient = () => {
    if (client.id) {
      navigate(`/dashboard/nouveauclient/${client.id}`);
    }
  };

  const confirmerEtSupprimer = async () => {
    if (client.id) {
      try {
        await cltFrsService.deleteClient(client.id);
        onSuppressionResult('success');
      } catch (error) {
        onSuppressionResult(error.response?.data?.error || 'Erreur lors de la suppression');
      }
    }
  };

  return (
    <>
      <div className="detail-client">
        <div className="detail-client__photo">
          <img 
            src={client.photo ? client.photo : '/src/assets/product.png'} 
            alt="Photo client"
            width="100" 
            height="100" 
          />
        </div>

        {/* Details client */}
        <div className="detail-client__info">
          <div className="detail-client__info-item">
            <i className="fas fa-info-circle detail-client__icon"></i>
            <span>{client.nom}</span>
          </div>
          <div className="detail-client__info-item">
            <i className="fas fa-info-circle detail-client__icon"></i>
            <span>{client.prenom}</span>
          </div>
          <div className="detail-client__info-item">
            <i className="fas fa-phone-alt detail-client__icon"></i>
            <span>{client.numTel}</span>
          </div>
          <div className="detail-client__info-item">
            <i className="fas fa-envelope detail-client__icon"></i>
            <span>{client.email}</span>
          </div>
        </div>

        {/* Details adresse */}
        <div className="detail-client__address">
          <div className="detail-client__info-item">
            <i className="fas fa-home detail-client__icon"></i>
            <span>{client.adresse?.adresse1}&nbsp;{client.adresse?.adresse2}</span>
          </div>
          <div className="detail-client__info-item">
            <i className="fas fa-map-marker-alt detail-client__icon"></i>
            <span>{client.adresse?.codePostale}&nbsp;{client.adresse?.ville}</span>
          </div>
          <div className="detail-client__info-item">
            <i className="fas fa-globe-europe detail-client__icon"></i>
            <span>{client.adresse?.pays}</span>
          </div>
        </div>

        {/* Boutons action */}
        <div className="detail-client__actions">
          <button 
            type="button" 
            className="detail-client__btn detail-client__btn--edit"
            onClick={modifierClient}
          >
            <i className="fas fa-pencil-alt"></i>&nbsp;Modifier
          </button>
          <button 
            type="button" 
            className="detail-client__btn detail-client__btn--delete"
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
          <button type="button" className="detail-client__btn detail-client__btn--details">
            <i className="far fa-list-alt"></i>&nbsp;Details
          </button>
        </div>
      </div>

      {/* Modal */}
      <div 
        className="detail-client__modal" 
        id={`modalDelete${client.id}`}
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="detail-client__modal-dialog">
          <div className="detail-client__modal-content">
            <div className="detail-client__modal-header">
              <h5 className="detail-client__modal-title">Confirmation</h5>
              <button 
                type="button" 
                className="detail-client__modal-close"
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
            <div className="detail-client__modal-body">
              Êtes-vous sûr de vouloir supprimer ce client ?
            </div>
            <div className="detail-client__modal-footer">
              <button 
                type="button" 
                className="detail-client__modal-btn detail-client__modal-btn--secondary"
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
                className="detail-client__modal-btn detail-client__modal-btn--danger"
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

export default DetailClt;
