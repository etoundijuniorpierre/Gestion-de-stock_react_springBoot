// Script de migration pour mettre à jour tous les services avec la configuration centralisée
// Ce fichier est temporaire et sera supprimé après la migration

import { API_CONFIG, buildApiUrlWithParam } from './config/api.config.js';

// Mapping des anciens endpoints vers les nouveaux
const ENDPOINT_MAPPING = {
  // Clients et Fournisseurs
  '/api/gestionDeStock/clients/all': API_CONFIG.ENDPOINTS.CLIENTS.ALL,
  '/api/gestionDeStock/clients': API_CONFIG.ENDPOINTS.CLIENTS.BY_ID,
  '/api/gestionDeStock/clients/create': API_CONFIG.ENDPOINTS.CLIENTS.CREATE,
  '/api/gestionDeStock/clients/delete': API_CONFIG.ENDPOINTS.CLIENTS.DELETE,
  
  '/api/gestionDeStock/fournisseurs/all': API_CONFIG.ENDPOINTS.FOURNISSEURS.ALL,
  '/api/gestionDeStock/fournisseurs': API_CONFIG.ENDPOINTS.FOURNISSEURS.BY_ID,
  '/api/gestionDeStock/fournisseurs/create': API_CONFIG.ENDPOINTS.FOURNISSEURS.CREATE,
  '/api/gestionDeStock/fournisseurs/delete': API_CONFIG.ENDPOINTS.FOURNISSEURS.DELETE,
  
  // Commandes
  '/api/gestionDeStock/commandesclients/all': API_CONFIG.ENDPOINTS.COMMANDES_CLIENTS.ALL,
  '/api/gestionDeStock/commandesclients': API_CONFIG.ENDPOINTS.COMMANDES_CLIENTS.BY_ID,
  '/api/gestionDeStock/commandesclients/create': API_CONFIG.ENDPOINTS.COMMANDES_CLIENTS.CREATE,
  '/api/gestionDeStock/commandesclients/delete': API_CONFIG.ENDPOINTS.COMMANDES_CLIENTS.DELETE,
  '/api/gestionDeStock/commandesclients/lignesCommande': API_CONFIG.ENDPOINTS.COMMANDES_CLIENTS.LIGNES_COMMANDE,
  
  '/api/gestionDeStock/commandesfournisseurs/all': API_CONFIG.ENDPOINTS.COMMANDES_FOURNISSEURS.ALL,
  '/api/gestionDeStock/commandesfournisseurs': API_CONFIG.ENDPOINTS.COMMANDES_FOURNISSEURS.BY_ID,
  '/api/gestionDeStock/commandesfournisseurs/create': API_CONFIG.ENDPOINTS.COMMANDES_FOURNISSEURS.CREATE,
  '/api/gestionDeStock/commandesfournisseurs/delete': API_CONFIG.ENDPOINTS.COMMANDES_FOURNISSEURS.DELETE,
  '/api/gestionDeStock/commandesfournisseurs/lignesCommande': API_CONFIG.ENDPOINTS.COMMANDES_FOURNISSEURS.LIGNES_COMMANDE,
  
  // Mouvements de Stock
  '/api/gestionDeStock/mvtstk/entree': API_CONFIG.ENDPOINTS.MOUVEMENTS_STOCK.ENTREE,
  '/api/gestionDeStock/mvtstk/sortie': API_CONFIG.ENDPOINTS.MOUVEMENTS_STOCK.SORTIE,
  '/api/gestionDeStock/mvtstk/correctionpos': API_CONFIG.ENDPOINTS.MOUVEMENTS_STOCK.CORRECTION_POS,
  '/api/gestionDeStock/mvtstk/correctionneg': API_CONFIG.ENDPOINTS.MOUVEMENTS_STOCK.CORRECTION_NEG,
  '/api/gestionDeStock/mvtstk/filter/article': API_CONFIG.ENDPOINTS.MOUVEMENTS_STOCK.FILTER_BY_ARTICLE,
  '/api/gestionDeStock/mvtstk/stockreel': API_CONFIG.ENDPOINTS.MOUVEMENTS_STOCK.STOCK_REEL,
  
  // Photos
  '/api/gestionDeStock/photos/save': API_CONFIG.ENDPOINTS.PHOTOS.SAVE,
  '/api/gestionDeStock/photos': API_CONFIG.ENDPOINTS.PHOTOS.GET,
  
  // Register Service
  '/api/gestionDeStock/entreprises/create': API_CONFIG.ENDPOINTS.ENTREPRISES.CREATE
};

console.log('🚀 Script de migration des services créé');
console.log('📋 Endpoints à migrer:', Object.keys(ENDPOINT_MAPPING).length);
console.log('🔧 Utilisez ce mapping pour mettre à jour vos services');

export { ENDPOINT_MAPPING };
