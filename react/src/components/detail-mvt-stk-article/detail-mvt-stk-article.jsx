import React, { useState, useEffect } from 'react';
import './detail-mvt-stk-article.scss';

export default function DetailMvtStkArticle({ onToggleCollapse, isExpanded }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [correctionData, setCorrectionData] = useState({
    quantity: '',
    type: 'positive'
  });

  // Empêcher le scroll du body quand le modal est ouvert
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
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

  const onSubmitCorrection = (e) => {
    e.preventDefault();
    
    // Validation
    if (!correctionData.quantity || parseFloat(correctionData.quantity) <= 0) {
      alert('Veuillez entrer une quantité valide');
      return;
    }

    console.log('onSubmitCorrection', correctionData);
    
    // Ici vous pouvez ajouter la logique pour sauvegarder la correction
    // Par exemple, appeler une API ou dispatcher une action Redux
    
    closeCorrectionModal();
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
              <div className="detail-icon"><i className="fas fa-info-circle blue-color"></i></div>
              <div className="detail-text">Code article</div>
            </div>
            <div className="detail-row">
              <div className="detail-icon"><i className="fas fa-info-circle blue-color"></i></div>
              <div className="detail-text">designation</div>
            </div>
            <div className="detail-row">
              <div className="detail-icon"><i className="fas fa-dollar-sign blue-color"></i></div>
              <div className="detail-text">prix HT</div>
            </div>
            <div className="detail-row">
              <div className="detail-icon"><i className="fas fa-dollar-sign blue-color"></i></div>
              <div className="detail-text">prix TTC</div>
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
              <h3>139</h3>
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

      {/* Stock Correction Modal - Version corrigée */}
      {isModalOpen && (
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
              >
                <i className="fas fa-times"></i>
                <span>Annuler</span>
              </button>
              <button 
                type="button" 
                className="correction-btn-primary" 
                onClick={onSubmitCorrection}
              >
                <i className="fas fa-save"></i>
                <span>Enregistrer</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

