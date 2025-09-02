import React, { useState } from 'react';
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
                                    type="password"
                                    id="password"
                                    className="form-control"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Entrez votre mot de passe"
                                    required
                                />
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