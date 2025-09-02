import React from 'react';
import './detail-utilisateur.scss';

const DetailUtilisateur = () => {
  return (
    <div className="detail-utilisateur">
      <div className="detail-utilisateur__photo">
        <img src="assets/product.png" width="100" height="100" alt="User" />
      </div>
    
      {/* Details utilisateur */}
      <div className="detail-utilisateur__info">
        <div className="detail-utilisateur__info-item">
          <i className="fas fa-info-circle detail-utilisateur__icon"></i>
          <span>Nom</span>
        </div>
        <div className="detail-utilisateur__info-item">
          <i className="fas fa-info-circle detail-utilisateur__icon"></i>
          <span>Prenom</span>
        </div>
        <div className="detail-utilisateur__info-item">
          <i className="fas fa-phone-alt detail-utilisateur__icon"></i>
          <span>0011 22 33 44 55 66</span>
        </div>
      </div>
    
      {/* details adresse */}
      <div className="detail-utilisateur__address">
        <div className="detail-utilisateur__info-item">
          <i className="fas fa-home detail-utilisateur__icon"></i>
          <span>Adresse 1 adresse 2</span>
        </div>
        <div className="detail-utilisateur__info-item">
          <i className="fas fa-map-marker-alt detail-utilisateur__icon"></i>
          <span>12345 Ville</span>
        </div>
        <div className="detail-utilisateur__info-item">
          <i className="fas fa-globe-europe detail-utilisateur__icon"></i>
          <span>Pays</span>
        </div>
      </div>
    
      {/* boutons action */}
      <div className="detail-utilisateur__actions">
        <button type="button" className="detail-utilisateur__btn detail-utilisateur__btn--edit">
          <i className="fas fa-pencil-alt"></i>&nbsp;Modifier
        </button>
        <button type="button" className="detail-utilisateur__btn detail-utilisateur__btn--delete">
          <i className="fas fa-trash-alt"></i>&nbsp;Supprimer
        </button>
        <button type="button" className="detail-utilisateur__btn detail-utilisateur__btn--details">
          <i className="far fa-list-alt"></i>&nbsp;Details
        </button>
      </div>
    </div>
  );
};

export default DetailUtilisateur;
