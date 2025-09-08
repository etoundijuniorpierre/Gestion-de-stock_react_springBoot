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
      throw error;
    }
  }

  // Correction négative de stock
  async correctionNegative(mvtStkDto) {
    try {
      return await httpInterceptor.post(API_CONFIG.ENDPOINTS.MOUVEMENTS_STOCK.CORRECTION_NEGATIVE, mvtStkDto);
    } catch (error) {
      console.error('Erreur lors de la correction négative:', error);
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
      return await httpInterceptor.get(buildApiUrlWithParam(API_CONFIG.ENDPOINTS.MOUVEMENTS_STOCK.STOCK_REEL, idArticle));
    } catch (error) {
      console.error('Erreur lors de la récupération du stock réel:', error);
      throw error;
    }
  }

  // Récupérer l'historique des mouvements d'un article
  async getHistoriqueMouvements(idArticle) {
    if (!idArticle) {
      throw new Error('ID de l\'article manquant');
    }
    try {
      return await httpInterceptor.get(buildApiUrlWithParam(API_CONFIG.ENDPOINTS.MOUVEMENTS_STOCK.FILTER_ARTICLE, idArticle));
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
      throw error;
    }
  }

  // Créer un DTO de mouvement de stock pour correction
  createMvtStkDto(article, quantite, typeCorrection, idEntreprise = 1) {
    return {
      dateMvt: new Date().toISOString(),
      quantite: parseFloat(quantite),
      article: {
        id: article.id,
        codeArticle: article.codeArticle,
        designation: article.designation,
        prixUnitaireHt: article.prixUnitaireHt,
        tauxTva: article.tauxTva,
        prixUnitaireTtc: article.prixUnitaireTtc,
        photo: article.photo,
        categorie: article.categorie,
        idEntreprise: article.idEntreprise
      },
      typeMvt: typeCorrection === 'positive' ? 'CORRECTION_POS' : 'CORRECTION_NEG',
      sourceMvt: 'VENTE', // Par défaut pour les corrections manuelles
      idEntreprise: idEntreprise
    };
  }
}

export default MouvementStockService;