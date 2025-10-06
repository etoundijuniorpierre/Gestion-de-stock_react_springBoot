import httpInterceptor from '../http-interceptor';
import { API_CONFIG, buildApiUrlWithParam } from '../../config/api.config.js';

class EntrepriseService {

  // Inscription d'une entreprise
  async sinscrire(entreprise) {
    try {
      return await httpInterceptor.post(API_CONFIG.ENDPOINTS.ENTREPRISES.CREATE, entreprise);
    } catch (error) {
      console.error('Erreur lors de l\'inscription de l\'entreprise:', error);
      throw error;
    }
  }

  // Récupérer toutes les entreprises
  async findAll() {
    try {
      const data = await httpInterceptor.get(API_CONFIG.ENDPOINTS.ENTREPRISES.ALL);
      if (Array.isArray(data)) {
        return data;
      }
      return data?.content || data?.data || [data] || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des entreprises:', error);
      return [];
    }
  }

  // Récupérer une entreprise par ID
  async findById(id) {
    try {
      return await httpInterceptor.get(buildApiUrlWithParam(API_CONFIG.ENDPOINTS.ENTREPRISES.BY_ID, id));
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'entreprise:', error);
      return {};
    }
  }

  // Mettre à jour une entreprise
  async update(id, entreprise) {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.ENTREPRISES.UPDATE.replace('{id}', id);
      return await httpInterceptor.put(endpoint, entreprise);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'entreprise:', error);
      throw error;
    }
  }

  // Supprimer une entreprise
  async delete(id) {
    try {
      await httpInterceptor.delete(buildApiUrlWithParam(API_CONFIG.ENDPOINTS.ENTREPRISES.DELETE, id));
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'entreprise:', error);
      return { success: false, error };
    }
  }
}

export { EntrepriseService };
