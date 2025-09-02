import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArticleService } from '../../../services/article/article.service';
import './article.scss';

const Article = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const articleService = new ArticleService();

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      const data = await articleService.findAll();
      setArticles(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error);
      setErrorMsg('Erreur lors du chargement des articles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (articleId) => {
    navigate(`/dashboard/nouvel-article/${articleId}`);
  };

  const handleDelete = async (articleId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      try {
        const result = await articleService.delete(articleId);
        if (result.success) {
          loadArticles(); // Recharger la liste
        } else {
          setErrorMsg('Erreur lors de la suppression de l\'article');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setErrorMsg('Erreur lors de la suppression de l\'article');
      }
    }
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

      {errorMsg && (
        <div className="alert alert-danger">{errorMsg}</div>
      )}

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
                  <th>Code</th>
                  <th>Désignation</th>
                  <th>Prix HT</th>
                  <th>Prix TTC</th>
                  <th>Catégorie</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id}>
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
    </div>
  );
};

export default Article;
