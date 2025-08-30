import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MenuHook } from './menuElem';
import './menu.css';

export default function Menu() {
    const { menuProperties } = MenuHook();
    const [expandedMenus, setExpandedMenus] = useState(new Set());
    const location = useLocation();
    const navigate = useNavigate();

    const toggleMenu = (menuId) => {
        const newExpanded = new Set(expandedMenus);
        if (newExpanded.has(menuId)) {
            newExpanded.delete(menuId);
        } else {
            newExpanded.add(menuId);
        }
        setExpandedMenus(newExpanded);
    };

    // Fonction pour vérifier si un lien est actif
    const isActive = (url) => {
        return location.pathname === `/dashboard/${url}` || location.pathname === `/${url}`;
    };

    // Fonction de navigation
    const handleMenuClick = (url, event) => {
        // Empêcher le comportement par défaut
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        console.log('🔗 Navigation vers:', `/dashboard/${url}`);
        console.log('📍 URL actuelle avant navigation:', location.pathname);
        
        try {
            navigate(`/dashboard/${url}`);
            console.log('✅ Navigation réussie vers:', `/dashboard/${url}`);
        } catch (error) {
            console.error('❌ Erreur de navigation:', error);
        }
    };

    return (
        <div className="accordion" id="appMenuAccordion">
            {menuProperties.map((menu) => (
                <div className="card border-0" key={menu.id}>
                    <div className="card-header bg-transparent border-0" id={`menu${menu.id}`}>
                        <h2 className="mb-0">
                            <button 
                                className="btn btn-link btn-block text-left text-primary-transparent text-decoration-none w-100 text-s-50" 
                                type="button" 
                                data-bs-toggle="collapse" 
                                data-bs-target={`#collapse${menu.id}`}
                                aria-expanded={expandedMenus.has(menu.id)}
                                aria-controls={`collapse${menu.id}`}
                                onClick={() => toggleMenu(menu.id)}
                            >
                                <i className={`${menu.icon} me-2`}></i>
                                {menu.titre}
                            </button>
                        </h2>
                    </div>
                
                    <div 
                        id={`collapse${menu.id}`} 
                        className={`collapse ${expandedMenus.has(menu.id) ? 'show' : ''}`}
                        aria-labelledby={`menu${menu.id}`} 
                        data-bs-parent="#appMenuAccordion"
                    >
                        <div className="card-body p-0">
                            <ul className="list-group list-group-flush">
                                {menu.sousMenu.map((sousMenu) => (
                                    <li 
                                        className={`list-group-item border-0 ${isActive(sousMenu.url) ? 'text-white bg-primary' : 'bg-transparent'}`}
                                        key={sousMenu.id}
                                    >
                                        <div 
                                            onClick={(event) => handleMenuClick(sousMenu.url, event)}
                                            className={`text-decoration-none ${isActive(sousMenu.url) ? 'text-white' : 'text-dark'}`}
                                            style={{ 
                                                display: 'block', 
                                                padding: '8px 16px', 
                                                cursor: 'pointer',
                                                userSelect: 'none'
                                            }}
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter' || event.key === ' ') {
                                                    handleMenuClick(sousMenu.url, event);
                                                }
                                            }}
                                        >
                                            <i className={`${sousMenu.icon} me-2`}></i>
                                            {sousMenu.titre}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}