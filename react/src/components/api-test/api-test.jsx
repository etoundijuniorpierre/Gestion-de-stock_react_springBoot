import React, { useState } from 'react';
import { CategoryService } from '../../services/category/category.service';
import { UserService } from '../../services/user/user.service';

const ApiTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const categoryService = new CategoryService();
  const userService = new UserService();

  const addTestResult = (test, success, message, data = null) => {
    setTestResults(prev => [...prev, {
      test,
      success,
      message,
      data,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testCategories = async () => {
    setLoading(true);
    setTestResults([]);

    try {
      // Test 1: Récupérer toutes les catégories
      addTestResult('Categories - findAll', 'pending', 'Test en cours...');
      const categories = await categoryService.findAll();
      addTestResult('Categories - findAll', 'success', `Récupéré ${categories.length} catégorie(s)`, categories);

      // Test 2: Créer une nouvelle catégorie
      addTestResult('Categories - create', 'pending', 'Test en cours...');
      const newCategory = {
        code: `TEST_${Date.now()}`,
        designation: 'Catégorie de test'
      };
      const createdCategory = await categoryService.save(newCategory);
      addTestResult('Categories - create', 'success', 'Catégorie créée avec succès', createdCategory);

      // Test 3: Récupérer la catégorie par ID
      addTestResult('Categories - findById', 'pending', 'Test en cours...');
      const foundCategory = await categoryService.findById(createdCategory.id);
      addTestResult('Categories - findById', 'success', 'Catégorie trouvée par ID', foundCategory);

      // Test 4: Supprimer la catégorie de test
      addTestResult('Categories - delete', 'pending', 'Test en cours...');
      await categoryService.delete(createdCategory.id);
      addTestResult('Categories - delete', 'success', 'Catégorie supprimée avec succès');

    } catch (error) {
      addTestResult('Categories', 'error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const testUsers = async () => {
    setLoading(true);
    setTestResults([]);

    try {
      // Test 1: Récupérer tous les utilisateurs
      addTestResult('Users - findAll', 'pending', 'Test en cours...');
      const users = await userService.findAll();
      addTestResult('Users - findAll', 'success', `Récupéré ${users.length} utilisateur(s)`, users);

      // Test 2: Créer un nouvel utilisateur
      addTestResult('Users - create', 'pending', 'Test en cours...');
      const newUser = {
        nom: 'Test',
        prenom: 'User',
        email: `test.user.${Date.now()}@example.com`,
        motDePasse: 'password123',
        adresse: {
          adresse1: '123 Rue Test',
          ville: 'Ville Test',
          codePostale: '12345',
          pays: 'Pays Test'
        }
      };
      const createdUser = await userService.save(newUser);
      addTestResult('Users - create', 'success', 'Utilisateur créé avec succès', createdUser);

      // Test 3: Récupérer l'utilisateur par ID
      addTestResult('Users - findById', 'pending', 'Test en cours...');
      const foundUser = await userService.findById(createdUser.id);
      addTestResult('Users - findById', 'success', 'Utilisateur trouvé par ID', foundUser);

      // Test 4: Supprimer l'utilisateur de test
      addTestResult('Users - delete', 'pending', 'Test en cours...');
      await userService.delete(createdUser.id);
      addTestResult('Users - delete', 'success', 'Utilisateur supprimé avec succès');

    } catch (error) {
      addTestResult('Users', 'error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-12">
          <h2>Test des API CRUD</h2>
          <p className="text-muted">Composant de test pour vérifier le fonctionnement des API</p>
          
          <div className="mb-3">
            <button 
              className="btn btn-primary me-2" 
              onClick={testCategories}
              disabled={loading}
            >
              {loading ? 'Test en cours...' : 'Tester Categories API'}
            </button>
            
            <button 
              className="btn btn-success me-2" 
              onClick={testUsers}
              disabled={loading}
            >
              {loading ? 'Test en cours...' : 'Tester Users API'}
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
                  className={`alert alert-${result.success === 'success' ? 'success' : result.success === 'error' ? 'danger' : 'warning'} mb-2`}
                >
                  <strong>{result.test}</strong> - {result.message}
                  {result.timestamp && <small className="float-end">{result.timestamp}</small>}
                  {result.data && (
                    <details className="mt-2">
                      <summary>Données</summary>
                      <pre className="mt-2">{JSON.stringify(result.data, null, 2)}</pre>
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

export default ApiTest;
