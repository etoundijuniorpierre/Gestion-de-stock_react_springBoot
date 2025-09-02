import React, { useState } from 'react';
import { UserService } from '../../services/user/user.service';
import { CategoryService } from '../../services/category/category.service';

const DebugDelete = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentToken, setCurrentToken] = useState('');
  const userService = new UserService();
  const categoryService = new CategoryService();

  const addTestResult = (test, success, message, data = null, error = null) => {
    setTestResults(prev => [...prev, {
      test,
      success,
      message,
      data,
      error: error ? {
        message: error.message,
        stack: error.stack,
        response: error.response
      } : null,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const checkTokenStatus = () => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const user = localStorage.getItem('user');
    
    setCurrentToken(token ? `${token.substring(0, 20)}...` : 'Aucun token');
    
    addTestResult('Token Status', 'info', `Token: ${token ? 'Présent' : 'Absent'}`, {
      tokenLength: token ? token.length : 0,
      refreshToken: refreshToken ? 'Présent' : 'Absent',
      user: user ? 'Présent' : 'Absent'
    });
  };

  const testUserDelete = async () => {
    setLoading(true);
    setTestResults([]);
    
    // Vérifier le statut du token avant le test
    checkTokenStatus();

    try {
      // Test 1: Récupérer tous les utilisateurs
      addTestResult('Users - findAll', 'pending', 'Test en cours...');
      const users = await userService.findAll();
      addTestResult('Users - findAll', 'success', `Récupéré ${users.length} utilisateur(s)`, users);

      if (users.length > 0) {
        // Test 2: Essayer de supprimer le premier utilisateur
        const firstUser = users[0];
        addTestResult('Users - delete', 'pending', `Tentative de suppression de l'utilisateur ${firstUser.id}...`);
        
        try {
          const result = await userService.delete(firstUser.id);
          addTestResult('Users - delete', 'success', `Utilisateur ${firstUser.id} supprimé avec succès`, result);
        } catch (deleteError) {
          addTestResult('Users - delete', 'error', `Erreur lors de la suppression: ${deleteError.message}`, null, deleteError);
          
          // Vérifier le statut du token après l'erreur
          setTimeout(() => {
            checkTokenStatus();
          }, 100);
        }
      } else {
        addTestResult('Users - delete', 'warning', 'Aucun utilisateur à supprimer');
      }

    } catch (error) {
      addTestResult('Users', 'error', error.message, null, error);
      
      // Vérifier le statut du token après l'erreur
      setTimeout(() => {
        checkTokenStatus();
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  const testCategoryDelete = async () => {
    setLoading(true);
    setTestResults([]);
    
    // Vérifier le statut du token avant le test
    checkTokenStatus();

    try {
      // Test 1: Récupérer toutes les catégories
      addTestResult('Categories - findAll', 'pending', 'Test en cours...');
      const categories = await categoryService.findAll();
      addTestResult('Categories - findAll', 'success', `Récupéré ${categories.length} catégorie(s)`, categories);

      if (categories.length > 0) {
        // Test 2: Essayer de supprimer la première catégorie
        const firstCategory = categories[0];
        addTestResult('Categories - delete', 'pending', `Tentative de suppression de la catégorie ${firstCategory.id}...`);
        
        try {
          const result = await categoryService.delete(firstCategory.id);
          addTestResult('Categories - delete', 'success', `Catégorie ${firstCategory.id} supprimée avec succès`, result);
        } catch (deleteError) {
          addTestResult('Categories - delete', 'error', `Erreur lors de la suppression: ${deleteError.message}`, null, deleteError);
          
          // Vérifier le statut du token après l'erreur
          setTimeout(() => {
            checkTokenStatus();
          }, 100);
        }
      } else {
        addTestResult('Categories - delete', 'warning', 'Aucune catégorie à supprimer');
      }

    } catch (error) {
      addTestResult('Categories', 'error', error.message, null, error);
      
      // Vérifier le statut du token après l'erreur
      setTimeout(() => {
        checkTokenStatus();
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  const testDirectHTTP = async () => {
    setLoading(true);
    addTestResult('Direct HTTP Test', 'pending', 'Test direct de l\'API...');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/gestionDeStock/utilisateurs/all', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      addTestResult('Direct HTTP Test', 'success', `Status: ${response.status}`, {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (response.ok) {
        const data = await response.json();
        addTestResult('Direct HTTP Data', 'success', `Données reçues: ${data.length} utilisateurs`, data);
      }
      
    } catch (error) {
      addTestResult('Direct HTTP Test', 'error', error.message, null, error);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const refreshToken = () => {
    checkTokenStatus();
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-12">
          <h3>Debug - Test de Suppression et Authentification</h3>
          <p className="text-muted">Testez la suppression et diagnostiquez les problèmes d'authentification</p>
          
          <div className="card mb-3">
            <div className="card-body">
              <h5>Statut du Token</h5>
              <p><strong>Token actuel:</strong> {currentToken}</p>
              <button className="btn btn-info btn-sm" onClick={refreshToken}>
                <i className="fas fa-sync-alt"></i>&nbsp;Actualiser
              </button>
            </div>
          </div>
          
          <div className="mb-3">
            <button 
              className="btn btn-danger me-2" 
              onClick={testUserDelete}
              disabled={loading}
            >
              {loading ? 'Test en cours...' : 'Tester Suppression Utilisateur'}
            </button>
            
            <button 
              className="btn btn-warning me-2" 
              onClick={testCategoryDelete}
              disabled={loading}
            >
              {loading ? 'Test en cours...' : 'Tester Suppression Catégorie'}
            </button>
            
            <button 
              className="btn btn-primary me-2" 
              onClick={testDirectHTTP}
              disabled={loading}
            >
              {loading ? 'Test en cours...' : 'Test Direct HTTP'}
            </button>
            
            <button 
              className="btn btn-secondary" 
              onClick={clearResults}
              disabled={loading}
            >
              Effacer les résultats
            </button>
          </div>

          {testResults.length > 0 && (
            <div className="results-container">
              <h4>Résultats des tests</h4>
              {testResults.map((result, index) => (
                <div 
                  key={index} 
                  className={`alert alert-${result.success === 'success' ? 'success' : result.success === 'error' ? 'danger' : result.success === 'warning' ? 'warning' : 'info'} mb-2`}
                >
                  <strong>{result.test}</strong> - {result.message}
                  {result.timestamp && <small className="float-end">{result.timestamp}</small>}
                  
                  {result.data && (
                    <details className="mt-2">
                      <summary>Données</summary>
                      <pre className="mt-2">{JSON.stringify(result.data, null, 2)}</pre>
                    </details>
                  )}
                  
                  {result.error && (
                    <details className="mt-2">
                      <summary>Erreur détaillée</summary>
                      <div className="mt-2">
                        <p><strong>Message:</strong> {result.error.message}</p>
                        {result.error.response && (
                          <p><strong>Response:</strong> {JSON.stringify(result.error.response, null, 2)}</p>
                        )}
                        {result.error.stack && (
                          <details>
                            <summary>Stack trace</summary>
                            <pre className="mt-2">{result.error.stack}</pre>
                          </details>
                        )}
                      </div>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebugDelete;
