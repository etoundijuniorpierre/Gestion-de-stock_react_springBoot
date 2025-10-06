import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useErrorHandler from '../../hooks/useErrorHandler';
import ErrorHandler from '../error-handler/error-handler';
import { CmdcltfrsService } from '../../services/cmdcltfrs.service';
import { CltfrsService } from '../../services/cltfrs/cltfrs.service';
import { ArticleService } from '../../services/article/article.service';
import './nouveau-cmd-clt.scss';

const NouveauCmdClt = () => {
  const { id } = useParams(); // Pour l'édition
  const navigate = useNavigate();
  const { error, handleError, clearError, handleAsyncOperation } = useErrorHandler();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [clients, setClients] = useState([]);
  const [articles, setArticles] = useState([]);
  const [formData, setFormData] = useState({
    codeCommande: '',
    dateCommande: new Date().toISOString().split('T')[0],
    clientId: '',
    articles: [],
    totalHt: 0,
    totalTtc: 0,
    statut: 'EN_PREPARATION'
  });

  const cmdCltFrsService = new CmdcltfrsService();
  const cltFrsService = new CltfrsService();
  const articleService = new ArticleService();

  useEffect(() => {
    loadClients();
    loadArticles();
    
    if (id) {
      setIsEditing(true);
      loadCommande(id);
    }
  }, [id]);

  const loadClients = async () => {
    try {
      const clientsData = await cltFrsService.findAllClients();
      setClients(clientsData || []);
    } catch (error) {
      handleError(error);
    }
  };

  const loadArticles = async () => {
    try {
      const articlesData = await articleService.findAll();
      setArticles(articlesData || []);
    } catch (error) {
      handleError(error);
    }
  };

  const loadCommande = async (commandeId) => {
    try {
      setIsLoading(true);
      const commande = await cmdCltFrsService.findByIdCommandeClient(commandeId);
      
      if (commande) {
        // Map ligneCommandeClients to the format expected by the form
        const mappedArticles = (commande.ligneCommandeClients || []).map(ligne => ({
          articleId: ligne.article?.id || '',
          quantite: ligne.quantite || 0,
          prixUnitaire: ligne.prixUnitaire || 0
        }));
        
        setFormData({
          codeCommande: commande.code || '',
          dateCommande: commande.dateCommande ? new Date(commande.dateCommande).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          clientId: commande.client?.id || '',
          articles: mappedArticles,
          totalHt: commande.totalPrixHt || 0,
          totalTtc: commande.totalPrixTtc || 0,
          statut: commande.etatCommande || 'EN_PREPARATION'
        });
      }
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

  const handleArticleChange = (index, field, value) => {
    const updatedArticles = [...formData.articles];
    updatedArticles[index] = { ...updatedArticles[index], [field]: value };
    
    // Recalculate totals when quantity or price changes
    if (field === 'quantite' || field === 'prixUnitaire') {
      const totalHt = updatedArticles.reduce((sum, article) => {
        return sum + (article.quantite || 0) * (article.prixUnitaire || 0);
      }, 0);
      
      // Assuming 20% VAT for TTC calculation
      const totalTtc = totalHt * 1.2;
      
      setFormData(prev => ({
        ...prev,
        articles: updatedArticles,
        totalHt: parseFloat(totalHt.toFixed(2)),
        totalTtc: parseFloat(totalTtc.toFixed(2))
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        articles: updatedArticles
      }));
    }
  };

  const addArticle = () => {
    setFormData(prev => ({
      ...prev,
      articles: [...prev.articles, { articleId: '', quantite: 1, prixUnitaire: 0 }]
    }));
  };

  const removeArticle = (index) => {
    const updatedArticles = [...formData.articles];
    updatedArticles.splice(index, 1);
    
    // Recalculate totals
    const totalHt = updatedArticles.reduce((sum, article) => {
      return sum + (article.quantite || 0) * (article.prixUnitaire || 0);
    }, 0);
    
    // Assuming 20% VAT for TTC calculation
    const totalTtc = totalHt * 1.2;
    
    setFormData(prev => ({
      ...prev,
      articles: updatedArticles,
      totalHt: parseFloat(totalHt.toFixed(2)),
      totalTtc: parseFloat(totalTtc.toFixed(2))
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.codeCommande || !formData.dateCommande || !formData.clientId) {
      handleError(new Error('Veuillez remplir tous les champs obligatoires'));
      return;
    }
    
    if (formData.articles.length === 0) {
      handleError(new Error('Veuillez ajouter au moins un article'));
      return;
    }
    
    // Check if all articles have valid data
    for (let i = 0; i < formData.articles.length; i++) {
      const article = formData.articles[i];
      if (!article.articleId || article.quantite <= 0 || article.prixUnitaire <= 0) {
        handleError(new Error(`Veuillez remplir correctement les informations de l'article ${i + 1}`));
        return;
      }
    }
    
    try {
      setIsLoading(true);
      
      // Prepare data for submission
      const commandeData = {
        code: formData.codeCommande,
        dateCommande: formData.dateCommande,
        clientId: parseInt(formData.clientId),
        etatCommande: formData.statut,
        idEntreprise: 1, // Add enterprise ID at root level
        ligneCommandeClients: formData.articles.map(article => ({
          idArticle: parseInt(article.articleId), // Use idArticle instead of articleId
          quantite: article.quantite,
          prixUnitaire: article.prixUnitaire,
          idEntreprise: 1 // Add enterprise ID in each line item
        }))
      };
      
      if (isEditing) {
        // For editing, we need to include the ID
        commandeData.id = parseInt(id);
        await cmdCltFrsService.updateCommandeClient(id, commandeData);
      } else {
        await cmdCltFrsService.saveCommandeClient(commandeData);
      }
      
      // Success message and redirection
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

  // Get article by ID for display
  const getArticleById = (id) => {
    return articles.find(article => article.id === parseInt(id)) || {};
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
              <label htmlFor="codeCommande">Code Commande *</label>
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
              <label htmlFor="dateCommande">Date Commande *</label>
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
              <label htmlFor="clientId">Client *</label>
              <select
                id="clientId"
                name="clientId"
                className="form-control"
                value={formData.clientId}
                onChange={handleInputChange}
                required
              >
                <option value="">Sélectionner un client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.nom} {client.prenom}
                  </option>
                ))}
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
                <option value="EN_PREPARATION">En préparation</option>
                <option value="VALIDEE">Validée</option>
                <option value="LIVREE_EN_COURS">Livraison en cours</option>
                <option value="LIVREE">Livrée</option>
                <option value="ANNULEE">Annulée</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label>Articles *</label>
              <button 
                type="button" 
                className="btn btn-success btn-sm"
                onClick={addArticle}
              >
                <i className="fas fa-plus"></i> Ajouter un article
              </button>
            </div>
            
            {formData.articles.length > 0 ? (
              <div className="articles-list">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Article</th>
                      <th>Quantité</th>
                      <th>Prix unitaire (€)</th>
                      <th>Total (€)</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.articles.map((article, index) => (
                      <tr key={index}>
                        <td>
                          <select
                            className="form-control"
                            value={article.articleId || ''}
                            onChange={(e) => handleArticleChange(index, 'articleId', e.target.value)}
                            required
                          >
                            <option value="">Sélectionner un article</option>
                            {articles.map(art => (
                              <option key={art.id} value={art.id}>
                                {art.code} - {art.designation}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            value={article.quantite || 0}
                            onChange={(e) => handleArticleChange(index, 'quantite', parseFloat(e.target.value) || 0)}
                            min="1"
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            value={article.prixUnitaire || 0}
                            onChange={(e) => handleArticleChange(index, 'prixUnitaire', parseFloat(e.target.value) || 0)}
                            min="0"
                            step="0.01"
                            required
                          />
                        </td>
                        <td>
                          {((article.quantite || 0) * (article.prixUnitaire || 0)).toFixed(2)} €
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => removeArticle(index)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="alert alert-info">
                <i className="fas fa-info-circle"></i> Aucun article ajouté. Cliquez sur "Ajouter un article" pour commencer.
              </div>
            )}
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