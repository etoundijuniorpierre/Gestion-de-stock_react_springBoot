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
                    <span>Bonjour</span>
                    {connectedUser?.nom && <span>&nbsp;{connectedUser.nom}</span>}
                </div>
                <div className="header__user-actions">
                    <button 
                        className="header__profile-btn" 
                        onClick={handleProfileClick}
                        title="Profil"
                    >
                        <img src={ReactLogo} className="header__user-image" alt="User avatar" />
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