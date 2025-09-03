import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./header.scss";
import ReactLogo from "../../assets/react.ico";

export default function Header() {
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

    return(
        <div className="header">
            <div className="header__search">
                <div className="header__search-group">
                    <input 
                        type="text" 
                        className="header__search-input" 
                        placeholder="Rechercher..." 
                        aria-label="Recherche" 
                        aria-describedby="addon-wrapping"
                    />
                    <div className="header__search-button">
                        <span className="header__search-icon" id="addon-wrapping">
                            <i className="fas fa-search"></i>
                        </span>
                    </div>
                </div>
            </div>
            <div className="header__user">
                <div className="header__user-greeting">
                    <span className="greeting-text">Bonjour</span>
                    {connectedUser?.nom && (
                        <span className="user-name">&nbsp;{connectedUser.nom}</span>
                    )}
                </div>
                <div className="header__user-actions">
                    <button 
                        className="header__profile-btn" 
                        onClick={handleProfileClick}
                        title="Profil"
                    >
                        <img 
                            src={getUserPhoto()} 
                            className="header__user-image" 
                            alt={`Photo de ${connectedUser?.nom || 'utilisateur'}`}
                            onError={(e) => {
                                e.target.src = ReactLogo; // Fallback si l'image ne charge pas
                            }}
                        />
                    </button>
                    <button 
                        className="header__logout-btn" 
                        onClick={handleLogout}
                        title="Déconnexion"
                    >
                        <i className="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}