import React, { useState, useEffect } from 'react';
import { NavLink, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Menu from '../../components/menu/menu';
import VueEnsemble from '../page-vue-ensemble/vue-ensemble';
import Statistiques from '../page-statistiques/statistiques';
import Article from '../page-articles/article/article';
import NouvelArticle from '../page-articles/nouvel-article/nouvel-articles';
import MouvementsStocks from '../mouvements-stocks/mouvements-stocks';
import Clients from '../page-clients/clients';
import Fournisseurs from '../page-fournisseurs/fournisseurs';
import PageCategories from '../page-categories/page-categories';
import NouvelleCategorie from '../page-categories/nouvelle-categorie';
import PageUtilisateur from '../page-utilisateur/page-utilisateur';
import NouvelUtilisateur from '../page-utilisateur/nouvel-utilisateur';
import CommandesClients from '../page-commandes-clients/commandes-clients';
import CommandesFournisseurs from '../page-commandes-fournisseurs/commandes-fournisseurs';
import ChangerMotPasse from '../profil/changer-mot-passe/changer-mot-passe';
import Header from '../../components/header/header';
import "./dashboard.css";


export default function Dashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    
    useEffect(() => {
        console.log('Dashboard - URL actuelle:', location.pathname);
    }, [location.pathname]);
    
    const testNavigation = () => {
        console.log('🧪 Test de navigation vers commandes-clients');
        navigate('/dashboard/commandes-clients');
    };
    
    return(
        <div className="main-container">
          <div className="row min-height-600 no-flex-wrap">
            <div className="card col-md-2 mr-2">
              <div className="col pl-0 pr-0">
                <div className="card mt-3 mb-2 border-none text-center">
                  <h4>Gestion de stock</h4>
                  <small className="form-text text-muted">Groupe-F</small>
                </div>
                <div>
                  <Menu />
                </div>
              </div>
            </div>
            <div className="card col-md-10 pl-0 pr-0 backgroung-grey border-none">
              <div className="col pl-0 pr-0 d-flex flex-column justify-content-between">
                <div className="card p-3 max-height-80 mb-2" style={{height: "80px"}}>
                  <Header />
                  <div className="mt-2">
                    <small className="text-muted">URL actuelle: {location.pathname}</small>
                    <br />
                    <small className="text-info">Debug: Dashboard component rendu</small>
                    <br />
                    <button 
                        onClick={testNavigation}
                        className="btn btn-sm btn-warning"
                        style={{ fontSize: '10px', padding: '2px 6px' }}
                    >
                        🧪 Test Navigation
                    </button>
                  </div>
                </div>
                <div className="main card mb-2 " style={{ minHeight: '480px' }}>
                  <Routes>
                    <Route path="" element={<VueEnsemble />} />
                    <Route path="vue-ensemble" element={<VueEnsemble />} />
                    <Route path="statistiques" element={<Statistiques />} />
                    <Route path="nouvel-article" element={<NouvelArticle />} />
                    <Route path="article" element={<Article />} />
                    <Route path="mouvements-stocks" element={<MouvementsStocks />} />
                    <Route path="clients" element={<Clients />} />
                    <Route path="fournisseurs" element={<Fournisseurs />} />
                    <Route path="categories" element={<PageCategories />} />
                    <Route path="nouvellecategorie" element={<NouvelleCategorie />} />
                    <Route path="nouvellecategorie/:id" element={<NouvelleCategorie />} />
                    <Route path="utilisateurs" element={<PageUtilisateur />} />
                    <Route path="nouvelutilisateur" element={<NouvelUtilisateur />} />
                    <Route path="nouvelutilisateur/:id" element={<NouvelUtilisateur />} />
                    <Route path="commandes-clients" element={<CommandesClients />} />
                    <Route path="commandes-fournisseurs" element={<CommandesFournisseurs />} />
                    <Route path="changer-mot-passe" element={<ChangerMotPasse />} />
                    <Route path="*" element={<VueEnsemble />} />
                  </Routes>
                </div>
                <div className="card min-height-80">
                  footer
                </div>
              </div>
            </div>
          </div>
        </div>
    )
}