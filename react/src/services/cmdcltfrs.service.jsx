import httpInterceptor from './http-interceptor';
import { API_CONFIG, buildApiUrlWithParam, buildApiUrlWithTwoParams } from '../config/api.config.js';

// Service React pur pour la gestion des commandes clients et fournisseurs
class CmdcltfrsService {

  // ===== COMMANDES CLIENTS =====

  // Récupérer toutes les commandes clients
  async findAllCommandesClient() {
    try {
      const data = await httpInterceptor.get(API_CONFIG.ENDPOINTS.COMMANDES_CLIENTS.ALL);
      // Si la réponse est un tableau, on le retourne tel quel
      if (Array.isArray(data)) {
        return data;
      }
      // Sinon, on essaie d'extraire le tableau de la réponse
      return data?.content || data?.data || [data] || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes clients:', error);
      return [];
    }
  }

  // Récupérer une commande client par ID
  async findByIdCommandeClient(id) {
    try {
      return await httpInterceptor.get(buildApiUrlWithParam(API_CONFIG.ENDPOINTS.COMMANDES_CLIENTS.BY_ID, id));
    } catch (error) {
      console.error('Erreur lors de la récupération de la commande client:', error);
      return {};
    }
  }

  // Sauvegarder une commande client
  async saveCommandeClient(commande) {
    try {
      return await httpInterceptor.post(API_CONFIG.ENDPOINTS.COMMANDES_CLIENTS.CREATE, commande);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la commande client:', error);
      throw error;
    }
  }

  // Mettre à jour une commande client
  async updateCommandeClient(id, commande) {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.COMMANDES_CLIENTS.UPDATE.replace('{idCommande}', id);
      return await httpInterceptor.put(endpoint, commande);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la commande client:', error);
      throw error;
    }
  }

  // Supprimer une commande client
  async deleteCommandeClient(id) {
    try {
      await httpInterceptor.delete(buildApiUrlWithParam(API_CONFIG.ENDPOINTS.COMMANDES_CLIENTS.DELETE, id));
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la suppression de la commande client:', error);
      return { success: false, error };
    }
  }

  // Récupérer les lignes de commande d'une commande client
  async findAllLigneCommandesClient(idCommande) {
    if (!idCommande) {
      return [];
    }
    try {
      const endpoint = API_CONFIG.ENDPOINTS.COMMANDES_CLIENTS.LIGNES_COMMANDE.replace('{idCommande}', idCommande);
      const data = await httpInterceptor.get(endpoint);
      // Si la réponse est un tableau, on le retourne tel quel
      if (Array.isArray(data)) {
        return data;
      }
      // Sinon, on essaie d'extraire le tableau de la réponse
      return data?.content || data?.data || [data] || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des lignes de commande:', error);
      return [];
    }
  }

  // Mettre à jour l'état d'une commande client
  async updateEtatCommandeClient(idCommande, etatCommande) {
    try {
      console.log('updateEtatCommandeClient called with:', { idCommande, etatCommande });
      console.log('httpInterceptor:', httpInterceptor);
      console.log('httpInterceptor.patch:', httpInterceptor.patch);
      
      const endpoint = buildApiUrlWithTwoParams(API_CONFIG.ENDPOINTS.COMMANDES_CLIENTS.UPDATE_ETAT, idCommande, etatCommande);
      console.log('Endpoint built:', endpoint);
      
      const result = await httpInterceptor.patch(endpoint);
      console.log('PATCH request result:', result);
      return result;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'état de la commande client:', error);
      throw error;
    }
  }

  // ===== COMMANDES FOURNISSEURS =====

  // Récupérer toutes les commandes fournisseurs
  async findAllCommandesFournisseur() {
    try {
      const data = await httpInterceptor.get(API_CONFIG.ENDPOINTS.COMMANDES_FOURNISSEURS.ALL);
      // Si la réponse est un tableau, on le retourne tel quel
      if (Array.isArray(data)) {
        return data;
      }
      // Sinon, on essaie d'extraire le tableau de la réponse
      return data?.content || data?.data || [data] || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes fournisseurs:', error);
      return [];
    }
  }

  // Récupérer une commande fournisseur par ID
  async findByIdCommandeFournisseur(id) {
    try {
      return await httpInterceptor.get(buildApiUrlWithParam(API_CONFIG.ENDPOINTS.COMMANDES_FOURNISSEURS.BY_ID, id));
    } catch (error) {
      console.error('Erreur lors de la récupération de la commande fournisseur:', error);
      return {};
    }
  }

  // Sauvegarder une commande fournisseur
  async saveCommandeFournisseur(commande) {
    try {
      return await httpInterceptor.post(API_CONFIG.ENDPOINTS.COMMANDES_FOURNISSEURS.CREATE, commande);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la commande fournisseur:', error);
      throw error;
    }
  }

  // Mettre à jour une commande fournisseur
  async updateCommandeFournisseur(id, commande) {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.COMMANDES_FOURNISSEURS.UPDATE.replace('{idCommande}', id);
      return await httpInterceptor.put(endpoint, commande);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la commande fournisseur:', error);
      throw error;
    }
  }

  // Supprimer une commande fournisseur
  async deleteCommandeFournisseur(id) {
    try {
      await httpInterceptor.delete(buildApiUrlWithParam(API_CONFIG.ENDPOINTS.COMMANDES_FOURNISSEURS.DELETE, id));
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la suppression de la commande fournisseur:', error);
      return { success: false, error };
    }
  }

  // Récupérer les lignes de commande d'une commande fournisseur
  async findAllLigneCommandesFournisseur(idCommande) {
    if (!idCommande) {
      return [];
    }
    try {
      const endpoint = API_CONFIG.ENDPOINTS.COMMANDES_FOURNISSEURS.LIGNES_COMMANDE.replace('{idCommande}', idCommande);
      const data = await httpInterceptor.get(endpoint);
      // Si la réponse est un tableau, on le retourne tel quel
      if (Array.isArray(data)) {
        return data;
      }
      // Sinon, on essaie d'extraire le tableau de la réponse
      return data?.content || data?.data || [data] || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des lignes de commande fournisseur:', error);
      return [];
    }
  }

  // Mettre à jour l'état d'une commande fournisseur
  async updateEtatCommandeFournisseur(idCommande, etatCommande) {
    try {
      console.log('updateEtatCommandeFournisseur called with:', { idCommande, etatCommande });
      console.log('httpInterceptor:', httpInterceptor);
      console.log('httpInterceptor.patch:', httpInterceptor.patch);
      
      const endpoint = buildApiUrlWithTwoParams(API_CONFIG.ENDPOINTS.COMMANDES_FOURNISSEURS.UPDATE_ETAT, idCommande, etatCommande);
      console.log('Endpoint built:', endpoint);
      
      const result = await httpInterceptor.patch(endpoint);
      console.log('PATCH request result:', result);
      return result;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'état de la commande fournisseur:', error);
      throw error;
    }
  }

  // ===== MÉTHODES DE CALCUL =====

  // Calculer le total d'une commande
  calculerTotalCommande(lignes) {
    let total = 0;
    lignes.forEach((ligne) => {
      if (ligne.prixUnitaire && ligne.quantite) {
        total += +ligne.quantite * +ligne.prixUnitaire;
      }
    });
    return Math.floor(total);
  }
}

export { CmdcltfrsService };