import httpInterceptor from '../http-interceptor';
import API_CONFIG, { buildApiUrlWithParam } from '../../config/api.config.js';

// Service React pur pour la gestion des mouvements de stock
class MouvementStockService {

  // Correction positive de stock
  async correctionPositive(mvtStkDto) {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.MOUVEMENTS_STOCK.CORRECTION_POSITIVE;
      if (!endpoint) {
        throw new Error('Endpoint de correction positive non défini dans la configuration API');
      }
      
      return await httpInterceptor.post(endpoint, mvtStkDto);
    } catch (error) {
      console.error('Erreur lors de la correction positive:', error);
      // Prevent automatic redirect to login by handling auth errors specifically
      if (error.message?.includes('401') || error.message?.includes('403')) {
        throw new Error('Votre session a expiré. Veuillez vous reconnecter.');
      }
      throw error;
    }
  }

  // Correction négative de stock
  async correctionNegative(mvtStkDto) {
    try {
      return await httpInterceptor.post(API_CONFIG.ENDPOINTS.MOUVEMENTS_STOCK.CORRECTION_NEGATIVE, mvtStkDto);
    } catch (error) {
      console.error('Erreur lors de la correction négative:', error);
      // Prevent automatic redirect to login by handling auth errors specifically
      if (error.message?.includes('401') || error.message?.includes('403')) {
        throw new Error('Votre session a expiré. Veuillez vous reconnecter.');
      }
      throw error;
    }
  }

  // Entrée de stock
  async entreeStock(mvtStkDto) {
    try {
      return await httpInterceptor.post(API_CONFIG.ENDPOINTS.MOUVEMENTS_STOCK.ENTREE, mvtStkDto);
    } catch (error) {
      console.error('Erreur lors de l\'entrée de stock:', error);
      throw error;
    }
  }

  // Sortie de stock
  async sortieStock(mvtStkDto) {
    try {
      return await httpInterceptor.post(API_CONFIG.ENDPOINTS.MOUVEMENTS_STOCK.SORTIE, mvtStkDto);
    } catch (error) {
      console.error('Erreur lors de la sortie de stock:', error);
      throw error;
    }
  }

  // Récupérer le stock réel d'un article
  async getStockReel(idArticle) {
    if (!idArticle) {
      throw new Error('ID de l\'article manquant');
    }
    try {
      const result = await httpInterceptor.get(buildApiUrlWithParam(API_CONFIG.ENDPOINTS.MOUVEMENTS_STOCK.STOCK_REEL, idArticle));
      return result || 0;
    } catch (error) {
      console.warn(`Stock réel non disponible pour l'article ${idArticle} (404) ou erreur de récupération:`, error.message);
      // Return 0 instead of throwing error to allow UI to continue
      return 0;
    }
  }

  // Récupérer l'historique des mouvements d'un article
  async getHistoriqueMouvements(idArticle) {
    if (!idArticle) {
      throw new Error('ID de l\'article manquant');
    }
    try {
      const result = await httpInterceptor.get(buildApiUrlWithParam(API_CONFIG.ENDPOINTS.MOUVEMENTS_STOCK.FILTER_ARTICLE, idArticle));
      return result || [];
    } catch (error) {
      console.warn(`Aucun mouvement trouvé pour l'article ${idArticle} (404) ou erreur de récupération:`, error.message);
      // Return empty array instead of throwing error to allow UI to continue
      return [];
    }
  }

  // Créer un DTO de mouvement de stock pour correction
  createMvtStkDto(article, quantite, typeCorrection, idEntreprise = 1) {
    return {
      dateMvt: new Date().toISOString(),
      quantite: parseFloat(quantite),
      idArticle: article.id, // Only send the article ID instead of the complete article object
      typeMvt: typeCorrection === 'positive' ? 'CORRECTION_POS' : 'CORRECTION_NEG',
      sourceMvt: 'VENTE', // Par défaut pour les corrections manuelles
      idEntreprise: idEntreprise
    };
  }
}

export default MouvementStockService;