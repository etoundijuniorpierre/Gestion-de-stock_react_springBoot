// Intercepteur HTTP pour gérer l'authentification
class HttpInterceptor {
  constructor() {
    // Utiliser directement l'URL du serveur Spring Boot
    this.baseURL = 'http://localhost:8080';
    console.log('🚀 HttpInterceptor initialisé avec l\'URL de base:', this.baseURL);
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
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    
    // Debug: afficher les détails de la requête
    console.log('🌐 Requête HTTP:', {
      method: config.method,
      url: fullUrl,
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
        if (url.includes('/auth/login')) {
          console.log('🔐 Endpoint de login - 403 détecté, pas de redirection automatique');
          throw new Error(`Erreur d'authentification: ${response.status} - Vérifiez vos identifiants ou la configuration du serveur`);
        }
        
        // Token expiré ou invalide pour les autres endpoints
        this.handleAuthError();
        throw new Error(`Erreur d'authentification: ${response.status}`);
      }
      
      // Gérer les autres erreurs HTTP
      if (!response.ok) {
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
      console.error('Erreur lors de la requête HTTP:', error);
      throw error;
    }
  }

  // Gérer les erreurs d'authentification
  handleAuthError() {
    // Supprimer les tokens expirés
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // Rediriger vers la page de connexion
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
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
      const response = await fetch(`${this.baseURL}/gestionDeStock/auth/refresh`, {
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
