import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactLogo from "../../assets/react.ico";
import "./dashboard-header.scss";

const DashboardHeader = () => {
    const [connectedUser, setConnectedUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Récupérer les informations de l'utilisateur connecté depuis le localStorage
        const user = localStorage.getItem('user');
        if (user) {
            setConnectedUser(JSON.parse(user));
        }
    }, []);

    const handleLogout = () => {
        // Supprimer les informations de l'utilisateur et le token
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        
        // Rediriger vers la page de connexion
        navigate('/login');
    };

    const handleProfileClick = () => {
        navigate('/dashboard/profil');
    };

    // Fonction pour obtenir la photo de l'utilisateur ou la photo par défaut
    const getUserPhoto = () => {
        if (connectedUser?.photo && connectedUser.photo !== null && connectedUser.photo !== '') {
            return connectedUser.photo;
        }
        return ReactLogo; // Photo par défaut React si pas de photo
    };

    return (
        <header className="dashboard-header">
            <div className="header-content">
                <div className="header-left">
                    <div className="search-container">
                        <div className="search-input-wrapper">
                            <i className="fas fa-search search-icon"></i>
                            <input 
                                type="text" 
                                className="search-input" 
                                placeholder="Rechercher..." 
                                aria-label="Recherche"
                            />
                        </div>
                    </div>
                </div>
                
                <div className="header-right">
                    <div className="user-info">
                        <div className="user-greeting">
                            <span className="greeting-text">Bonjour</span>
                            {connectedUser?.nom && (
                                <span className="user-name">&nbsp;{connectedUser.nom}</span>
                            )}
                        </div>
                        
                        <div className="user-actions">
                            <button 
                                className="profile-btn" 
                                onClick={handleProfileClick}
                                title="Profil"
                            >
                                <img 
                                    src={getUserPhoto()} 
                                    className="user-avatar" 
                                    alt={`Photo de ${connectedUser?.nom || 'utilisateur'}`}
                                    onError={(e) => {
                                        e.target.src = ReactLogo;
                                    }}
                                />
                            </button>
                            
                            <button 
                                className="logout-btn" 
                                onClick={handleLogout}
                                title="Déconnexion"
                            >
                                <i className="fas fa-sign-out-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
