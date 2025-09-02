import React, { useState, useEffect } from 'react';

const AuthTest = () => {
  const [authStatus, setAuthStatus] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const user = localStorage.getItem('user');
    
    setAuthStatus({
      token: token ? {
        present: true,
        length: token.length,
        preview: `${token.substring(0, 20)}...`,
        isValid: token.length > 50 // Token JWT typique
      } : { present: false },
      refreshToken: refreshToken ? {
        present: true,
        length: refreshToken.length
      } : { present: false },
      user: user ? {
        present: true,
        data: JSON.parse(user)
      } : { present: false }
    });
  };

  const testTokenValidity = async () => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setAuthStatus(prev => ({
          ...prev,
          tokenTest: { error: 'Aucun token trouvé' }
        }));
        return;
      }

      // Test 1: Vérifier si le token est valide en appelant l'API
      const response = await fetch('http://localhost:8080/api/gestionDeStock/utilisateurs/all', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAuthStatus(prev => ({
          ...prev,
          tokenTest: { 
            success: true, 
            message: 'Token valide', 
            userCount: data.length 
          }
        }));
      } else if (response.status === 401) {
        setAuthStatus(prev => ({
          ...prev,
          tokenTest: { 
            error: 'Token invalide ou expiré (401)', 
            status: response.status 
          }
        }));
      } else if (response.status === 403) {
        setAuthStatus(prev => ({
          ...prev,
          tokenTest: { 
            error: 'Accès refusé (403)', 
            status: response.status 
          }
        }));
      } else {
        setAuthStatus(prev => ({
          ...prev,
          tokenTest: { 
            error: `Erreur HTTP: ${response.status}`, 
            status: response.status 
          }
        }));
      }

    } catch (error) {
      setAuthStatus(prev => ({
        ...prev,
        tokenTest: { 
          error: error.message, 
          type: 'Network Error' 
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  const clearTokens = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    checkAuthStatus();
  };

  const simulateExpiredToken = () => {
    // Simuler un token expiré en le modifiant
    const token = localStorage.getItem('token');
    if (token) {
      const modifiedToken = token + '_EXPIRED';
      localStorage.setItem('token', modifiedToken);
      checkAuthStatus();
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-12">
          <h3>Test d'Authentification</h3>
          <p className="text-muted">Vérifiez l'état de votre authentification</p>
          
          <div className="row">
            <div className="col-md-4">
              <div className="card">
                <div className="card-header">
                  <h5>Token d'Authentification</h5>
                </div>
                <div className="card-body">
                  {authStatus.token?.present ? (
                    <div>
                      <p className="text-success">
                        <i className="fas fa-check-circle"></i> Token présent
                      </p>
                      <p><strong>Longueur:</strong> {authStatus.token.length}</p>
                      <p><strong>Aperçu:</strong> {authStatus.token.preview}</p>
                      <p><strong>Format valide:</strong> {authStatus.token.isValid ? 'Oui' : 'Non'}</p>
                    </div>
                  ) : (
                    <p className="text-danger">
                      <i className="fas fa-times-circle"></i> Aucun token
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card">
                <div className="card-header">
                  <h5>Token de Rafraîchissement</h5>
                </div>
                <div className="card-body">
                  {authStatus.refreshToken?.present ? (
                    <div>
                      <p className="text-success">
                        <i className="fas fa-check-circle"></i> Refresh token présent
                      </p>
                      <p><strong>Longueur:</strong> {authStatus.refreshToken.length}</p>
                    </div>
                  ) : (
                    <p className="text-danger">
                      <i className="fas fa-times-circle"></i> Aucun refresh token
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card">
                <div className="card-header">
                  <h5>Utilisateur Connecté</h5>
                </div>
                <div className="card-body">
                  {authStatus.user?.present ? (
                    <div>
                      <p className="text-success">
                        <i className="fas fa-check-circle"></i> Utilisateur connecté
                      </p>
                      <p><strong>Email:</strong> {authStatus.user.data.email}</p>
                      {authStatus.user.data.nom && (
                        <p><strong>Nom:</strong> {authStatus.user.data.nom}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-danger">
                      <i className="fas fa-times-circle"></i> Aucun utilisateur
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-header">
              <h5>Test de Validité du Token</h5>
            </div>
            <div className="card-body">
              {authStatus.tokenTest && (
                <div className={`alert alert-${authStatus.tokenTest.success ? 'success' : 'danger'}`}>
                  {authStatus.tokenTest.success ? (
                    <div>
                      <i className="fas fa-check-circle"></i> {authStatus.tokenTest.message}
                      {authStatus.tokenTest.userCount && (
                        <p className="mb-0">Nombre d'utilisateurs récupérés: {authStatus.tokenTest.userCount}</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <i className="fas fa-exclamation-triangle"></i> {authStatus.tokenTest.error}
                      {authStatus.tokenTest.status && (
                        <p className="mb-0">Status HTTP: {authStatus.tokenTest.status}</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="btn-group">
                <button 
                  className="btn btn-primary" 
                  onClick={testTokenValidity}
                  disabled={loading}
                >
                  {loading ? 'Test en cours...' : 'Tester la validité du token'}
                </button>
                
                <button 
                  className="btn btn-warning" 
                  onClick={simulateExpiredToken}
                  disabled={!authStatus.token?.present}
                >
                  Simuler token expiré
                </button>
                
                <button 
                  className="btn btn-danger" 
                  onClick={clearTokens}
                >
                  Effacer tous les tokens
                </button>
                
                <button 
                  className="btn btn-info" 
                  onClick={checkAuthStatus}
                >
                  Actualiser
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <h5>Actions recommandées:</h5>
            <ul>
              <li><strong>Si le token est invalide:</strong> Reconnectez-vous</li>
              <li><strong>Si vous recevez 403:</strong> Vérifiez vos permissions</li>
              <li><strong>Si vous recevez 401:</strong> Le token a expiré</li>
              <li><strong>Si vous êtes déconnecté automatiquement:</strong> L'intercepteur HTTP a détecté une erreur d'auth</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTest;
