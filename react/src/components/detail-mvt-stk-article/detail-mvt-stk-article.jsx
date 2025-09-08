import React, { useState, useEffect } from 'react';
import './detail-mvt-stk-article.scss';
import Portal from '../portal/portal';
import MouvementStockService from '../../services/mouvement-stock/mouvement-stock.service';

export default function DetailMvtStkArticle({ onToggleCollapse, isExpanded, article }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [correctionData, setCorrectionData] = useState({
    quantity: '',
    type: 'positive'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Instance du service
  const mouvementStockService = new MouvementStockService();

  // Empêcher le scroll du body et désactiver les interactions quand le modal est ouvert
  useEffect(() => {
    if (isModalOpen) {
      // Ajouter la classe pour désactiver la page
      document.body.classList.add('modal-open');
    } else {
      // Retirer la classe pour réactiver la page
      document.body.classList.remove('modal-open');
    }

    // Cleanup function
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isModalOpen]);

  // Fermer le modal avec la touche Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeCorrectionModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isModalOpen]);

  const openCorrectionModal = () => {
    setIsModalOpen(true);
  };

  const closeCorrectionModal = () => {
    setIsModalOpen(false);
    // Reset form data
    setCorrectionData({
      quantity: '',
      type: 'positive'
    });
    // Reset messages
    setErrorMessage('');
    setSuccessMessage('');
  };
  
  const validateQuantity = (e) => {
    const value = e.target.value;
    // Permettre seulement les nombres et le point décimal
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setCorrectionData({...correctionData, quantity: value});
    }
  };

  const handleTypeChange = (e) => {
    setCorrectionData({...correctionData, type: e.target.value});
  };

  const onSubmitCorrection = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!correctionData.quantity || parseFloat(correctionData.quantity) <= 0) {
      setErrorMessage('Veuillez entrer une quantité valide');
      return;
    }

    if (!article || !article.id) {
      setErrorMessage('Article non trouvé');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Créer le DTO de mouvement de stock
      const mvtStkDto = mouvementStockService.createMvtStkDto(
        article, 
        correctionData.quantity, 
        correctionData.type,
        1 // idEntreprise par défaut
      );

      // Appeler l'API selon le type de correction
      let response;
      if (correctionData.type === 'positive') {
        response = await mouvementStockService.correctionPositive(mvtStkDto);
      } else {
        response = await mouvementStockService.correctionNegative(mvtStkDto);
      }

      console.log('Correction de stock réussie:', response);
      setSuccessMessage(`Correction ${correctionData.type === 'positive' ? 'positive' : 'négative'} effectuée avec succès`);
      
      // Fermer le modal après un délai pour permettre à l'utilisateur de voir le message de succès
      setTimeout(() => {
        closeCorrectionModal();
        // Optionnel: rafraîchir les données de l'article ou notifier le composant parent
        if (typeof onToggleCollapse === 'function') {
          // On peut déclencher un refresh des données ici
        }
      }, 2000);

    } catch (error) {
      console.error('Erreur lors de la correction de stock:', error);
      setErrorMessage(
        error.response?.data?.message || 
        error.message || 
        'Une erreur est survenue lors de la correction de stock'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeCorrectionModal();
    }
  };

  return (
    <>
      <div className="detail-mvt-stk-article">
        <div className="product-image-section custom-border-right">
          <img src="assets/product.png" width="80px" height="80px" alt="Product Image" />
        </div>

        {/*  Details article*/}
        <div className="article-details-section custom-border-right">
          <div className="details-container">
            <div className="detail-row">
              <div className="detail-icon"><i className="fas fa-barcode blue-color"></i></div>
              <div className="detail-text">{article?.codeArticle || 'Code article'}</div>
            </div>
            <div className="detail-row">
              <div className="detail-icon"><i className="fas fa-info-circle blue-color"></i></div>
              <div className="detail-text">{article?.designation || 'Désignation'}</div>
            </div>
            <div className="detail-row">
              <div className="detail-icon"><i className="fas fa-dollar-sign blue-color"></i></div>
              <div className="detail-text">{article?.prixHt ? `${article.prixHt} €` : 'Prix HT'}</div>
            </div>
            <div className="detail-row">
              <div className="detail-icon"><i className="fas fa-dollar-sign blue-color"></i></div>
              <div className="detail-text">{article?.prixTtc ? `${article.prixTtc} €` : 'Prix TTC'}</div>
            </div>
          </div>
        </div>

        {/*  details categorie*/}
        <div className="stock-section custom-border-right">
          <div className="stock-container">
            <div className="stock-title">
              <h3>Stock actuel</h3>
            </div>
            <div className="stock-value">
              <h3>{article?.stockActuel || 0}</h3>
            </div>
          </div>
        </div>

        {/*  boutons action*/}
        <div className="action-section">
          <div className="action-container">
            <button type="button" className="correction-btn" onClick={openCorrectionModal}>
              <i className="fab fa-stack-overflow blue-color"></i>&nbsp;Correction de stock
            </button>
          </div>
        </div>
      </div>

      {/* Stock Correction Modal - Version corrigée avec Portal */}
      {isModalOpen && (
        <Portal>
          <div className="correction-modal-overlay" onClick={handleBackdropClick}>
            <div className="correction-modal">
              <div className="correction-modal-header">
                <h5 className="correction-modal-title">
                  <i className="fas fa-edit"></i>
                  <span>Correction de stock</span>
                </h5>
                <button 
                  type="button" 
                  className="correction-modal-close" 
                  onClick={closeCorrectionModal}
                  aria-label="Fermer"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="correction-modal-body">
                {/* Messages d'erreur et de succès */}
                {errorMessage && (
                  <div className="correction-alert correction-alert-error">
                    <i className="fas fa-exclamation-triangle"></i>
                    <span>{errorMessage}</span>
                  </div>
                )}
                
                {successMessage && (
                  <div className="correction-alert correction-alert-success">
                    <i className="fas fa-check-circle"></i>
                    <span>{successMessage}</span>
                  </div>
                )}

                <form onSubmit={onSubmitCorrection}>
                  <div className="correction-form-group">
                    <label htmlFor="quantity" className="correction-form-label">
                      <i className="fas fa-calculator"></i>
                      <span>Quantité</span>
                    </label>
                    <input 
                      type="text" 
                      className="correction-form-control" 
                      id="quantity"
                      name="quantity"
                      value={correctionData.quantity}
                      onChange={validateQuantity}
                      placeholder="Entrez la quantité"
                      required 
                      disabled={isLoading}
                    />
                    <small className="correction-form-help">
                      Entrez uniquement des nombres positifs
                    </small>
                  </div>
                  
                  <div className="correction-form-group">
                    <label htmlFor="correctionType" className="correction-form-label">
                      <i className="fas fa-arrow-up-down"></i>
                      <span>Type de correction</span>
                    </label>
                    <select 
                      className="correction-form-control" 
                      id="correctionType"
                      name="type"
                      value={correctionData.type}
                      onChange={handleTypeChange}
                      required
                      disabled={isLoading}
                    >
                      <option value="positive">Correction positive</option>
                      <option value="negative">Correction négative</option>
                    </select>
                    <small className="correction-form-help">
                      <i className="fas fa-info-circle"></i>
                      Positive: ajoute au stock, Négative: retire du stock
                    </small>
                  </div>
                </form>
              </div>
              
              <div className="correction-modal-footer">
                <button 
                  type="button" 
                  className="correction-btn-secondary" 
                  onClick={closeCorrectionModal}
                  disabled={isLoading}
                >
                  <i className="fas fa-times"></i>
                  <span>Annuler</span>
                </button>
                <button 
                  type="button" 
                  className="correction-btn-primary" 
                  onClick={onSubmitCorrection}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i>
                      <span>Enregistrer</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}

