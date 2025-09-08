import httpInterceptor from '../http-interceptor';
import { API_CONFIG, buildApiUrlWithParam } from '../../config/api.config.js';

// Service React pur pour la gestion des catégories
class CategoryService {

  // Récupérer toutes les catégories
  async findAll() {
    try {
      const data = await httpInterceptor.get(API_CONFIG.ENDPOINTS.CATEGORIES.ALL);
      // Si la réponse est un tableau, on le retourne tel quel
      if (Array.isArray(data)) {
        return data;
      }
      // Sinon, on essaie d'extraire le tableau de la réponse
      return data?.content || data?.data || [data] || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      throw new Error('Impossible de récupérer les catégories');
    }
  }

  // Supprimer une catégorie
  async delete(id) {
    try {
      const deleteUrl = buildApiUrlWithParam(API_CONFIG.ENDPOINTS.CATEGORIES.DELETE, id);
      console.log('🗑️ Suppression catégorie avec URL:', deleteUrl);
      await httpInterceptor.delete(deleteUrl);
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie:', error);
      
      // Gestion spécifique des erreurs selon le code de statut
      if (error.response?.status === 404) {
        throw new Error('Catégorie non trouvée');
      }
      
      if (error.response?.status === 400) {
        // Erreur 400 généralement due à une contrainte de base de données
        // Vérifier si c'est une erreur de contrainte ou une erreur HTTP générique
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || '';
        
        if (errorMessage.toLowerCase().includes('constraint') || 
            errorMessage.toLowerCase().includes('http error') ||
            errorMessage.toLowerCase().includes('status: 400')) {
          throw new Error('Impossible de supprimer cette catégorie qui est déjà utilisée');
        }
        
        // Message par défaut pour les erreurs 400
        throw new Error('Impossible de supprimer cette catégorie qui est déjà utilisée');
      }
      
      if (error.response?.status === 409) {
        throw new Error('Impossible de supprimer cette catégorie qui est déjà utilisée');
      }
      
      // Erreur générique avec plus de détails
      throw new Error(`Erreur lors de la suppression de la catégorie: ${error.message || 'Erreur inconnue'}`);
    }
  }

  // Sauvegarder une catégorie (création ou modification)
  async save(category) {
    try {
      const response = await httpInterceptor.post(API_CONFIG.ENDPOINTS.CATEGORIES.CREATE, category);
      return response;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la catégorie:', error);
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.errors && Array.isArray(errorData.errors)) {
          throw new Error(errorData.errors.join(', '));
        }
        throw new Error(errorData.message || 'Données invalides');
      }
      throw new Error('Erreur lors de la sauvegarde de la catégorie');
    }
  }

  // Récupérer une catégorie par ID
  async findById(id) {
    try {
      const response = await httpInterceptor.get(buildApiUrlWithParam(API_CONFIG.ENDPOINTS.CATEGORIES.BY_ID, id));
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération de la catégorie:', error);
      if (error.response?.status === 404) {
        throw new Error('Catégorie non trouvée');
      }
      throw new Error('Erreur lors de la récupération de la catégorie');
    }
  }

  // Rechercher une catégorie par code
  async findByCode(code) {
    try {
      const response = await httpInterceptor.get(buildApiUrlWithParam(API_CONFIG.ENDPOINTS.CATEGORIES.FILTER, code));
      return response;
    } catch (error) {
      console.error('Erreur lors de la recherche par code:', error);
      if (error.response?.status === 404) {
        return null; // Catégorie non trouvée
      }
      throw new Error('Erreur lors de la recherche par code');
    }
  }

  // Vérifier si une catégorie est utilisée par des articles
  async isCategoryUsed(categoryId) {
    try {
      // Vérifier s'il existe des articles qui utilisent cette catégorie
      const articles = await httpInterceptor.get(API_CONFIG.ENDPOINTS.ARTICLES.ALL);
      
      if (Array.isArray(articles)) {
        // Chercher un article qui utilise cette catégorie
        const articleUsingCategory = articles.find(article => 
          article.category && article.category.id === categoryId
        );
        return !!articleUsingCategory;
      }
      
      // Si la réponse n'est pas un tableau, essayer d'extraire les données
      const articlesData = articles?.content || articles?.data || [];
      if (Array.isArray(articlesData)) {
        const articleUsingCategory = articlesData.find(article => 
          article.category && article.category.id === categoryId
        );
        return !!articleUsingCategory;
      }
      
      return false; // Par défaut, on considère que la catégorie n'est pas utilisée
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'utilisation de la catégorie:', error);
      // En cas d'erreur, on considère la catégorie comme utilisée par sécurité
      return true;
    }
  }
}

export { CategoryService };
