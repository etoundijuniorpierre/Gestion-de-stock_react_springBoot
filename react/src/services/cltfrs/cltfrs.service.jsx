import httpInterceptor from '../http-interceptor';
import { API_CONFIG, buildApiUrlWithParam } from '../../config/api.config.js';

class CltfrsService {

  // Méthodes pour les clients
  async findAllClients() {
    try {
      const data = await httpInterceptor.get(API_CONFIG.ENDPOINTS.CLIENTS.ALL);
      // Si la réponse est un tableau, on le retourne tel quel
      if (Array.isArray(data)) {
        return data;
      }
      // Sinon, on essaie d'extraire le tableau de la réponse
      return data?.content || data?.data || [data] || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des clients:', error);
      return [];
    }
  }

  async findClientById(id) {
    try {
      return await httpInterceptor.get(buildApiUrlWithParam(API_CONFIG.ENDPOINTS.CLIENTS.BY_ID, id));
    } catch (error) {
      console.error('Erreur lors de la récupération du client:', error);
      return {};
    }
  }

  async saveClient(client) {
    try {
      return await httpInterceptor.post(API_CONFIG.ENDPOINTS.CLIENTS.CREATE, client);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du client:', error);
      throw error;
    }
  }

  async updateClient(id, client) {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.CLIENTS.UPDATE.replace('{id}', id);
      return await httpInterceptor.put(endpoint, client);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du client:', error);
      throw error;
    }
  }

  async deleteClient(id) {
    try {
      await httpInterceptor.delete(buildApiUrlWithParam(API_CONFIG.ENDPOINTS.CLIENTS.DELETE, id));
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la suppression du client:', error);
      
      // Gestion spécifique de l'erreur 400
      if (error.response?.status === 400) {
        return { 
          success: false, 
          error: {
            message: "Impossible de supprimer un client qui a déjà des commandes clients"
          }
        };
      }
      
      return { success: false, error };
    }
  }

  // Méthodes pour les fournisseurs
  async findAllFournisseurs() {
    try {
      const data = await httpInterceptor.get(API_CONFIG.ENDPOINTS.FOURNISSEURS.ALL);
      // Si la réponse est un tableau, on le retourne tel quel
      if (Array.isArray(data)) {
        return data;
      }
      // Sinon, on essaie d'extraire le tableau de la réponse
      return data?.content || data?.data || [data] || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des fournisseurs:', error);
      return [];
    }
  }

  async findFournisseurById(id) {
    try {
      return await httpInterceptor.get(buildApiUrlWithParam(API_CONFIG.ENDPOINTS.FOURNISSEURS.BY_ID, id));
    } catch (error) {
      console.error('Erreur lors de la récupération du fournisseur:', error);
      return {};
    }
  }

  async saveFournisseur(fournisseur) {
    try {
      return await httpInterceptor.post(API_CONFIG.ENDPOINTS.FOURNISSEURS.CREATE, fournisseur);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du fournisseur:', error);
      throw error;
    }
  }

  async updateFournisseur(id, fournisseur) {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.FOURNISSEURS.UPDATE.replace('{id}', id);
      return await httpInterceptor.put(endpoint, fournisseur);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du fournisseur:', error);
      throw error;
    }
  }

  async deleteFournisseur(id) {
    try {
      await httpInterceptor.delete(buildApiUrlWithParam(API_CONFIG.ENDPOINTS.FOURNISSEURS.DELETE, id));
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la suppression du fournisseur:', error);
      
      // Gestion spécifique de l'erreur 400
      if (error.response?.status === 400) {
        return { 
          success: false, 
          error: {
            message: "Impossible de supprimer un fournisseur qui a déjà des commandes fournisseurs"
          }
        };
      }
      
      return { success: false, error };
    }
  }

  // Méthodes de compatibilité (aliases)
  async enregistrerClient(client) {
    return this.saveClient(client);
  }

  async enregistrerFournisseur(fournisseur) {
    return this.saveFournisseur(fournisseur);
  }
}

export { CltfrsService };
