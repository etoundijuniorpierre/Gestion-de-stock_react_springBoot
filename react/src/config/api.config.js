// Configuration centralisée de l'API
export const API_CONFIG = {
  // URL de base du serveur backend Spring Boot
  BASE_URL: 'http://localhost:8085',
  
  // Endpoints de l'API
  ENDPOINTS: {
    // Authentification
    AUTH: {
      LOGIN: '/api/gestionDeStock/auth/authenticate',
      LOGOUT: '/api/gestionDeStock/logout',
      REFRESH: '/api/gestionDeStock/auth/refresh'
    },
    
    // Utilisateurs
    UTILISATEURS: {
      ALL: '/api/gestionDeStock/utilisateurs/all',
      BY_ID: '/api/gestionDeStock/utilisateurs',
      CREATE: '/api/gestionDeStock/utilisateurs/create',
      UPDATE: '/api/gestionDeStock/utilisateurs/update/{id}',
      DELETE: '/api/gestionDeStock/utilisateurs/delete/{id}',
      FIND_BY_EMAIL: '/api/gestionDeStock/utilisateurs/find/{email}',
      UPDATE_PASSWORD: '/api/gestionDeStock/utilisateurs/update/password'
    },
    
    // Entreprises
    ENTREPRISES: {
      ALL: '/api/gestionDeStock/entreprises/all',
      BY_ID: '/api/gestionDeStock/entreprises/{idEntreprise}',
      CREATE: '/api/gestionDeStock/entreprises/create',
      UPDATE: '/api/gestionDeStock/entreprises/{id}',
      DELETE: '/api/gestionDeStock/entreprises/delete/{idEntreprise}'
    },
    
    // Catégories
    CATEGORIES: {
      ALL: '/api/gestionDeStock/categories/all',
      BY_ID: '/api/gestionDeStock/categories/{idCategorie}',
      CREATE: '/api/gestionDeStock/categories/create',
      UPDATE: '/api/gestionDeStock/categories/{idCategorie}',
      DELETE: '/api/gestionDeStock/categories/delete/{idCategorie}',
      FILTER: '/api/gestionDeStock/categories/filter/{codeCategorie}'
    },
    
    // Articles
    ARTICLES: {
      ALL: '/api/gestionDeStock/articles/all',
      BY_ID: '/api/gestionDeStock/articles/{idArticle}',
      CREATE: '/api/gestionDeStock/articles/create',
      UPDATE: '/api/gestionDeStock/articles/{idArticle}',
      DELETE: '/api/gestionDeStock/articles/delete/{idArticle}',
      FILTER: '/api/gestionDeStock/articles/filter/{codeArticle}'
    },
    
    // Mouvements de stock
    MOUVEMENTS_STOCK: {
      ENTREE: '/api/gestionDeStock/mvtstk/entree',
      SORTIE: '/api/gestionDeStock/mvtstk/sortie',
      CORRECTION_POSITIVE: '/api/gestionDeStock/mvtstk/correctionpos',
      CORRECTION_NEGATIVE: '/api/gestionDeStock/mvtstk/correctionneg',
      STOCK_REEL: '/api/gestionDeStock/mvtstk/stockreel',
      FILTER_ARTICLE: '/api/gestionDeStock/mvtstk/article/{idArticle}'
    },
    
    // Clients
    CLIENTS: {
      ALL: '/api/gestionDeStock/clients/all',
      BY_ID: '/api/gestionDeStock/clients/{idClient}',
      CREATE: '/api/gestionDeStock/clients/create',
      UPDATE: '/api/gestionDeStock/clients/{id}',
      DELETE: '/api/gestionDeStock/clients/delete/{idClient}'
    },
    
    // Fournisseurs
    FOURNISSEURS: {
      ALL: '/api/gestionDeStock/fournisseurs/all',
      BY_ID: '/api/gestionDeStock/fournisseurs/{idFournisseur}',
      CREATE: '/api/gestionDeStock/fournisseurs/create',
      UPDATE: '/api/gestionDeStock/fournisseurs/{id}',
      DELETE: '/api/gestionDeStock/fournisseurs/delete/{idFournisseur}'
    },
    
    // Commandes Clients
    COMMANDES_CLIENTS: {
      ALL: '/api/gestionDeStock/commandesclients/all',
      BY_ID: '/api/gestionDeStock/commandesclients/{idCommandeClient}',
      CREATE: '/api/gestionDeStock/commandesclients/create',
      UPDATE: '/api/gestionDeStock/commandesclients/{idCommande}',
      DELETE: '/api/gestionDeStock/commandesclients/delete/{idCommandeClient}',
      LIGNES_COMMANDE: '/api/gestionDeStock/commandesclients/lignesCommande/{idCommande}',
      UPDATE_ETAT: '/api/gestionDeStock/commandesclients/update/etat/{idCommande}/{etatCommande}'
    },
    
    // Commandes Fournisseurs
    COMMANDES_FOURNISSEURS: {
      ALL: '/api/gestionDeStock/commandesfournisseurs/all',
      BY_ID: '/api/gestionDeStock/commandesfournisseurs/{idCommandeFournisseur}',
      CREATE: '/api/gestionDeStock/commandesfournisseurs/create',
      UPDATE: '/api/gestionDeStock/commandesfournisseurs/{idCommande}',
      DELETE: '/api/gestionDeStock/commandesfournisseurs/delete/{idCommandeFournisseur}',
      LIGNES_COMMANDE: '/api/gestionDeStock/commandesfournisseurs/lignesCommande/{idCommande}',
      UPDATE_ETAT: '/api/gestionDeStock/commandesfournisseurs/update/etat/{idCommande}/{etatCommande}'
    },
    
    // Photos
    PHOTOS: {
      SAVE: '/api/gestionDeStock/photos/{id}/{title}/{context}',
      GET: '/api/gestionDeStock/photos/download/{fileName}',
      DELETE: '/api/gestionDeStock/photos/{id}'
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
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  console.log(`[API] Building URL: ${url} from endpoint: ${endpoint}`);
  return url;
};

// Fonction utilitaire pour construire une URL avec paramètre
export const buildApiUrlWithParam = (endpoint, param) => {
  // Si l'endpoint contient déjà un placeholder, on le remplace
  if (endpoint.includes('{')) {
    const url = `${API_CONFIG.BASE_URL}${endpoint.replace(/{[^}]+}/, param)}`;
    console.log(`[API] Building URL with placeholder: ${url} from endpoint: ${endpoint} and param: ${param}`);
    return url;
  }
  // Sinon, on ajoute le paramètre à la fin
  const url = `${API_CONFIG.BASE_URL}${endpoint}/${param}`;
  console.log(`[API] Building URL with param: ${url} from endpoint: ${endpoint} and param: ${param}`);
  return url;
};

// Fonction utilitaire pour construire une URL avec deux paramètres
export const buildApiUrlWithTwoParams = (endpoint, param1, param2) => {
  let url = `${API_CONFIG.BASE_URL}${endpoint}`;
  // Remplacer les placeholders dans l'ordre avec g pour remplacer toutes les occurrences
  url = url.replace(/{idCommande}/g, param1);
  url = url.replace(/{etatCommande}/g, param2);
  console.log(`[API] Building URL with two params: ${url} from endpoint: ${endpoint}, param1: ${param1}, param2: ${param2}`);
  return url;
};

export default API_CONFIG;