import React from "react";
import productImg from '../../assets/product.png';
import './detailArticle.scss';

export default function DetailArticle() {
    return (
        <div className="row mb-2 align-items-center p-2 custom-border">

          {/* Image */}
          <div className="col-md-1 text-center">
            <img src={productImg} alt="Produit" className="img-fluid" style={{maxHeight:"80px"}} />
          </div>

          {/* Infos Article */}
          <div className="col-md-5 infosArticle">
            <p><i className="fas fa-info-circle blue-color"></i> codeArticle</p>
            <p><i className="fas fa-info-circle blue-color"></i> designation</p>
            <p><i className="fas fa-dollar-sign blue-color"></i> prixUnitaireHt</p>
            <p><i className="fas fa-dollar-sign blue-color"></i> prixUnitaireTtc</p>
          </div>

          {/* Catégorie */}
          <div className="col-md-3">
            <p><i className="fas fa-flag-checkered blue-color"></i> category?.code</p>
            <p>category?.designation</p>
          </div>

          {/* Boutons */}
          <div className="col-md-3 text-right">
            <button type="button" className="btn btn-sm btn-link">
              <i className="fas fa-pencil-alt"></i> Modifier
            </button>
            <button type="button" className="btn btn-sm btn-link text-danger" data-toggle="modal" data-target="#modalDeleteArticle">
              <i className="fas fa-trash-alt"></i> Supprimer
            </button>
            <button type="button" className="btn btn-sm btn-link">
              <i className="far fa-list-alt"></i> Détails
            </button>
          </div>

          {/* Modal Suppression */}
          <div className="modal fade" id="modalDeleteArticle" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirmation</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  Êtes-vous sûr de vouloir supprimer cet article ?
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">
                    <i className="fas fa-ban"></i>&nbsp;Annuler
                  </button>
                  <button type="button" className="btn btn-danger" data-dismiss="modal">
                    <i className="fas fa-trash-alt"></i>&nbsp;Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
    )
}
