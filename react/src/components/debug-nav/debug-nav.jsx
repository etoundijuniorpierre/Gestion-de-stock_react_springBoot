import React from 'react';
import { useNavigate } from 'react-router-dom';

const DebugNav = () => {
  const navigate = useNavigate();

  const goToDebugDelete = () => {
    navigate('/dashboard/debug-delete');
  };

  const goToAuthTest = () => {
    navigate('/dashboard/auth-test');
  };

  const goToUtilisateurs = () => {
    navigate('/dashboard/utilisateurs');
  };

  const goToCategories = () => {
    navigate('/dashboard/categories');
  };

  return (
    <div className="card mb-3">
      <div className="card-header">
        <h5 className="mb-0">
          <i className="fas fa-tools"></i>&nbsp;Outils de Debug
        </h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <h6>Tests de Suppression</h6>
            <button 
              className="btn btn-danger btn-sm me-2 mb-2" 
              onClick={goToDebugDelete}
            >
              <i className="fas fa-trash-alt"></i>&nbsp;Debug Suppression
            </button>
            <button 
              className="btn btn-warning btn-sm me-2 mb-2" 
              onClick={goToUtilisateurs}
            >
              <i className="fas fa-users"></i>&nbsp;Liste Utilisateurs
            </button>
            <button 
              className="btn btn-info btn-sm mb-2" 
              onClick={goToCategories}
            >
              <i className="fas fa-tags"></i>&nbsp;Liste Catégories
            </button>
          </div>
          
          <div className="col-md-6">
            <h6>Tests d'Authentification</h6>
            <button 
              className="btn btn-primary btn-sm me-2 mb-2" 
              onClick={goToAuthTest}
            >
              <i className="fas fa-key"></i>&nbsp;Test Auth
            </button>
            <button 
              className="btn btn-secondary btn-sm mb-2" 
              onClick={() => window.location.reload()}
            >
              <i className="fas fa-sync-alt"></i>&nbsp;Recharger
            </button>
          </div>
        </div>
        
        <div className="mt-3">
          <small className="text-muted">
            <strong>Instructions:</strong> Utilisez ces outils pour diagnostiquer les problèmes de suppression et d'authentification.
          </small>
        </div>
      </div>
    </div>
  );
};

export default DebugNav;
