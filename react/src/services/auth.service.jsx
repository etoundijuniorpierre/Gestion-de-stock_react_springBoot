import httpInterceptor from './http-interceptor';

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
      const data = await httpInterceptor.post('/gestionDeStock/auth/authenticate', authRequest);
      
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
      return false;
    }
  }

  // Déconnexion
  async logout() {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await httpInterceptor.post('/gestionDeStock/auth/logout');
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
      this.isAuthenticated = false;
    }
  }

  // Vérifier si l'utilisateur est connecté
  isLoggedIn() {
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
