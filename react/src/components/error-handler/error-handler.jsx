import React, { useState, useEffect } from 'react';
import './error-handler.scss';

const ErrorHandler = ({ error, onClose, autoClose = true, autoCloseDelay = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose && error) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [error, autoClose, autoCloseDelay, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!error || !isVisible) {
    return null;
  }

  // Déterminer le type d'erreur et l'icône appropriée
  const getErrorType = () => {
    if (error.message?.includes('Erreur métier') || error.message?.includes('Erreur serveur')) {
      return { type: 'warning', icon: 'fas fa-exclamation-triangle' };
    }
    if (error.message?.includes('Erreur d\'authentification')) {
      return { type: 'error', icon: 'fas fa-lock' };
    }
    return { type: 'error', icon: 'fas fa-exclamation-circle' };
  };

  const { type, icon } = getErrorType();

  return (
    <div className={`error-handler error-handler--${type}`}>
      <div className="error-handler__content">
        <div className="error-handler__icon">
          <i className={icon}></i>
        </div>
        <div className="error-handler__message">
          <h4 className="error-handler__title">
            {type === 'warning' ? 'Attention' : 'Erreur'}
          </h4>
          <p className="error-handler__text">
            {error.message || 'Une erreur est survenue'}
          </p>
        </div>
        <button 
          className="error-handler__close" 
          onClick={handleClose}
          aria-label="Fermer"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  );
};

export default ErrorHandler;
