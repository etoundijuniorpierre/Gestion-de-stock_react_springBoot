import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import SidebarNav from '../../components/sidebar-nav/sidebar-nav';
import DashboardHeader from '../../components/dashboard-header/dashboard-header';
import VueEnsemble from '../page-vue-ensemble/vue-ensemble';
import Statistiques from '../page-statistiques/statistiques';
import Article from '../page-articles/article/article';
import NouvelArticle from '../page-articles/nouvel-article/nouvel-articles';
import MouvementsStocks from '../mouvements-stocks/mouvements-stocks';
import Clients from '../page-clients/clients';
import Fournisseurs from '../page-fournisseurs/fournisseurs';
import NouveauClient from '../../components/nouveau-client/nouveau-client';
import NouveauFournisseur from '../../components/nouveau-fournisseur/nouveau-fournisseur';
import PageCategories from '../page-categories/page-categories';
import NouvelleCategorie from '../page-categories/nouvelle-categorie';
import CategorieDetails from '../page-categories/categorie-details';
import PageUtilisateur from '../page-utilisateur/page-utilisateur';
import NouvelUtilisateur from '../page-utilisateur/nouvel-utilisateur';
import UtilisateurDetails from '../page-utilisateur/utilisateur-details';
import CommandesClients from '../page-commandes-clients/commandes-clients';
import CommandesFournisseurs from '../page-commandes-fournisseurs/commandes-fournisseurs';
import NouvelleCommandeFrs from '../../components/nouveau-cmd-frs/nouveau-cmd-frs';
import NouvelleCommandeClt from '../../components/nouveau-cmd-clt/nouveau-cmd-clt';
import ChangerMotPasse from '../profil/changer-mot-passe/changer-mot-passe';
import DebugDelete from '../../components/debug-delete/debug-delete';
import AuthTest from '../../components/auth-test/auth-test';
import RouteDebug from '../../components/route-debug/route-debug';
import TestRouteSimple from '../../components/test-route-simple/test-route-simple';
import RouteTest from '../../components/route-test/route-test';

import "./dashboard.scss";

export default function Dashboard() {
    const location = useLocation();
    
    return(
        <div className="dashboard-container">
            {/* Navigation latérale */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h4>Gestion de Stock</h4>
                    <div className="subtitle">Groupe-F</div>
                </div>
                <div className="sidebar-menu">
                    <SidebarNav />
                </div>
            </aside>
            
            {/* Contenu principal */}
            <main className="main-content">
                {/* Header */}
                <DashboardHeader />
                
                {/* Zone de contenu */}
                <div className="content-area">
                    <div className="content-card">
                        <Routes>
                            <Route path="" element={<VueEnsemble />} />
                            <Route path="vue-ensemble" element={<VueEnsemble />} />
                            <Route path="statistiques" element={<Statistiques />} />
                            <Route path="nouvel-article" element={<NouvelArticle />} />
                            <Route path="article" element={<Article />} />
                            <Route path="mouvements-stocks" element={<MouvementsStocks />} />
                            <Route path="clients" element={<Clients />} />
                            <Route path="nouveauclient" element={<NouveauClient />} />
                            <Route path="nouveauclient/:id" element={<NouveauClient />} />
                            <Route path="fournisseurs" element={<Fournisseurs />} />
                            <Route path="nouveaufournisseur" element={<NouveauFournisseur />} />
                            <Route path="nouveaufournisseur/:id" element={<NouveauFournisseur />} />
                            <Route path="categories" element={<PageCategories />} />
                            <Route path="nouvellecategorie" element={<NouvelleCategorie />} />
                            <Route path="nouvellecategorie/:id" element={<NouvelleCategorie />} />
                            <Route path="categorie-details/:id" element={<CategorieDetails />} />
                            <Route path="utilisateurs" element={<PageUtilisateur />} />
                            <Route path="nouvelutilisateur" element={<NouvelUtilisateur />} />
                            <Route path="nouvelutilisateur/:id" element={<NouvelUtilisateur />} />
                            <Route path="utilisateur-details/:id" element={<UtilisateurDetails />} />
                            <Route path="commandes-clients" element={<CommandesClients />} />
                            <Route path="commandes-fournisseurs" element={<CommandesFournisseurs />} />
                            <Route path="nouvellecommandefrs" element={<NouvelleCommandeFrs />} />
                            <Route path="nouvellecommandefrs/:id" element={<NouvelleCommandeFrs />} />
                            <Route path="nouvellecommandectl" element={<NouvelleCommandeClt />} />
                            <Route path="nouvellecommandectl/:id" element={<NouvelleCommandeClt />} />
                            <Route path="changer-mot-passe" element={<ChangerMotPasse />} />
                            <Route path="debug-delete" element={<DebugDelete />} />
                            <Route path="auth-test" element={<AuthTest />} />
                            <Route path="route-debug" element={<RouteDebug />} />
                            <Route path="test-route-simple" element={<TestRouteSimple />} />
                            <Route path="route-test" element={<RouteTest />} />
                            {/* Route de débogage temporaire */}
                            <Route path="debug-route/:path" element={<RouteDebug />} />
                            {/* Route catch-all supprimée pour éviter les redirections automatiques */}
                        </Routes>
                    </div>
                </div>
            </main>
        </div>
    )
}