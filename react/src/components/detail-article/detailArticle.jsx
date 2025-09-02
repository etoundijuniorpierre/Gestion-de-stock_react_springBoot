import React from "react";
import productImg from '../../assets/product.png';
import './detailArticle.scss';

export default function DetailArticle() {
    return (
        <div className="detail-article">
          {/* Image */}
          <div className="detail-article__image">
            <img src={productImg} alt="Produit" />
          </div>

          {/* Infos Article */}
          <div className="detail-article__info">
            <p><i className="fas fa-info-circle detail-article__icon"></i> codeArticle</p>
            <p><i className="fas fa-info-circle detail-article__icon"></i> designation</p>
            <p><i className="fas fa-dollar-sign detail-article__icon"></i> prixUnitaireHt</p>
            <p><i className="fas fa-dollar-sign detail-article__icon"></i> prixUnitaireTtc</p>
          </div>

          {/* Catégorie */}
          <div className="detail-article__category">
            <p><i className="fas fa-flag-checkered detail-article__icon"></i> category?.code</p>
            <p>category?.designation</p>
          </div>

          {/* Boutons */}
          <div className="detail-article__actions">
            <button type="button" className="detail-article__btn detail-article__btn--edit">
              <i className="fas fa-pencil-alt"></i> Modifier
            </button>
            <button type="button" className="detail-article__btn detail-article__btn--delete">
              <i className="fas fa-trash-alt"></i> Supprimer
            </button>
            <button type="button" className="detail-article__btn detail-article__btn--details">
              <i className="far fa-list-alt"></i> Détails
            </button>
          </div>

          {/* Modal Suppression */}
          <div className="detail-article__modal" id="modalDeleteArticle" tabIndex="-1" aria-hidden="true">
            <div className="detail-article__modal-dialog">
              <div className="detail-article__modal-content">
                <div className="detail-article__modal-header">
                  <h5 className="detail-article__modal-title">Confirmation</h5>
                  <button type="button" className="detail-article__modal-close" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="detail-article__modal-body">
                  Êtes-vous sûr de vouloir supprimer cet article ?
                </div>
                <div className="detail-article__modal-footer">
                  <button type="button" className="detail-article__modal-btn detail-article__modal-btn--secondary">
                    <i className="fas fa-ban"></i>&nbsp;Annuler
                  </button>
                  <button type="button" className="detail-article__modal-btn detail-article__modal-btn--danger">
                    <i className="fas fa-trash-alt"></i>&nbsp;Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
}
