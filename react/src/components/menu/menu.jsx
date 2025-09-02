import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MenuHook } from './menuElem';
import './menu.scss';

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

    const isActive = (url) => {
        return location.pathname === `/dashboard/${url}` || location.pathname === `/${url}`;
    };

    const handleMenuClick = (url, event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        try {
            navigate(`/dashboard/${url}`);
        } catch (error) {
            console.error('❌ Erreur de navigation:', error);
        }
    };

    return (
        <div className="menu" id="appMenuAccordion">
            {menuProperties.map((menu) => (
                <div className="menu__item" key={menu.id}>
                    <div className="menu__header" id={`menu${menu.id}`}>
                        <h2 className="menu__title">
                            <button 
                                className="menu__button" 
                                type="button" 
                                aria-expanded={expandedMenus.has(menu.id)}
                                aria-controls={`collapse${menu.id}`}
                                onClick={() => toggleMenu(menu.id)}
                            >
                                <i className={`${menu.icon} menu__icon`}></i>
                                {menu.titre}
                            </button>
                        </h2>
                    </div>
                
                    <div 
                        id={`collapse${menu.id}`} 
                        className={`menu__content ${expandedMenus.has(menu.id) ? 'menu__content--expanded' : ''}`}
                        aria-labelledby={`menu${menu.id}`} 
                    >
                        <div className="menu__body">
                            <ul className="menu__list">
                                {menu.sousMenu.map((sousMenu) => (
                                    <li 
                                        className={`menu__list-item ${isActive(sousMenu.url) ? 'menu__list-item--active' : ''}`}
                                        key={sousMenu.id}
                                    >
                                        <div 
                                            onClick={(event) => handleMenuClick(sousMenu.url, event)}
                                            className={`menu__link ${isActive(sousMenu.url) ? 'menu__link--active' : ''}`}
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter' || event.key === ' ') {
                                                    handleMenuClick(sousMenu.url, event);
                                                }
                                            }}
                                        >
                                            <i className={`${sousMenu.icon} menu__link-icon`}></i>
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