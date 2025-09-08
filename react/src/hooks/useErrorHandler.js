import { useState, useCallback } from 'react';

const useErrorHandler = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleError = useCallback((error) => {
    console.error('Erreur gérée par useErrorHandler:', error);
    
    // Si c'est une erreur d'authentification, la laisser gérer par l'intercepteur
    if (error.message?.includes('Erreur d\'authentification')) {
      console.log('🔐 Erreur d\'authentification détectée, laissée à l\'intercepteur');
      return;
    }
    
    // Pour les autres erreurs, les afficher dans l'interface
    setError(error);
    setSuccess(null); // Effacer le message de succès s'il y en a un
  }, []);

  const handleSuccess = useCallback((message) => {
    console.log('Succès géré par useErrorHandler:', message);
    setSuccess(message);
    setError(null); // Effacer l'erreur s'il y en a une
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearSuccess = useCallback(() => {
    setSuccess(null);
  }, []);

  const handleAsyncOperation = useCallback(async (asyncFunction) => {
    try {
      setError(null);
      setSuccess(null);
      return await asyncFunction();
    } catch (error) {
      handleError(error);
      throw error; // Re-lancer l'erreur pour que le composant puisse la gérer si nécessaire
    }
  }, [handleError]);

  return {
    error,
    success,
    handleError,
    handleSuccess,
    clearError,
    clearSuccess,
    handleAsyncOperation
  };
};

export default useErrorHandler;
