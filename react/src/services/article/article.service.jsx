import httpInterceptor from '../http-interceptor';

// Service React pur pour la gestion des articles
class ArticleService {

  // Enregistrer un article
  async enregistrerArticle(articleDto) {
    try {
      return await httpInterceptor.post('/api/gestionDeStock/articles/save', articleDto);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'article:', error);
      throw error;
    }
  }

  // Récupérer tous les articles
  async findAll() {
    try {
      const data = await httpInterceptor.get('/api/gestionDeStock/articles/all');
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
      return await httpInterceptor.get(`/api/gestionDeStock/articles/find/${idArticle}`);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'article:', error);
      return {};
    }
  }

  // Supprimer un article
  async deleteArticle(idArticle) {
    if (!idArticle) {
      return { success: false };
    }
    try {
      await httpInterceptor.delete(`/api/gestionDeStock/articles/delete/${idArticle}`);
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'article:', error);
      return { success: false, error };
    }
  }

  // Rechercher un article par code
  async findArticleByCode(codeArticle) {
    try {
      return await httpInterceptor.get(`/api/gestionDeStock/articles/findbycode/${codeArticle}`);
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
}

export { ArticleService };
