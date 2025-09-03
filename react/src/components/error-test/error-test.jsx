import React from 'react';
import useErrorHandler from '../../hooks/useErrorHandler';
import ErrorHandler from '../error-handler/error-handler';
import './error-test.scss';

const ErrorTest = () => {
  const { error, handleError, clearError } = useErrorHandler();

  const testBusinessError = () => {
    handleError(new Error('Erreur métier: Validation échouée - Le champ nom est requis'));
  };

  const testServerError = () => {
    handleError(new Error('Erreur serveur: Impossible de se connecter à la base de données'));
  };

  const testAuthError = () => {
    handleError(new Error('Erreur d\'authentification: Token expiré'));
  };

  const testGenericError = () => {
    handleError(new Error('Une erreur inattendue est survenue'));
  };

  return (
    <div className="error-test">
      <h3>Test du système de gestion d'erreur</h3>
      
      <div className="error-test__buttons">
        <button 
          className="btn btn-warning" 
          onClick={testBusinessError}
        >
          Tester erreur métier
        </button>
        
        <button 
          className="btn btn-danger" 
          onClick={testServerError}
        >
          Tester erreur serveur
        </button>
        
        <button 
          className="btn btn-secondary" 
          onClick={testAuthError}
        >
          Tester erreur auth
        </button>
        
        <button 
          className="btn btn-info" 
          onClick={testGenericError}
        >
          Tester erreur générique
        </button>
      </div>

      <div className="error-test__info">
        <p><strong>Instructions :</strong></p>
        <ul>
          <li><strong>Erreur métier :</strong> Affiche un warning orange (pas de redirection)</li>
          <li><strong>Erreur serveur :</strong> Affiche un warning orange (pas de redirection)</li>
          <li><strong>Erreur auth :</strong> Affiche une erreur rouge (gérée par l'intercepteur)</li>
          <li><strong>Erreur générique :</strong> Affiche une erreur rouge (pas de redirection)</li>
        </ul>
      </div>

      <ErrorHandler 
        error={error} 
        onClose={clearError}
        autoClose={true}
        autoCloseDelay={8000}
      />
    </div>
  );
};

export default ErrorTest;
