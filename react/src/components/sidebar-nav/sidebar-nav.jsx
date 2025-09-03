import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const SidebarNav = () => {
  const location = useLocation();

  const navItems = [
    {
      path: '/dashboard',
      icon: 'fas fa-home',
      text: 'Vue d\'ensemble',
      exact: true
    },
    {
      path: '/dashboard/statistiques',
      icon: 'fas fa-chart-bar',
      text: 'Statistiques'
    },
    {
      path: '/dashboard/article',
      icon: 'fas fa-box',
      text: 'Articles'
    },
    {
      path: '/dashboard/nouvel-article',
      icon: 'fas fa-plus-circle',
      text: 'Nouvel Article'
    },
    {
      path: '/dashboard/mouvements-stocks',
      icon: 'fas fa-exchange-alt',
      text: 'Mouvements Stocks'
    },
    {
      path: '/dashboard/clients',
      icon: 'fas fa-users',
      text: 'Clients'
    },
    {
      path: '/dashboard/nouveauclient',
      icon: 'fas fa-user-plus',
      text: 'Nouveau Client'
    },
    {
      path: '/dashboard/fournisseurs',
      icon: 'fas fa-truck',
      text: 'Fournisseurs'
    },
    {
      path: '/dashboard/nouveaufournisseur',
      icon: 'fas fa-truck-loading',
      text: 'Nouveau Fournisseur'
    },
    {
      path: '/dashboard/categories',
      icon: 'fas fa-tags',
      text: 'Catégories'
    },
    {
      path: '/dashboard/nouvellecategorie',
      icon: 'fas fa-tag',
      text: 'Nouvelle Catégorie'
    },
    {
      path: '/dashboard/utilisateurs',
      icon: 'fas fa-user-cog',
      text: 'Utilisateurs'
    },
    {
      path: '/dashboard/nouvelutilisateur',
      icon: 'fas fa-user-plus',
      text: 'Nouvel Utilisateur'
    },
    {
      path: '/dashboard/commandes-clients',
      icon: 'fas fa-shopping-cart',
      text: 'Commandes Clients'
    },
    {
      path: '/dashboard/commandes-fournisseurs',
      icon: 'fas fa-truck-loading',
      text: 'Commandes Fournisseurs'
    },
    {
      path: '/dashboard/changer-mot-passe',
      icon: 'fas fa-key',
      text: 'Changer Mot de Passe'
    }
  ];

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <nav className="sidebar-nav">
      <ul className="nav-menu">
        {navItems.map((item, index) => (
          <li key={index} className="nav-item">
            <NavLink
              to={item.path}
              className={`nav-link ${isActive(item) ? 'active' : ''}`}
            >
              <i className={`nav-icon ${item.icon}`}></i>
              <span className="nav-text">{item.text}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SidebarNav;
