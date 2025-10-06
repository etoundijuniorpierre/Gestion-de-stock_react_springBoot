import React, { useState, useEffect } from 'react';
import './mouvements-stocks.scss';
import ButtonAction from '../../components/button-action/button';
import DetailMvtStkArticle from '../../components/detail-mvt-stk-article/detail-mvt-stk-article';
import DetailMvtStk from '../../components/detail-mvt-skt+/detail-mvt-stk';
import Pagination from '../../components/pagination/pagination';
import { ArticleService } from '../../services/article/article.service';
import MouvementStockService from '../../services/mouvement-stock/mouvement-stock.service';

const MouvementsStocks = () => {
  const [collapseStates, setCollapseStates] = useState({});
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 15;
  
  // Instances des services
  const articleService = new ArticleService();
  const mouvementStockService = new MouvementStockService();

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
    // Remonter en haut de la page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Charger les articles et leurs mouvements
  useEffect(() => {
    const loadArticlesWithMouvements = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('🔄 Chargement des articles...');
        
        // 1. Récupérer tous les articles
        const articlesData = await articleService.findAll();
        console.log('📦 Articles récupérés:', articlesData);
        
        if (!articlesData || articlesData.length === 0) {
          console.log('⚠️ Aucun article trouvé');
          setArticles([]);
          return;
        }
        
        // 2. Pour chaque article, récupérer le stock réel et l'historique des mouvements
        const articlesWithData = await Promise.all(
          articlesData.map(async (article) => {
            try {
              console.log(`🔄 Chargement des données pour l'article ${article.id}...`);
              
              // Récupérer le stock réel
              const stockReel = await mouvementStockService.getStockReel(article.id);
              console.log(`📊 Stock réel pour l'article ${article.id}:`, stockReel);
              
              // Récupérer l'historique des mouvements
              let mouvements = [];
              try {
                mouvements = await mouvementStockService.getHistoriqueMouvements(article.id);
                console.log(`📈 Mouvements pour l'article ${article.id}:`, mouvements);
              } catch (mvtError) {
                console.warn(`⚠️ Aucun mouvement trouvé pour l'article ${article.id} ou erreur de récupération:`, mvtError.message);
                // Continue with empty array
              }
              
              // Transformer les mouvements pour correspondre au format attendu
              const mouvementsFormatted = Array.isArray(mouvements) ? mouvements.map(mvt => ({
                date: new Date(mvt.dateMvt).toLocaleDateString('fr-FR'),
                quantite: mvt.quantite,
                type: mvt.typeMvt === 'ENTREE' ? 'Entrée' : 
                      mvt.typeMvt === 'SORTIE' ? 'Sortie' :
                      mvt.typeMvt === 'CORRECTION_POS' ? 'Correction +' :
                      mvt.typeMvt === 'CORRECTION_NEG' ? 'Correction -' : mvt.typeMvt,
                source: mvt.sourceMvt
              })) : [];
              
              return {
                ...article,
                stockActuel: stockReel || 0,
                mouvements: mouvementsFormatted
              };
            } catch (articleError) {
              console.error(`❌ Erreur pour l'article ${article.id}:`, articleError);
              // Retourner l'article avec des données par défaut en cas d'erreur
              return {
                ...article,
                stockActuel: 0,
                mouvements: []
              };
            }
          })
        );
        
        console.log('✅ Articles avec données chargés:', articlesWithData);
        setArticles(articlesWithData);
        
      } catch (error) {
        console.error('❌ Erreur lors du chargement des articles:', error);
        setError('Erreur lors du chargement des données. Veuillez réessayer.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadArticlesWithMouvements();
  }, []);

  const toggleCollapse = (articleId) => {
    setCollapseStates(prev => ({
      ...prev,
      [articleId]: !prev[articleId]
    }));
  };

  const getAriaExpanded = (articleId) => collapseStates[articleId] || false;
  const getCollapseClassName = (articleId) => `collapse ${collapseStates[articleId] ? 'show' : ''}`;

  return (
    <div className="mouvements-stocks-container">
      {/* En-tête de la page */}
      <div className="mouvements-stocks-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="page-title">
              <i className="fas fa-warehouse"></i>
              Mouvements du stock
            </h1>
            <p className="page-subtitle">Gestion et suivi des mouvements de stock</p>
          </div>
          <div className="header-right">
            <ButtonAction
              isImporterVisible={false}
              isNouveauVisible={false}
            />
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="mouvements-stocks-content">
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
            </div>
            <h3>Chargement des données...</h3>
            <p>Récupération des articles et de leur historique de stock.</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <div className="error-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h3>Erreur de chargement</h3>
            <p>{error}</p>
            <button 
              className="retry-btn"
              onClick={() => window.location.reload()}
            >
              <i className="fas fa-redo"></i>
              Réessayer
            </button>
          </div>
        ) : articles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <i className="fas fa-box-open"></i>
            </div>
            <h3>Aucun article trouvé</h3>
            <p>Aucun article n'a été trouvé dans la base de données.</p>
          </div>
        ) : (
          <div className="articles-accordion">
            {getCurrentPageArticles().map((article) => (
              <div key={article.id} className="article-card">
                <div className="article-header" onClick={() => toggleCollapse(article.id)}>
                  <DetailMvtStkArticle 
                    article={article}
                    isExpanded={getAriaExpanded(article.id)}
                  />
                  <div className="expand-indicator">
                    <i className={`fas fa-chevron-down ${getAriaExpanded(article.id) ? 'rotated' : ''}`}></i>
                  </div>
                </div>
                
                <div 
                  className={getCollapseClassName(article.id)}
                  aria-labelledby={`heading-${article.id}`}
                >
                  <div className="mouvements-list">
                    <div className="mouvements-header">
                      <h4>Historique des mouvements</h4>
                      <div className="mouvements-count">
                        {article.mouvements.length} mouvement{article.mouvements.length > 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className="mouvements-items">
                      {article.mouvements.map((mouvement, index) => (
                        <DetailMvtStk 
                          key={index}
                          mouvement={mouvement}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {articles.length > 0 && (
        <div className="mouvements-stocks-pagination">
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
  );
};

export default MouvementsStocks; 