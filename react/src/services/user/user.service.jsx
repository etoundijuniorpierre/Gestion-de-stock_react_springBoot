import httpInterceptor from '../http-interceptor';
import { API_CONFIG, buildApiUrlWithParam } from '../../config/api.config.js';

// Service React pur pour la gestion des utilisateurs
class UserService {

  // Récupérer tous les utilisateurs
  async findAll() {
    try {
      const data = await httpInterceptor.get(API_CONFIG.ENDPOINTS.UTILISATEURS.ALL);
      // Si la réponse est un tableau, on le retourne tel quel
      if (Array.isArray(data)) {
        return data;
      }
      // Sinon, on essaie d'extraire le tableau de la réponse
      return data?.content || data?.data || [data] || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw new Error('Impossible de récupérer les utilisateurs');
    }
  }

  // Récupérer un utilisateur par ID
  async findById(id) {
    try {
      const response = await httpInterceptor.get(buildApiUrlWithParam(API_CONFIG.ENDPOINTS.UTILISATEURS.BY_ID, id));
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      if (error.response?.status === 404) {
        throw new Error('Utilisateur non trouvé');
      }
      throw new Error('Erreur lors de la récupération de l\'utilisateur');
    }
  }

  // Sauvegarder un utilisateur (création)
  async save(utilisateur) {
    try {
      const response = await httpInterceptor.post(API_CONFIG.ENDPOINTS.UTILISATEURS.CREATE, utilisateur);
      return response;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'utilisateur:', error);
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.errors && Array.isArray(errorData.errors)) {
          throw new Error(errorData.errors.join(', '));
        }
        throw new Error(errorData.message || 'Données invalides');
      }
      throw new Error('Erreur lors de la sauvegarde de l\'utilisateur');
    }
  }

  // Mettre à jour un utilisateur
  async update(id, utilisateur) {
    try {
      // D'après swagger.json, l'endpoint create peut être utilisé pour créer ET modifier
      // On ajoute l'ID à l'utilisateur pour la modification
      const utilisateurAvecId = { ...utilisateur, id };
      const response = await httpInterceptor.post(API_CONFIG.ENDPOINTS.UTILISATEURS.CREATE, utilisateurAvecId);
      return response;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.errors && Array.isArray(errorData.errors)) {
          throw new Error(errorData.errors.join(', '));
        }
        throw new Error(errorData.message || 'Données invalides');
      }
      throw new Error('Erreur lors de la mise à jour de l\'utilisateur');
    }
  }

  // Supprimer un utilisateur
  async delete(id) {
    try {
      await httpInterceptor.delete(buildApiUrlWithParam(API_CONFIG.ENDPOINTS.UTILISATEURS.DELETE, id));
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      if (error.response?.status === 404) {
        throw new Error('Utilisateur non trouvé');
      }
      throw new Error('Erreur lors de la suppression de l\'utilisateur');
    }
  }

  // Rechercher un utilisateur par email
  async findByEmail(email) {
    try {
      const response = await httpInterceptor.get(buildApiUrlWithParam(API_CONFIG.ENDPOINTS.UTILISATEURS.FIND_BY_EMAIL, email));
      return response;
    } catch (error) {
      console.error('Erreur lors de la recherche par email:', error);
      if (error.response?.status === 404) {
        return null; // Utilisateur non trouvé
      }
      throw new Error('Erreur lors de la recherche par email');
    }
  }

  // Changer le mot de passe d'un utilisateur
  async changerMotDePasse(changerMotDePasseDto) {
    try {
      console.log('🔐 Tentative de changement de mot de passe...');
      console.log('📤 Données complètes reçues:', changerMotDePasseDto);
      
      // S'assurer que toutes les données requises sont présentes
      const dataToSend = {
        id: changerMotDePasseDto.id,
        motDePasse: changerMotDePasseDto.motDePasse,
        confirmMotDePasse: changerMotDePasseDto.confirmMotDePasse
      };
      
      console.log('📤 Données envoyées à l\'API:', dataToSend);
      
      // Utiliser l'endpoint correct selon swagger.json
      const result = await httpInterceptor.post('/api/gestionDeStock/utilisateurs/update/password', dataToSend);
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ Erreur lors du changement de mot de passe:', error);
      console.error('📊 Détails de l\'erreur:', {
        message: error.message,
        status: error.status,
        endpoint: '/api/gestionDeStock/utilisateurs/update/password',
        data: changerMotDePasseDto
      });
      
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.errors && Array.isArray(errorData.errors)) {
          throw new Error(errorData.errors.join(', '));
        }
        throw new Error(errorData.message || 'Données invalides');
      }
      
      throw new Error('Erreur lors du changement de mot de passe');
    }
  }

  // Méthode pour obtenir l'utilisateur connecté (simulation)
  getConnectedUser() {
    // Cette méthode devrait être implémentée selon votre logique d'authentification
    return {
      entreprise: {
        id: 1 // Valeur par défaut
      }
    };
  }
}

export { UserService };
