import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/loginService';
import './login.scss';

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Charger les données sauvegardées au montage du composant
    useEffect(() => {
        const savedEmail = localStorage.getItem('rememberedEmail');
        const savedPassword = localStorage.getItem('rememberedPassword');
        const rememberMeStatus = localStorage.getItem('rememberMe') === 'true';
        
        if (rememberMeStatus && savedEmail) {
            setFormData({
                email: savedEmail,
                password: savedPassword || ''
            });
            setRememberMe(true);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const result = await loginUser(formData);
            if (result.success) {
                // Gérer le "Remember Me"
                if (rememberMe) {
                    localStorage.setItem('rememberedEmail', formData.email);
                    localStorage.setItem('rememberedPassword', formData.password);
                    localStorage.setItem('rememberMe', 'true');
                } else {
                    localStorage.removeItem('rememberedEmail');
                    localStorage.removeItem('rememberedPassword');
                    localStorage.removeItem('rememberMe');
                }
                
                setMessage({ type: 'success', text: result.message });
                // Rediriger vers le dashboard après 1 seconde
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1000);
            } else {
                setMessage({ type: 'error', text: result.error });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card card">
                <div className="card-body">
                    <div className="login-header">
                        <div className="login-icon">
                            <i className="fas fa-user-circle"></i>
                        </div>
                        <h2>Connexion</h2>
                    </div>

                    {/* Messages d'erreur/succès */}
                    {message.text && (
                        <div className={`alert alert-${message.type === 'error' ? 'danger' : 'success'}`} role="alert">
                            <i className={`fas fa-${message.type === 'error' ? 'exclamation-triangle' : 'check-circle'} me-2`}></i>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="email">Email</label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="fas fa-envelope"></i>
                                </span>
                                <input
                                    type="email"
                                    id="email"
                                    className="form-control"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Entrez votre email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="password">Mot de passe</label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="fas fa-lock"></i>
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    className="form-control"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Entrez votre mot de passe"
                                    required
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex="-1"
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>

                        <div className="form-group remember-me-group">
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="rememberMe"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="rememberMe">
                                    Se souvenir de moi
                                </label>
                            </div>
                        </div>

                        <div className="button-group">
                            {/* Register button */}
                            <NavLink to="/register" className="btn btn-outline-primary">
                                <i className="fas fa-user-plus me-2"></i>
                                S'inscrire
                            </NavLink>

                            {/* Login button */}
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Connexion...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-sign-in-alt me-2"></i>
                                        Se connecter
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}