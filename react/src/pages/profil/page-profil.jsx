import React from 'react';
import { useNavigate } from 'react-router-dom';
import './page-profil.scss';

const PageProfil = () => {
  const navigate = useNavigate();

  const modifierMotDePasse = () => {
    navigate('/changermotdepasse');
  };

  return (
    <div className="page-profil">
      <div className="page-profil__left">
        <div className="page-profil__photo">
          <img src="assets/product.png" className="page-profil__avatar" width="200" height="200" alt="Profile" />
        </div>
        <div className="page-profil__info">
          <h2 className="page-profil__name">Nom Prenom</h2>
          <small className="page-profil__address">Adresse, Ville, 12345</small>
        </div>
        <div className="page-profil__actions">
          <button type="button" className="page-profil__btn page-profil__btn--primary">
            <i className="fas fa-pencil-alt"></i>&nbsp;Modifier le profil
          </button>
          <button type="button" className="page-profil__btn page-profil__btn--warning" onClick={modifierMotDePasse}>
            <i className="fas fa-lock"></i>&nbsp;Changer le mot de passe
          </button>
        </div>
      </div>
      <div className="page-profil__right">
        <table className="page-profil__table">
          <tbody>
            <tr className="page-profil__row">
              <th scope="row" className="page-profil__label">Nom complet</th>
              <td className="page-profil__value">nom prenom</td>
            </tr>
            <tr className="page-profil__row">
              <th scope="row" className="page-profil__label">Email</th>
              <td className="page-profil__value">adresse@email.com</td>
            </tr>
            <tr className="page-profil__row">
              <th scope="row" className="page-profil__label">Téléphone</th>
              <td className="page-profil__value">011 22 33 44 55 66</td>
            </tr>
            <tr className="page-profil__row">
              <th scope="row" className="page-profil__label">Adresse</th>
              <td className="page-profil__value">Adresse, Ville, 12345</td>
            </tr>
            <tr className="page-profil__row">
              <th scope="row" className="page-profil__label">Entreprise</th>
              <td className="page-profil__value">Nom entreprise</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PageProfil;
