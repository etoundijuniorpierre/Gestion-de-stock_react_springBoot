import httpInterceptor from '../http-interceptor';

class MouvementStockService {

  // Entrée en stock
  async entreeStock(mvtStkDto) {
    try {
      return await httpInterceptor.post('/api/gestionDeStock/mvtstk/entree', mvtStkDto);
    } catch (error) {
      console.error('Erreur lors de l\'entrée en stock:', error);
      throw error;
    }
  }

  // Sortie de stock
  async sortieStock(mvtStkDto) {
    try {
      return await httpInterceptor.post('/api/gestionDeStock/mvtstk/sortie', mvtStkDto);
    } catch (error) {
      console.error('Erreur lors de la sortie de stock:', error);
      throw error;
    }
  }

  // Correction positive de stock
  async correctionStockPos(mvtStkDto) {
    try {
      return await httpInterceptor.post('/api/gestionDeStock/mvtstk/correctionpos', mvtStkDto);
    } catch (error) {
      console.error('Erreur lors de la correction positive:', error);
      throw error;
    }
  }

  // Correction négative de stock
  async correctionStockNeg(mvtStkDto) {
    try {
      return await httpInterceptor.post('/api/gestionDeStock/mvtstk/correctionneg', mvtStkDto);
    } catch (error) {
      console.error('Erreur lors de la correction négative:', error);
      throw error;
    }
  }

  // Mouvements de stock d'un article
  async getMouvementsArticle(idArticle) {
    try {
      const data = await httpInterceptor.get(`/api/gestionDeStock/mvtstk/filter/article/${idArticle}`);
      // Si la réponse est un tableau, on le retourne tel quel
      if (Array.isArray(data)) {
        return data;
      }
      // Sinon, on essaie d'extraire le tableau de la réponse
      return data?.content || data?.data || [data] || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des mouvements:', error);
      return [];
    }
  }

  // Stock réel d'un article
  async getStockReelArticle(idArticle) {
    try {
      return await httpInterceptor.get(`/api/gestionDeStock/mvtstk/stockreel/${idArticle}`);
    } catch (error) {
      console.error('Erreur lors de la récupération du stock réel:', error);
      return 0;
    }
  }

  // Créer un mouvement d'entrée
  async creerEntreeStock(articleId, quantite, sourceMvt = 'commandeFournisseur') {
    const mvtStk = {
      dateMvt: new Date().toISOString(),
      quantite: quantite,
      article: { id: articleId },
      typeMvt: 'entree',
      sourceMvt: sourceMvt
    };
    return this.entreeStock(mvtStk);
  }

  // Créer un mouvement de sortie
  async creerSortieStock(articleId, quantite, sourceMvt = 'vente') {
    const mvtStk = {
      dateMvt: new Date().toISOString(),
      quantite: quantite,
      article: { id: articleId },
      typeMvt: 'sortie',
      sourceMvt: sourceMvt
    };
    return this.sortieStock(mvtStk);
  }

  // Créer une correction positive
  async creerCorrectionPositive(articleId, quantite) {
    const mvtStk = {
      dateMvt: new Date().toISOString(),
      quantite: quantite,
      article: { id: articleId },
      typeMvt: 'correctionPos',
      sourceMvt: 'commandeFournisseur'
    };
    return this.correctionStockPos(mvtStk);
  }

  // Créer une correction négative
  async creerCorrectionNegative(articleId, quantite) {
    const mvtStk = {
      dateMvt: new Date().toISOString(),
      quantite: quantite,
      article: { id: articleId },
      typeMvt: 'correctionNeg',
      sourceMvt: 'commandeFournisseur'
    };
    return this.correctionStockNeg(mvtStk);
  }
}

export { MouvementStockService };
