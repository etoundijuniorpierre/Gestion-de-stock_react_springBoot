import React from 'react';
import './detail-cmd-frs.scss';

const DetailCmdFrs = ({ commande }) => {
  const getDateCommande = () => {
    if (commande.dateCommande) {
      return new Date(commande.dateCommande).toLocaleDateString('fr-FR');
    }
    return '';
  };

  const getNomFournisseur = () => {
    if (commande.fournisseur) {
      return `${commande.fournisseur.nom || ''} ${commande.fournisseur.prenom || ''}`.trim();
    }
    return '';
  };

  return (
    <div className="detail-cmd-frs">
      <div className="detail-cmd-frs__photo">
        <img 
          src={commande.fournisseur?.photo || 'assets/product.png'} 
          alt="Photo fournisseur"
          width="100" 
          height="100" 
        />
      </div>

      {/* Details commande */}
      <div className="detail-cmd-frs__info">
        <div className="detail-cmd-frs__info-item">
          <i className="fas fa-info-circle detail-cmd-frs__icon"></i>
          <span><strong>Commande:</strong> {commande.code || 'N/A'}</span>
        </div>
        <div className="detail-cmd-frs__info-item">
          <i className="fas fa-calendar detail-cmd-frs__icon"></i>
          <span><strong>Date:</strong> {getDateCommande()}</span>
        </div>
        <div className="detail-cmd-frs__info-item">
          <i className="fas fa-tag detail-cmd-frs__icon"></i>
          <span><strong>État:</strong> {commande.etatCommande || 'N/A'}</span>
        </div>
        <div className="detail-cmd-frs__info-item">
          <i className="fas fa-user detail-cmd-frs__icon"></i>
          <span><strong>Fournisseur:</strong> {getNomFournisseur()}</span>
        </div>
      </div>

      {/* Details fournisseur */}
      <div className="detail-cmd-frs__fournisseur">
        <div className="detail-cmd-frs__info-item">
          <i className="fas fa-phone-alt detail-cmd-frs__icon"></i>
          <span>{commande.fournisseur?.numTel || 'N/A'}</span>
        </div>
        <div className="detail-cmd-frs__info-item">
          <i className="fas fa-envelope detail-cmd-frs__icon"></i>
          <span>{commande.fournisseur?.mail || 'N/A'}</span>
        </div>
        <div className="detail-cmd-frs__info-item">
          <i className="fas fa-map-marker-alt detail-cmd-frs__icon"></i>
          <span>{commande.fournisseur?.adresse?.ville || 'N/A'}</span>
        </div>
      </div>

      {/* Boutons action */}
      <div className="detail-cmd-frs__actions">
        <button type="button" className="detail-cmd-frs__btn detail-cmd-frs__btn--edit">
          <i className="fas fa-edit"></i>&nbsp;Modifier
        </button>
        <button type="button" className="detail-cmd-frs__btn detail-cmd-frs__btn--validate">
          <i className="fas fa-check"></i>&nbsp;Valider
        </button>
      </div>
    </div>
  );
};

export default DetailCmdFrs;