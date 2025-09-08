import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CategoryService } from '../../services/category/category.service';
import ButtonAction from '../../components/button-action/button.jsx';
import Pagination from '../../components/pagination/pagination.jsx';
import './page-categories.scss';

const PageCategories = () => {
  const [listCategories, setListCategories] = useState([]);
  const [selectedCatIdToDelete, setSelectedCatIdToDelete] = useState(-1);
  const [errorMsgs, setErrorMsgs] = useState({ message: '', type: 'danger' });
  const [loading, setLoading] = useState(false);
  const [usedCategories, setUsedCategories] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 15;
  const navigate = useNavigate();
  const categoryService = new CategoryService();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    findAllCategories();
  }, []);

  // Calculer le nombre total de pages
  useEffect(() => {
    const total = Math.ceil(listCategories.length / itemsPerPage);
    setTotalPages(total);
  }, [listCategories.length]);

  // Obtenir les catégories pour la page courante
  const getCurrentPageCategories = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return listCategories.slice(startIndex, endIndex);
  };

  // Fonction pour changer de page et remonter en haut
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Remonter en haut de la page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const findAllCategories = async () => {
    try {
      setLoading(true);
      const categories = await categoryService.findAll();
      setListCategories(categories);
      setErrorMsgs({ message: '', type: 'danger' });
      
      // Vérifier quelles catégories sont utilisées
      await checkUsedCategories(categories);
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      setErrorMsgs(error.message || 'Erreur lors de la récupération des catégories');
    } finally {
      setLoading(false);
    }
  };

  // Vérifier quelles catégories sont utilisées par des articles
  const checkUsedCategories = async (categories) => {
    try {
      const usedCatIds = new Set();
      
      // Pour chaque catégorie, vérifier si elle est référencée par des articles
      for (const category of categories) {
        const isUsed = await categoryService.isCategoryUsed(category.id);
        if (isUsed) {
          usedCatIds.add(category.id);
        }
      }
      
      setUsedCategories(usedCatIds);
    } catch (error) {
      console.error('Erreur lors de la vérification des catégories utilisées:', error);
      // En cas d'erreur, on considère toutes les catégories comme utilisées par sécurité
      const allCatIds = new Set(categories.map(cat => cat.id));
      setUsedCategories(allCatIds);
    }
  };

  const nouvelleCategory = () => {
    navigate('/dashboard/nouvellecategorie');
  };

  const modifierCategory = (id) => {
    navigate(`/dashboard/nouvellecategorie/${id}`);
  };

  const confirmerEtSupprimerCat = async () => {
    if (selectedCatIdToDelete !== -1) {
      try {
        await categoryService.delete(selectedCatIdToDelete);
        setSelectedCatIdToDelete(-1);
        findAllCategories();
        setShowDeleteModal(false);
        setErrorMsgs(''); // Effacer les erreurs précédentes
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        
        // Gestion spécifique des erreurs avec messages personnalisés
        let errorMessage = 'Erreur lors de la suppression de la catégorie';
        let errorType = 'danger';
        
        if (error.message) {
          if (error.message.includes('déjà utilisée') || error.message.includes('utilisée par des articles')) {
            errorMessage = '⚠️ ' + error.message;
            errorType = 'warning';
          } else if (error.message.includes('non trouvée')) {
            errorMessage = '❌ ' + error.message;
            errorType = 'info';
          } else if (error.message.includes('HTTP error') || error.message.includes('status: 400')) {
            errorMessage = '⚠️ Impossible de supprimer cette catégorie qui est déjà utilisée';
            errorType = 'warning';
          } else {
            errorMessage = '❌ ' + error.message;
            errorType = 'danger';
          }
        }
        
        setErrorMsgs({ message: errorMessage, type: errorType });
        
        // Fermer le modal en cas d'erreur
        setShowDeleteModal(false);
      }
    }
  };

  const annulerSuppressionCat = () => {
    setSelectedCatIdToDelete(-1);
    setShowDeleteModal(false);
  };

  const selectCatPourSupprimer = (id) => {
    setSelectedCatIdToDelete(id);
    setShowDeleteModal(true);
  };

  const voirDetailsCategorie = (id) => {
    navigate(`/dashboard/categorie-details/${id}`);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="categories-list-container">
      {/* En-tête de la page */}
      <div className="page-header">
        <div className="header-content">
          <h1>
            <i className="fas fa-tags"></i>
            Liste des catégories
          </h1>
          <div className="header-actions">
            <button 
              className="btn" 
              onClick={nouvelleCategory}
            >
              <i className="fas fa-plus"></i>
              Nouvelle catégorie
            </button>
          </div>
        </div>
      </div>
      
      {/* Contenu de la page */}
      <div className="page-content">
                            {/* Messages d'erreur */}
                    {errorMsgs.message && (
                      <div className={`alert alert-danger ${errorMsgs.type !== 'danger' ? `alert-${errorMsgs.type}` : ''}`}>
                        <i className={`fas ${errorMsgs.type === 'warning' ? 'fa-exclamation-triangle' : errorMsgs.type === 'info' ? 'fa-ban' : 'fa-exclamation-triangle'}`}></i>
                        {errorMsgs.message}
                      </div>
                    )}
        
        {/* Liste des catégories */}
        {listCategories.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <i className="fas fa-tags"></i>
            </div>
            <div className="empty-text">
              Aucune catégorie trouvée
            </div>
          </div>
        ) : (
          <div className="categories-list">
            {getCurrentPageCategories().map((cat) => (
              <div key={cat.id} className="category-item">
                <div className="category-header">
                  <div className="category-info">
                    <div className="category-code">
                      {cat.code}
                      {usedCategories.has(cat.id) && (
                        <span className="category-used-badge" title="Cette catégorie est utilisée par des articles">
                          <i className="fas fa-link"></i>
                        </span>
                      )}
                    </div>
                    <h3 className="category-designation">
                      {cat.designation}
                    </h3>
                  </div>
                  <div className="category-actions">
                    <button 
                      type="button" 
                      className="btn btn-details" 
                      onClick={() => voirDetailsCategorie(cat.id)}
                      title="Voir les détails"
                    >
                      <i className="far fa-list-alt"></i>
                      <span>Détails</span>
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-edit" 
                      onClick={() => modifierCategory(cat.id)}
                      title="Modifier"
                    >
                      <i className="fas fa-pencil-alt"></i>
                      <span>Modifier</span>
                    </button>
                    <button 
                      type="button" 
                      className={`btn ${usedCategories.has(cat.id) ? 'btn-delete-disabled' : 'btn-delete'}`}
                      onClick={() => !usedCategories.has(cat.id) && selectCatPourSupprimer(cat.id)}
                      disabled={usedCategories.has(cat.id)}
                      title={usedCategories.has(cat.id) ? 'Cette catégorie est utilisée par des articles et ne peut pas être supprimée' : 'Supprimer'}
                    >
                      <i className="fas fa-trash-alt"></i>
                      <span>{usedCategories.has(cat.id) ? 'Utilisée' : 'Supprimer'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {listCategories.length > 0 && (
          <div className="pagination-container">
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              showFirstLast={true}
              maxVisiblePages={5}
            />
          </div>
        )}
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmation</h5>
                <button 
                  type="button" 
                  className="close" 
                  onClick={annulerSuppressionCat}
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Êtes-vous sûr de vouloir supprimer cette catégorie ?
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={annulerSuppressionCat}
                >
                  <i className="fas fa-ban"></i>&nbsp;Annuler
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={confirmerEtSupprimerCat}
                >
                  <i className="fas fa-trash-alt"></i>&nbsp;Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageCategories;
