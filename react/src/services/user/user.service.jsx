import httpInterceptor from '../http-interceptor';

// Service React pur pour la gestion des utilisateurs
class UserService {

  // Récupérer tous les utilisateurs
  async findAll() {
    try {
      const data = await httpInterceptor.get('/api/gestionDeStock/utilisateurs/all');
      // Si la réponse est un tableau, on le retourne tel quel
      if (Array.isArray(data)) {
        return data;
      }
      // Sinon, on essaie d'extraire le tableau de la réponse
      return data?.content || data?.data || [data] || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      return [];
    }
  }

  // Récupérer un utilisateur par ID
  async findById(id) {
    try {
      return await httpInterceptor.get(`/api/gestionDeStock/utilisateurs/${id}`);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return {};
    }
  }

  // Sauvegarder un utilisateur
  async save(utilisateur) {
    try {
      return await httpInterceptor.post('/api/gestionDeStock/utilisateurs/create', utilisateur);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'utilisateur:', error);
      throw error;
    }
  }

  // Mettre à jour un utilisateur
  async update(id, utilisateur) {
    try {
      // D'après swagger.json, l'endpoint create peut être utilisé pour créer ET modifier
      // On ajoute l'ID à l'utilisateur pour la modification
      const utilisateurAvecId = { ...utilisateur, id };
      return await httpInterceptor.post('/api/gestionDeStock/utilisateurs/create', utilisateurAvecId);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      throw error;
    }
  }

  // Supprimer un utilisateur
  async delete(id) {
    try {
      await httpInterceptor.delete(`/api/gestionDeStock/utilisateurs/delete/${id}`);
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      return { success: false, error };
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
      
      return { 
        success: false, 
        error: `Changement de mot de passe échoué: ${error.message}`,
        status: error.status || 'unknown',
        details: {
          endpoint: '/api/gestionDeStock/utilisateurs/update/password',
          data: changerMotDePasseDto
        }
      };
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
