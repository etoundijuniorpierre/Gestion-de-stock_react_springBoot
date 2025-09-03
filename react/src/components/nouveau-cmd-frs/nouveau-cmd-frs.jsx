import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useErrorHandler from '../../hooks/useErrorHandler';
import ErrorHandler from '../error-handler/error-handler';
import './nouveau-cmd-frs.scss';

const NouveauCmdFrs = () => {
  const { id } = useParams(); // Pour l'édition
  const navigate = useNavigate();
  const { error, handleError, clearError, handleAsyncOperation } = useErrorHandler();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    codeCommande: '',
    dateCommande: '',
    fournisseur: null,
    articles: [],
    totalHt: 0,
    totalTtc: 0,
    statut: 'EN_COURS'
  });

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      loadCommande(id);
    }
  }, [id]);

  const loadCommande = async (commandeId) => {
    try {
      setIsLoading(true);
      // TODO: Implémenter le chargement de la commande existante
      console.log('Chargement de la commande:', commandeId);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      if (isEditing) {
        // TODO: Implémenter la mise à jour
        console.log('Mise à jour de la commande:', formData);
      } else {
        // TODO: Implémenter la création
        console.log('Création de la commande:', formData);
      }
      
      // Redirection après succès
      navigate('/dashboard/commandes-fournisseurs');
      
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/commandes-fournisseurs');
  };

  if (isLoading) {
    return (
      <div className="nouvelle-commande-fournisseur-form">
        <div className="form-content d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="ms-3">Chargement en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="nouvelle-commande-fournisseur-form">
      {/* En-tête du formulaire */}
      <div className="form-header">
        <h2>
          <i className="fas fa-shopping-cart"></i>
          {isEditing ? 'Modifier la Commande Fournisseur' : 'Nouvelle Commande Fournisseur'}
        </h2>
      </div>
      
      {/* Contenu du formulaire */}
      <div className="form-content">
        <ErrorHandler 
          error={error} 
          onClose={clearError}
          autoClose={true}
          autoCloseDelay={5000}
        />
        
        <form onSubmit={handleSubmit}>
          {/* Section Informations de base */}
          <div className="form-section">
            <h5 className="section-title">Informations de la commande</h5>
            
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label" htmlFor="codeCommande">Code Commande</label>
                  <input
                    type="text"
                    id="codeCommande"
                    name="codeCommande"
                    className="form-control"
                    value={formData.codeCommande}
                    onChange={handleInputChange}
                    required
                    placeholder="Code de la commande"
                  />
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label" htmlFor="dateCommande">Date Commande</label>
                  <input
                    type="date"
                    id="dateCommande"
                    name="dateCommande"
                    className="form-control"
                    value={formData.dateCommande}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label" htmlFor="fournisseur">Fournisseur</label>
                  <select
                    id="fournisseur"
                    name="fournisseur"
                    className="form-control"
                    value={formData.fournisseur?.id || ''}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Sélectionner un fournisseur</option>
                    {/* TODO: Charger la liste des fournisseurs */}
                    <option value="1">Fournisseur 1</option>
                    <option value="2">Fournisseur 2</option>
                  </select>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label" htmlFor="statut">Statut</label>
                  <select
                    id="statut"
                    name="statut"
                    className="form-control"
                    value={formData.statut}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="EN_COURS">En cours</option>
                    <option value="VALIDEE">Validée</option>
                    <option value="LIVREE">Livrée</option>
                    <option value="ANNULEE">Annulée</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section Articles */}
          <div className="form-section">
            <h5 className="section-title">Articles</h5>
            <div className="articles-section">
              <div className="articles-info">
                <i className="fas fa-info-circle"></i>
                La gestion des articles sera implémentée dans une prochaine étape
              </div>
            </div>
          </div>

          {/* Section Totaux */}
          <div className="form-section">
            <h5 className="section-title">Totaux</h5>
            <div className="totals-section">
              <div className="row">
                <div className="col-md-6">
                  <div className="total-item">
                    <span className="total-label">Total HT:</span>
                    <span className="total-value">{formData.totalHt.toFixed(2)} €</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="total-item">
                    <span className="total-label">Total TTC:</span>
                    <span className="total-value">{formData.totalTtc.toFixed(2)} €</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      {/* Actions du formulaire */}
      <div className="form-actions">
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={handleCancel}
          disabled={isLoading}
        >
          <i className="fas fa-times"></i>
          Annuler
        </button>
        <button 
          type="submit" 
          className="btn btn-primary" 
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border" role="status" aria-hidden="true"></span>
              {isEditing ? 'Mise à jour...' : 'Création...'}
            </>
          ) : (
            <>
              <i className="fas fa-save"></i>
              {isEditing ? 'Mettre à jour' : 'Créer'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default NouveauCmdFrs;
