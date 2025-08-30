import React, { useState } from 'react';
import './nouvel-article.scss';
import ReactLogo from "../../../assets/react.ico";

const NouvelArticle = () => {
  return (
    <div className="nouvel-article-container">
      {/* Image */}
      <div className="logo-section">
        <button className="logo-button">
          <img src={ReactLogo} alt="Logo" className="logo-image" />
        </button>
      </div>

      <hr className="divider" />

      {/* Titre */}
      <div className="title-section">
        <h2 className="form-title">
          <i className="fas fa-info-circle blue-color"></i> Informations de l'article
        </h2>
      </div>

      {/* Message erreur */}
      <div className="alert alert-danger error-message">
        <span>Un message d'erreur ici</span>
      </div>

      {/* Formulaire */}
      <form className="nouvel-article-form">
        <div className="form-row">
          <div className="form-group">
            <input type="text" className="form-control" name="codearticle" placeholder="Code article" />
          </div>
          <div className="form-group">
            <input type="text" className="form-control" name="designation" placeholder="Désignation" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <input type="text" className="form-control" name="prixunitht" placeholder="Prix unitaire HT" />
          </div>
          <div className="form-group">
            <input type="text" className="form-control" name="tauxtva" placeholder="Taux TVA" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <input type="text" className="form-control" name="prixunitttc" placeholder="Prix unitaire TTC" />
          </div>
          <div className="form-group">
            <select className="form-control" name="cat">
              <option value="null">Sélectionner une catégorie</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>
          </div>
        </div>

        <hr className="divider2" />

        {/* Boutons */}
        <div className="button-section">
          <button className="btn btn-danger cancel-btn">
            <i className="fas fa-ban"></i> Annuler
          </button>
          <button className="btn btn-primary save-btn">
            <i className="fas fa-save"></i> Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
};

export default NouvelArticle;
