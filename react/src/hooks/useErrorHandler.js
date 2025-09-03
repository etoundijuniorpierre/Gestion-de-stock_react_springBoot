import { useState, useCallback } from 'react';

const useErrorHandler = () => {
  const [error, setError] = useState(null);

  const handleError = useCallback((error) => {
    console.error('Erreur gérée par useErrorHandler:', error);
    
    // Si c'est une erreur d'authentification, la laisser gérer par l'intercepteur
    if (error.message?.includes('Erreur d\'authentification')) {
      console.log('🔐 Erreur d\'authentification détectée, laissée à l\'intercepteur');
      return;
    }
    
    // Pour les autres erreurs, les afficher dans l'interface
    setError(error);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleAsyncOperation = useCallback(async (asyncFunction) => {
    try {
      setError(null);
      return await asyncFunction();
    } catch (error) {
      handleError(error);
      throw error; // Re-lancer l'erreur pour que le composant puisse la gérer si nécessaire
    }
  }, [handleError]);

  return {
    error,
    handleError,
    clearError,
    handleAsyncOperation
  };
};

export default useErrorHandler;
