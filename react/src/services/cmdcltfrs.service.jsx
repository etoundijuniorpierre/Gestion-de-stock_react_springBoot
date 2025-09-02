import httpInterceptor from './http-interceptor';

// Service React pur pour la gestion des commandes clients et fournisseurs
class CmdcltfrsService {

  // ===== COMMANDES CLIENTS =====

  // Récupérer toutes les commandes clients
  async findAllCommandesClient() {
    try {
      const data = await httpInterceptor.get('/api/gestionDeStock/commandesclients/all');
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
      return await httpInterceptor.get(`/api/gestionDeStock/commandesclients/${id}`);
    } catch (error) {
      console.error('Erreur lors de la récupération de la commande client:', error);
      return {};
    }
  }

  // Sauvegarder une commande client
  async saveCommandeClient(commande) {
    try {
      return await httpInterceptor.post('/api/gestionDeStock/commandesclients/create', commande);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la commande client:', error);
      throw error;
    }
  }

  // Mettre à jour une commande client
  async updateCommandeClient(id, commande) {
    // Note: update5 n'existe pas dans l'API, on simule pour l'instant
    console.warn('Méthode updateCommandeClient non implémentée dans l\'API, simulation en cours');
    return { ...commande, id };
  }

  // Supprimer une commande client
  async deleteCommandeClient(id) {
    try {
      await httpInterceptor.delete(`/api/gestionDeStock/commandesclients/delete/${id}`);
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
      const data = await httpInterceptor.get(`/api/gestionDeStock/commandesclients/lignesCommande/${idCommande}`);
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

  // ===== COMMANDES FOURNISSEURS =====

  // Récupérer toutes les commandes fournisseurs
  async findAllCommandesFournisseur() {
    try {
      const data = await httpInterceptor.get('/api/gestionDeStock/commandesfournisseurs/all');
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
      return await httpInterceptor.get(`/api/gestionDeStock/commandesfournisseurs/${id}`);
    } catch (error) {
      console.error('Erreur lors de la récupération de la commande fournisseur:', error);
      return {};
    }
  }

  // Sauvegarder une commande fournisseur
  async saveCommandeFournisseur(commande) {
    try {
      return await httpInterceptor.post('/api/gestionDeStock/commandesfournisseurs/create', commande);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la commande fournisseur:', error);
      throw error;
    }
  }

  // Mettre à jour une commande fournisseur
  async updateCommandeFournisseur(id, commande) {
    // Note: update4 n'existe pas dans l'API, on simule pour l'instant
    console.warn('Méthode updateCommandeFournisseur non implémentée dans l\'API, simulation en cours');
    return { ...commande, id };
  }

  // Supprimer une commande fournisseur
  async deleteCommandeFournisseur(id) {
    try {
      await httpInterceptor.delete(`/api/gestionDeStock/commandesfournisseurs/delete/${id}`);
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
      const data = await httpInterceptor.get(`/api/gestionDeStock/commandesfournisseurs/lignesCommande/${idCommande}`);
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
