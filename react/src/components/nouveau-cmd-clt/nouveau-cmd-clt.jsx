import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useErrorHandler from '../../hooks/useErrorHandler';
import ErrorHandler from '../error-handler/error-handler';
import './nouveau-cmd-clt.scss';

const NouveauCmdClt = () => {
  const { id } = useParams(); // Pour l'édition
  const navigate = useNavigate();
  const { error, handleError, clearError, handleAsyncOperation } = useErrorHandler();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    codeCommande: '',
    dateCommande: '',
    client: null,
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
      navigate('/dashboard/commandes-clients');
      
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/commandes-clients');
  };

  if (isLoading) {
    return (
      <div className="nouveau-cmd-clt">
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p>Chargement en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="nouveau-cmd-clt">
      <div className="nouveau-cmd-clt__header">
        <h2>
          <i className="fas fa-shopping-cart"></i>
          {isEditing ? 'Modifier la Commande Client' : 'Nouvelle Commande Client'}
        </h2>
        <div className="nouveau-cmd-clt__actions">
          <button 
            className="btn btn-secondary" 
            onClick={handleCancel}
            disabled={isLoading}
          >
            <i className="fas fa-times"></i> Annuler
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            <i className="fas fa-save"></i> 
            {isEditing ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </div>

      <ErrorHandler 
        error={error} 
        onClose={clearError}
        autoClose={true}
        autoCloseDelay={5000}
      />

      <div className="nouveau-cmd-clt__content">
        <form onSubmit={handleSubmit} className="nouveau-cmd-clt__form">
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="codeCommande">Code Commande</label>
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
            
            <div className="form-group col-md-6">
              <label htmlFor="dateCommande">Date Commande</label>
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

          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="client">Client</label>
              <select
                id="client"
                name="client"
                className="form-control"
                value={formData.client?.id || ''}
                onChange={handleInputChange}
                required
              >
                <option value="">Sélectionner un client</option>
                {/* TODO: Charger la liste des clients */}
                <option value="1">Client 1</option>
                <option value="2">Client 2</option>
              </select>
            </div>
            
            <div className="form-group col-md-6">
              <label htmlFor="statut">Statut</label>
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

          <div className="form-group">
            <label>Articles</label>
            <div className="articles-list">
              <p className="text-muted">
                <i className="fas fa-info-circle"></i>
                La gestion des articles sera implémentée dans une prochaine étape
              </p>
            </div>
          </div>

          <div className="form-row totals">
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
        </form>
      </div>
    </div>
  );
};

export default NouveauCmdClt;
