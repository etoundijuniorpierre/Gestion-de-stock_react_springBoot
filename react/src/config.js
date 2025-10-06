// Configuration de l'application
export const config = {
  // URL de l'API Spring Boot
  API_BASE_URL: 'http://localhost:8085',
  
  // Configuration des endpoints
  API_ENDPOINTS: {
    ARTICLES: '/gestionDeStock/articles',
    CATEGORIES: '/gestionDeStock/categories',
    COMMANDES_CLIENTS: '/gestionDeStock/commandesclients',
    COMMANDES_FOURNISSEURS: '/gestionDeStock/commandefournisseurs',
    UTILISATEURS: '/gestionDeStock/utilisateurs',
    CLIENTS: '/gestionDeStock/clients',
    FOURNISSEURS: '/gestionDeStock/fournisseurs',
    AUTHENTIFICATION: '/gestionDeStock/auth'
  }
};

export default config;
  