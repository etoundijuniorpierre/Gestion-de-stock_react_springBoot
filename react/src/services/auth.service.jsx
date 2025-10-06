import httpInterceptor from './http-interceptor';
import { API_CONFIG } from '../config/api.config.js';

class AuthService {
  constructor() {
    this.isAuthenticated = false;
    this.checkAuthStatus();
  }

  // Vérifier le statut d'authentification au démarrage
  checkAuthStatus() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      this.isAuthenticated = !!token;
    }
  }

  // Connexion
  async login(email, password) {
    if (!email || !password) {
      return false;
    }

    const authRequest = {
      login: email,
      password: password
    };

    try {
      const data = await httpInterceptor.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, authRequest);
      
      if (data.accessToken) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken || '');
          localStorage.setItem('user', JSON.stringify(data.user || { email }));
        }
        this.isAuthenticated = true;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur d\'authentification:', error);
      // Make sure to properly set isAuthenticated to false on login failure
      this.isAuthenticated = false;
      return false;
    }
  }

  // Déconnexion - Updated to use the new dedicated logout endpoint
  async logout() {
    try {
      // Get the current token before removing it
      const token = localStorage.getItem('token');
      
      // Remove all auth-related items from localStorage first
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('connectedUser');
        localStorage.removeItem('id');
        localStorage.removeItem('idUser');
        localStorage.removeItem('entrepriseId');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
      }
      
      this.isAuthenticated = false;
      
      // Only try to call logout endpoint if we have a token
      if (token) {
        try {
          // Call the new dedicated logout endpoint
          await httpInterceptor.post('/api/gestionDeStock/logout', {}, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          console.log('✅ Backend logout endpoint called successfully');
        } catch (error) {
          // If logout endpoint fails, it's not critical since we've already cleaned localStorage
          console.log('⚠️ Backend logout endpoint call failed (but localStorage cleaned):', error.message);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Even if there's an error, make sure we still clean up
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('connectedUser');
        localStorage.removeItem('id');
        localStorage.removeItem('idUser');
        localStorage.removeItem('entrepriseId');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
      }
      this.isAuthenticated = false;
    }
  }

  // Vérifier si l'utilisateur est connecté
  isLoggedIn() {
    // Always check the current state of localStorage, not just the cached value
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      this.isAuthenticated = !!token;
    }
    return this.isAuthenticated;
  }

  // Obtenir le token d'authentification
  getAuthToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  // Obtenir l'utilisateur connecté
  getUser() {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  // Observable pour la compatibilité (simulation)
  get isAuthenticated$() {
    return {
      subscribe: (callback) => {
        callback(this.isAuthenticated);
        return {
          unsubscribe: () => {}
        };
      }
    };
  }
}

export { AuthService };