import httpInterceptor from '../http-interceptor';

class CltfrsService {

  // Méthodes pour les clients
  async findAllClients() {
    try {
      const data = await httpInterceptor.get('/api/gestionDeStock/clients/all');
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
      return await httpInterceptor.get(`/api/gestionDeStock/clients/${id}`);
    } catch (error) {
      console.error('Erreur lors de la récupération du client:', error);
      return {};
    }
  }

  async saveClient(client) {
    try {
      return await httpInterceptor.post('/api/gestionDeStock/clients/create', client);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du client:', error);
      throw error;
    }
  }

  async updateClient(id, client) {
    try {
      return await httpInterceptor.put(`/api/gestionDeStock/clients/${id}`, client);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du client:', error);
      throw error;
    }
  }

  async deleteClient(id) {
    try {
      await httpInterceptor.delete(`/api/gestionDeStock/clients/delete/${id}`);
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
      const data = await httpInterceptor.get('/api/gestionDeStock/fournisseurs/all');
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
      return await httpInterceptor.get(`/api/gestionDeStock/fournisseurs/${id}`);
    } catch (error) {
      console.error('Erreur lors de la récupération du fournisseur:', error);
      return {};
    }
  }

  async saveFournisseur(fournisseur) {
    try {
      return await httpInterceptor.post('/api/gestionDeStock/fournisseurs/create', fournisseur);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du fournisseur:', error);
      throw error;
    }
  }

  // Méthode temporaire pour update (à implémenter quand l'API sera disponible)
  async updateFournisseur(id, fournisseur) {
    // Pour l'instant, on simule la mise à jour
    console.warn('Méthode updateFournisseur non implémentée dans l\'API, simulation en cours');
    return { ...fournisseur, id };
  }

  async deleteFournisseur(id) {
    try {
      await httpInterceptor.delete(`/api/gestionDeStock/fournisseurs/delete/${id}`);
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
