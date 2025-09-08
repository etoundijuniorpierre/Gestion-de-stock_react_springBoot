import React, { useEffect } from 'react';
import './error-handler.css';

const ErrorHandler = ({ 
  error, 
  success,
  onClose, 
  onSuccessClose,
  autoClose = false, 
  autoCloseDelay = 5000,
  showCloseButton = true 
}) => {
  useEffect(() => {
    if (autoClose && (error || success)) {
      const timer = setTimeout(() => {
        if (error) {
          onClose();
        }
        if (success) {
          onSuccessClose();
        }
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [error, success, autoClose, autoCloseDelay, onClose, onSuccessClose]);

  if (!error && !success) {
    return null;
  }

  return (
    <div className="error-handler-container">
      {error && (
        <div className={`alert alert-${error.type || 'danger'} alert-dismissible fade show`} role="alert">
          <div className="alert-content">
            <i className="fas fa-exclamation-triangle me-2"></i>
            <span className="error-message">{error.message}</span>
          </div>
          {showCloseButton && (
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              aria-label="Close"
            ></button>
          )}
        </div>
      )}
      
      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <div className="alert-content">
            <i className="fas fa-check-circle me-2"></i>
            <span className="success-message">{success}</span>
          </div>
          {showCloseButton && (
            <button 
              type="button" 
              className="btn-close" 
              onClick={onSuccessClose}
              aria-label="Close"
            ></button>
          )}
        </div>
      )}
    </div>
  );
};

export default ErrorHandler;
