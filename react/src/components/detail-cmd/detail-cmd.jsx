import React from 'react';
import './detail-cmd.scss';

const DetailCmd = ({ ligneCommande }) => {
  const calculerTotal = () => {
    if (ligneCommande.quantite && ligneCommande.prixUnitaire) {
      return ligneCommande.quantite * ligneCommande.prixUnitaire;
    }
    return 0;
  };

  return (
    <div className="detail-cmd">
      <div className="detail-cmd__content">
        <div className="detail-cmd__article">
          <div className="detail-cmd__info-item">
            <i className="fas fa-box detail-cmd__icon"></i>
            <span><strong>Article:</strong> {ligneCommande.article?.designation || 'N/A'}</span>
          </div>
        </div>

        <div className="detail-cmd__quantite">
          <div className="detail-cmd__info-item">
            <i className="fas fa-sort-numeric-up detail-cmd__icon"></i>
            <span><strong>Quantité:</strong> {ligneCommande.quantite || 0}</span>
          </div>
        </div>

        <div className="detail-cmd__prix">
          <div className="detail-cmd__info-item">
            <i className="fas fa-euro-sign detail-cmd__icon"></i>
            <span><strong>Prix unitaire:</strong> {ligneCommande.prixUnitaire || 0} €</span>
          </div>
        </div>

        <div className="detail-cmd__total">
          <div className="detail-cmd__info-item">
            <i className="fas fa-calculator detail-cmd__icon"></i>
            <span><strong>Total:</strong> {calculerTotal()} €</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailCmd;
