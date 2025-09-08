import httpInterceptor from '../http-interceptor';
import { API_CONFIG, buildApiUrlWithParam } from '../../config/api.config.js';

// Service React pur pour la gestion des articles
class ArticleService {

  // Enregistrer un article
  async enregistrerArticle(articleDto) {
    try {
      return await httpInterceptor.post(API_CONFIG.ENDPOINTS.ARTICLES.CREATE, articleDto);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'article:', error);
      throw error;
    }
  }

  // Mettre à jour un article
  async updateArticle(idArticle, articleDto) {
    if (!idArticle) {
      throw new Error('ID de l\'article manquant');
    }
    try {
      return await httpInterceptor.put(buildApiUrlWithParam(API_CONFIG.ENDPOINTS.ARTICLES.UPDATE, idArticle), articleDto);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'article:', error);
      throw error;
    }
  }

  // Récupérer tous les articles
  async findAll() {
    try {
      const data = await httpInterceptor.get(API_CONFIG.ENDPOINTS.ARTICLES.ALL);
      // Si la réponse est un tableau, on le retourne tel quel
      if (Array.isArray(data)) {
        return data;
      }
      // Sinon, on essaie d'extraire le tableau de la réponse
      return data?.content || data?.data || [data] || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des articles:', error);
      return [];
    }
  }

  // Récupérer un article par ID
  async findArticleById(idArticle) {
    if (!idArticle) {
      return {};
    }
    try {
      return await httpInterceptor.get(buildApiUrlWithParam(API_CONFIG.ENDPOINTS.ARTICLES.BY_ID, idArticle));
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'article:', error);
      return {};
    }
  }

  // Supprimer un article
  async deleteArticle(idArticle) {
    if (!idArticle) {
      return { success: false, error: 'ID de l\'article manquant' };
    }
    try {
      const response = await httpInterceptor.delete(buildApiUrlWithParam(API_CONFIG.ENDPOINTS.ARTICLES.DELETE, idArticle));
      return { success: true, data: response };
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'article:', error);
      
      // Gestion spécifique des erreurs
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        return { 
          success: false, 
          error: 'Erreur d\'authentification. Veuillez vous reconnecter.',
          authError: true 
        };
      }
      
      if (error.message?.includes('400') || error.message?.includes('HTTP error! status: 400')) {
        return { 
          success: false, 
          error: 'Impossible de supprimer un article déjà utilisé dans des commandes client',
          businessError: true 
        };
      }
      
      if (error.message?.includes('500') || error.message?.includes('Internal Server Error')) {
        return { 
          success: false, 
          error: 'Erreur serveur. L\'article ne peut pas être supprimé car il est utilisé dans des commandes.',
          serverError: true 
        };
      }
      
      return { 
        success: false, 
        error: error.message || 'Erreur lors de la suppression de l\'article' 
      };
    }
  }

  // Rechercher un article par code
  async findArticleByCode(codeArticle) {
    try {
      return await httpInterceptor.get(buildApiUrlWithParam(API_CONFIG.ENDPOINTS.ARTICLES.FILTER, codeArticle));
    } catch (error) {
      console.error('Erreur lors de la recherche de l\'article par code:', error);
      return {};
    }
  }

  // Méthode pour la compatibilité avec l'ancien code
  findAllArticles() {
    return this.findAll();
  }

  delete(idArticle) {
    return this.deleteArticle(idArticle);
  }

  // Alias pour la mise à jour
  update(idArticle, articleDto) {
    return this.updateArticle(idArticle, articleDto);
  }
}

export { ArticleService };
