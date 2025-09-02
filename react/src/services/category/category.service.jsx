import httpInterceptor from '../http-interceptor';

// Service React pur pour la gestion des catégories
class CategoryService {

  // Récupérer toutes les catégories
  async findAll() {
    try {
      const data = await httpInterceptor.get('/api/gestionDeStock/categories/all');
      // Si la réponse est un tableau, on le retourne tel quel
      if (Array.isArray(data)) {
        return data;
      }
      // Sinon, on essaie d'extraire le tableau de la réponse
      return data?.content || data?.data || [data] || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      return [];
    }
  }

  // Supprimer une catégorie
  async delete(id) {
    try {
      await httpInterceptor.delete(`/api/gestionDeStock/categories/delete/${id}`);
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie:', error);
      return { success: false, error };
    }
  }

  // Sauvegarder une catégorie
  async save(category) {
    try {
      return await httpInterceptor.post('/api/gestionDeStock/categories/create', category);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la catégorie:', error);
      throw error;
    }
  }

  // Récupérer une catégorie par ID
  async findById(id) {
    try {
      return await httpInterceptor.get(`/api/gestionDeStock/categories/${id}`);
    } catch (error) {
      console.error('Erreur lors de la récupération de la catégorie:', error);
      return {};
    }
  }
}

export { CategoryService };
