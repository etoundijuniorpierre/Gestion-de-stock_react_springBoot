// Configuration centralisée de l'API
export const API_CONFIG = {
  // URL de base du serveur backend Spring Boot
  BASE_URL: 'http://localhost:8080',
  
  // Endpoints de l'API
  ENDPOINTS: {
    // Authentification
    AUTH: {
      LOGIN: '/api/gestionDeStock/auth/authenticate',
      LOGOUT: '/api/gestionDeStock/auth/logout',
      REFRESH: '/api/gestionDeStock/auth/refresh'
    },
    
    // Utilisateurs
    UTILISATEURS: {
      ALL: '/api/gestionDeStock/utilisateurs/all',
      BY_ID: '/api/gestionDeStock/utilisateurs',
      CREATE: '/api/gestionDeStock/utilisateurs/create',
      UPDATE: '/api/gestionDeStock/utilisateurs/update',
      DELETE: '/api/gestionDeStock/utilisateurs/delete',
      FIND_BY_EMAIL: '/api/gestionDeStock/utilisateurs/find',
      UPDATE_PASSWORD: '/api/gestionDeStock/utilisateurs/update/password'
    },
    
    // Entreprises
    ENTREPRISES: {
      ALL: '/api/gestionDeStock/entreprises/all',
      BY_ID: '/api/gestionDeStock/entreprises',
      CREATE: '/api/gestionDeStock/entreprises/create',
      UPDATE: '/api/gestionDeStock/entreprises/update',
      DELETE: '/api/gestionDeStock/entreprises/delete'
    },
    
    // Catégories
    CATEGORIES: {
      ALL: '/api/gestionDeStock/categories/all',
      BY_ID: '/api/gestionDeStock/categories',
      CREATE: '/api/gestionDeStock/categories/create',
      UPDATE: '/api/gestionDeStock/categories/update',
      DELETE: '/api/gestionDeStock/categories/delete',
      FILTER: '/api/gestionDeStock/categories/filter'
    },
    
    // Articles
    ARTICLES: {
      ALL: '/api/gestionDeStock/articles/all',
      BY_ID: '/api/gestionDeStock/articles',
      CREATE: '/api/gestionDeStock/articles/create',
      UPDATE: '/api/gestionDeStock/articles', // PUT /api/gestionDeStock/articles/{id}
      DELETE: '/api/gestionDeStock/articles/delete',
      FILTER: '/api/gestionDeStock/articles/filter'
    },
    
    // Mouvements de stock
    MOUVEMENTS_STOCK: {
      ENTREE: '/api/gestionDeStock/mvtstk/entree',
      SORTIE: '/api/gestionDeStock/mvtstk/sortie',
      CORRECTION_POSITIVE: '/api/gestionDeStock/mvtstk/correctionpos',
      CORRECTION_NEGATIVE: '/api/gestionDeStock/mvtstk/correctionneg',
      STOCK_REEL: '/api/gestionDeStock/mvtstk/stockreel',
      FILTER_ARTICLE: '/api/gestionDeStock/mvtstk/filter/article'
    },
    
    // Clients
    CLIENTS: {
      ALL: '/api/gestionDeStock/clients/all',
      BY_ID: '/api/gestionDeStock/clients',
      CREATE: '/api/gestionDeStock/clients/create',
      UPDATE: '/api/gestionDeStock/clients',
      DELETE: '/api/gestionDeStock/clients/delete'
    },
    
    // Fournisseurs
    FOURNISSEURS: {
      ALL: '/api/gestionDeStock/fournisseurs/all',
      BY_ID: '/api/gestionDeStock/fournisseurs',
      CREATE: '/api/gestionDeStock/fournisseurs/create',
      UPDATE: '/api/gestionDeStock/fournisseurs/update',
      DELETE: '/api/gestionDeStock/fournisseurs/delete'
    },
    
    // Commandes Clients
    COMMANDES_CLIENTS: {
      ALL: '/api/gestionDeStock/commandesclients/all',
      BY_ID: '/api/gestionDeStock/commandesclients',
      CREATE: '/api/gestionDeStock/commandesclients/create',
      UPDATE: '/api/gestionDeStock/commandesclients/update',
      DELETE: '/api/gestionDeStock/commandesclients/delete',
      LIGNES_COMMANDE: '/api/gestionDeStock/commandesclients/lignesCommande'
    },
    
    // Commandes Fournisseurs
    COMMANDES_FOURNISSEURS: {
      ALL: '/api/gestionDeStock/commandesfournisseurs/all',
      BY_ID: '/api/gestionDeStock/commandesfournisseurs',
      CREATE: '/api/gestionDeStock/commandesfournisseurs/create',
      UPDATE: '/api/gestionDeStock/commandesfournisseurs/update',
      DELETE: '/api/gestionDeStock/commandesfournisseurs/delete',
      LIGNES_COMMANDE: '/api/gestionDeStock/commandesfournisseurs/lignesCommande'
    },
    
    // Photos
    PHOTOS: {
      SAVE: '/api/gestionDeStock/photos/save',
      GET: '/api/gestionDeStock/photos',
      DELETE: '/api/gestionDeStock/photos'
    }
  },
  
  // Configuration des timeouts
  TIMEOUTS: {
    REQUEST: 30000, // 30 secondes
    AUTH_REFRESH: 5000 // 5 secondes
  },
  
  // Configuration des retry
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000 // 1 seconde
  }
};

// Fonction utilitaire pour construire une URL complète
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Fonction utilitaire pour construire une URL avec paramètre
export const buildApiUrlWithParam = (endpoint, param) => {
  return `${API_CONFIG.BASE_URL}${endpoint}/${param}`;
};

export default API_CONFIG;
