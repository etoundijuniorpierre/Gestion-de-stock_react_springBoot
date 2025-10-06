import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthService } from '../../services/auth.service';

const AuthGuard = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const authService = new AuthService();

  useEffect(() => {
    const checkAuth = () => {
      // Use the AuthService method which properly checks localStorage
      const authenticated = authService.isLoggedIn();
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    };

    checkAuth();
    
    // Add event listener to handle storage changes (like logout from other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        const authenticated = authService.isLoggedIn();
        setIsAuthenticated(authenticated);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Rediriger vers la page de connexion avec l'URL de retour
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Vérifier si l'utilisateur doit changer son mot de passe
  const mustChangePassword = localStorage.getItem('mustChangePassword');
  const isChangingPassword = location.pathname === '/dashboard/changer-mot-passe';
  
  // Si l'utilisateur doit changer son mot de passe mais n'est pas sur la page de changement
  if (mustChangePassword === 'true' && !isChangingPassword) {
    return <Navigate to="/dashboard/changer-mot-passe" replace />;
  }

  return children;
};

export default AuthGuard;