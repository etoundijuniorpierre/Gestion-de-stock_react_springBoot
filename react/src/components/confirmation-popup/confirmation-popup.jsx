import React from 'react';
import './confirmation-popup.css';

const ConfirmationPopup = ({ 
  isOpen, 
  title, 
  message, 
  confirmText = 'Confirmer', 
  cancelText = 'Annuler',
  confirmButtonClass = 'btn-danger',
  onConfirm, 
  onCancel,
  onClose 
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="confirmation-popup-overlay" onClick={handleBackdropClick}>
      <div className="confirmation-popup">
        <div className="confirmation-popup-header">
          <h5 className="confirmation-popup-title">
            <i className="fas fa-exclamation-triangle text-warning me-2"></i>
            {title}
          </h5>
          <button 
            type="button" 
            className="btn-close" 
            onClick={onClose}
            aria-label="Fermer"
          ></button>
        </div>
        
        <div className="confirmation-popup-body">
          <p className="confirmation-popup-message">
            {message}
          </p>
        </div>
        
        <div className="confirmation-popup-footer">
          <button 
            type="button" 
            className={`btn ${confirmButtonClass}`}
            onClick={handleConfirm}
          >
            <i className="fas fa-check me-2"></i>
            {confirmText}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={handleCancel}
          >
            <i className="fas fa-times me-2"></i>
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
