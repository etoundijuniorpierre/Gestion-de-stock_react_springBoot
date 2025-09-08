import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArticleService } from '../../../services/article/article.service';
import useErrorHandler from '../../../hooks/useErrorHandler';
import ErrorHandler from '../../../components/error-handler/error-handler';
import ConfirmationPopup from '../../../components/confirmation-popup';
import Pagination from '../../../components/pagination/pagination';
import './article.scss';

const Article = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 15;
  const navigate = useNavigate();
  const articleService = new ArticleService();
  const { error, success, handleError, handleSuccess, clearError, clearSuccess, handleAsyncOperation } = useErrorHandler();

  useEffect(() => {
    loadArticles();
  }, []);

  // Calculer le nombre total de pages
  useEffect(() => {
    const total = Math.ceil(articles.length / itemsPerPage);
    setTotalPages(total);
  }, [articles.length]);

  // Obtenir les articles pour la page courante
  const getCurrentPageArticles = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return articles.slice(startIndex, endIndex);
  };

  // Fonction pour changer de page et remonter en haut
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadArticles = async () => {
    setIsLoading(true);
    
    try {
      const data = await handleAsyncOperation(async () => {
        return await articleService.findAll();
      });
      setArticles(data || []);
    } catch (error) {
      // L'erreur est déjà gérée par handleAsyncOperation
      console.error('Erreur lors du chargement des articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (articleId) => {
    navigate(`/dashboard/nouvel-article/${articleId}`);
  };

  const handleDelete = async (articleId) => {
    setArticleToDelete(articleId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (articleToDelete) {
      try {
        const result = await handleAsyncOperation(async () => {
          return await articleService.delete(articleToDelete);
        });
        if (result.success) {
          // Afficher un message de succès
          handleSuccess('Article supprimé avec succès');
          loadArticles(); // Recharger la liste
        } else {
          // Gestion spécifique des erreurs
          if (result.authError) {
            handleError(new Error(result.error));
            // Rediriger vers la page de login après un délai
            setTimeout(() => {
              window.location.href = '/login';
            }, 3000);
          } else if (result.serverError) {
            handleError(new Error(result.error));
          } else if (result.businessError) {
            handleError(new Error(result.error));
          } else {
            handleError(new Error(result.error || 'Erreur lors de la suppression de l\'article'));
          }
        }
      } catch (error) {
        // L'erreur est déjà gérée par handleAsyncOperation
        console.error('Erreur lors de la suppression:', error);
      }
    }
    setShowDeleteConfirm(false);
    setArticleToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setArticleToDelete(null);
  };

  const handleNewArticle = () => {
    navigate('/dashboard/nouvel-article');
  };

  if (isLoading) {
    return (
      <div className="article-container">
        <div className="loading">Chargement des articles...</div>
      </div>
    );
  }

  return (
    <div className="article-container">
      <div className="article-header">
        <h2>
          <i className="fas fa-boxes article-icon"></i>
          Gestion des Articles
        </h2>
        <button 
          className="btn btn-primary"
          onClick={handleNewArticle}
        >
          <i className="fas fa-plus"></i> Nouvel Article
        </button>
      </div>

      <ErrorHandler 
        error={error} 
        success={success}
        onClose={clearError}
        onSuccessClose={clearSuccess}
        autoClose={true}
        autoCloseDelay={5000}
      />

      <div className="article-content">
        {articles.length === 0 ? (
          <div className="no-articles">
            <p>Aucun article trouvé.</p>
            <button 
              className="btn btn-primary"
              onClick={handleNewArticle}
            >
              Créer le premier article
            </button>
          </div>
        ) : (
          <div className="articles-table">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Code</th>
                  <th>Désignation</th>
                  <th>Prix HT</th>
                  <th>Prix TTC</th>
                  <th>Catégorie</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getCurrentPageArticles().map((article) => (
                  <tr key={article.id}>
                    <td>
                      <div className="article-photo">
                        <img 
                          src={article.photo || "/src/assets/product.png"} 
                          alt={`Photo de ${article.designation}`}
                          className="article-photo__img"
                          onError={(e) => {
                            // Si l'image ne peut pas être chargée, utiliser une image par défaut
                            e.target.src = "/src/assets/product.png";
                          }}
                        />
                      </div>
                    </td>
                    <td>{article.codeArticle}</td>
                    <td>{article.designation}</td>
                    <td>{article.prixUnitaireHt} €</td>
                    <td>{article.prixUnitaireTtc} €</td>
                    <td>{article.categorie?.designation || 'N/A'}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(article.id)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(article.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {articles.length > 0 && (
        <div className="row mb-3">
          <div className="col-md-12 text-center">
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              showFirstLast={true}
              maxVisiblePages={5}
            />
          </div>
        </div>
      )}

      <ConfirmationPopup
        isOpen={showDeleteConfirm}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        onClose={handleCancelDelete}
        message="Êtes-vous sûr de vouloir supprimer cet article ?"
        confirmText="Oui, supprimer"
        cancelText="Non, annuler"
      />
    </div>
  );
};

export default Article;
