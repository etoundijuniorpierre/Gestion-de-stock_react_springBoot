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
      throw new Error('Impossible de récupérer les catégories');
    }
  }

  // Supprimer une catégorie
  async delete(id) {
    try {
      await httpInterceptor.delete(`/api/gestionDeStock/categories/delete/${id}`);
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie:', error);
      if (error.response?.status === 404) {
        throw new Error('Catégorie non trouvée');
      }
      throw new Error('Erreur lors de la suppression de la catégorie');
    }
  }

  // Sauvegarder une catégorie (création ou modification)
  async save(category) {
    try {
      const response = await httpInterceptor.post('/api/gestionDeStock/categories/create', category);
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
      const response = await httpInterceptor.get(`/api/gestionDeStock/categories/${id}`);
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
      const response = await httpInterceptor.get(`/api/gestionDeStock/categories/filter/${code}`);
      return response;
    } catch (error) {
      console.error('Erreur lors de la recherche par code:', error);
      if (error.response?.status === 404) {
        return null; // Catégorie non trouvée
      }
      throw new Error('Erreur lors de la recherche par code');
    }
  }
}

export { CategoryService };
