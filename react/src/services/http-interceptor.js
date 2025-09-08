// Intercepteur HTTP pour gérer l'authentification
import { API_CONFIG } from '../config/api.config.js';

class HttpInterceptor {
  constructor() {
    // Utiliser la configuration centralisée de l'API
    this.baseURL = API_CONFIG.BASE_URL;
    console.log('🚀 HttpInterceptor initialisé avec BASE_URL:', this.baseURL);
    console.log('🔧 Configuration API chargée depuis api.config.js');
    
    // Flag pour éviter les appels multiples simultanés
    this.isHandlingAuthError = false;
    this.isRefreshingToken = false;
  }

  // Méthode pour ajouter le token d'authentification aux headers
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  // Méthode pour faire une requête GET
  async get(url, options = {}) {
    const config = {
      method: 'GET',
      headers: { ...this.getAuthHeaders(), ...options.headers },
      ...options
    };

    return this.makeRequest(url, config);
  }

  // Méthode pour faire une requête POST
  async post(url, data, options = {}) {
    const config = {
      method: 'POST',
      headers: { ...this.getAuthHeaders(), ...options.headers },
      body: JSON.stringify(data),
      ...options
    };

    return this.makeRequest(url, config);
  }

  // Méthode pour faire une requête PUT
  async put(url, data, options = {}) {
    const config = {
      method: 'PUT',
      headers: { ...this.getAuthHeaders(), ...options.headers },
      body: JSON.stringify(data),
      ...options
    };

    return this.makeRequest(url, config);
  }

  // Méthode pour faire une requête DELETE
  async delete(url, options = {}) {
    const config = {
      method: 'DELETE',
      headers: { ...this.getAuthHeaders(), ...options.headers },
      ...options
    };

    return this.makeRequest(url, config);
  }

  // Méthode principale pour faire la requête
  async makeRequest(url, config) {
    // Construire l'URL complète avec la BASE_URL explicite
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    
    // Debug: afficher les détails de la requête
    console.log('🌐 Requête HTTP:', {
      method: config.method,
      url: fullUrl,
      baseURL: this.baseURL,
      originalUrl: url,
      headers: config.headers,
      body: config.body
    });
    
    try {
      const response = await fetch(fullUrl, config);
      
      // Debug: afficher la réponse
      console.log('📡 Réponse HTTP:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url
      });
      
      // Gérer les erreurs d'authentification
      if (response.status === 401 || response.status === 403) {
        // Pour l'endpoint de login, ne pas rediriger automatiquement
        if (url.includes('/authenticate')) {
          console.log('🔐 Endpoint de login - 403 détecté, pas de redirection automatique');
          throw new Error(`Erreur d'authentification: ${response.status} - Vérifiez vos identifiants ou la configuration du serveur`);
        }
        
        // Vérifier si c'est une vraie erreur d'authentification ou une erreur métier
        // Si la réponse contient des détails d'erreur métier, c'est probablement pas une erreur d'auth
        try {
          const errorData = await response.clone().json();
          // Si on a des détails d'erreur métier, c'est probablement pas une erreur d'auth
          if (errorData.message || errorData.errors || errorData.error) {
            console.log('⚠️ Erreur métier détectée, pas de redirection vers login:', errorData);
            throw new Error(`Erreur métier: ${errorData.message || errorData.error || 'Erreur de validation'}`);
          }
        } catch (parseError) {
          // Si on ne peut pas parser la réponse, c'est probablement une vraie erreur d'auth
          console.log('🔐 Vraie erreur d\'authentification détectée, redirection vers login');
        }
        
        // Token expiré ou invalide pour les autres endpoints
        this.handleAuthError();
        throw new Error(`Erreur d'authentification: ${response.status}`);
      }
      
      // Gérer les autres erreurs HTTP
      if (!response.ok) {
        // Essayer de récupérer les détails de l'erreur
        try {
          const errorData = await response.clone().json();
          if (errorData.message || errorData.errors || errorData.error) {
            throw new Error(`Erreur serveur: ${errorData.message || errorData.error || 'Erreur de validation'}`);
          }
        } catch (parseError) {
          // Si on ne peut pas parser, utiliser le message par défaut
        }
        
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Vérifier si la réponse contient du contenu
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return await response.text();
      }
      
    } catch (error) {
      // Gérer spécifiquement les erreurs CORS
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        console.error('❌ Erreur CORS détectée. Vérifiez la configuration CORS du serveur backend.');
        throw new Error('Erreur CORS: Impossible de se connecter au serveur. Vérifiez que le serveur backend est démarré et que CORS est configuré.');
      }
      
      // Gérer les erreurs de réseau
      if (error.name === 'TypeError' && error.message.includes('NetworkError')) {
        console.error('❌ Erreur réseau détectée. Vérifiez la connexion au serveur.');
        throw new Error('Erreur réseau: Impossible de se connecter au serveur. Vérifiez que le serveur backend est démarré.');
      }
      
      console.error('Erreur lors de la requête HTTP:', error);
      throw error;
    }
  }

  // Gérer les erreurs d'authentification
  handleAuthError() {
    console.log('🔐 Gestion d\'erreur d\'authentification');
    
    // Vérifier si on est déjà sur la page de login
    if (window.location.pathname === '/login') {
      console.log('📍 Déjà sur la page de login, pas de redirection');
      return;
    }
    
    // Vérifier si on a un token valide
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('❌ Pas de token trouvé, redirection vers login');
      // Supprimer les tokens expirés
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      // Rediriger vers la page de connexion
      window.location.href = '/login';
    } else {
      console.log('⚠️ Token présent mais erreur d\'authentification, tentative de rafraîchissement');
      // Essayer de rafraîchir le token avant de rediriger
      this.refreshToken().then(success => {
        if (!success) {
          console.log('❌ Échec du rafraîchissement du token, redirection vers login');
          // Supprimer les tokens expirés
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          
          // Rediriger vers la page de connexion
          window.location.href = '/login';
        }
      });
    }
  }

  // Méthode pour rafraîchir le token
  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      this.handleAuthError();
      return false;
    }

    try {
      const response = await fetch(`${this.baseURL}/api/gestionDeStock/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        return true;
      } else {
        this.handleAuthError();
        return false;
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      this.handleAuthError();
      return false;
    }
  }
}

// Créer une instance unique
const httpInterceptor = new HttpInterceptor();

export default httpInterceptor;
