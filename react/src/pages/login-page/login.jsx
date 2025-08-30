import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/loginService';

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
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card shadow-lg" style={{ maxWidth: '450px', width: '100%' }}>
                <div className="card-body p-5">
                    <div className="text-center mb-4">
                        <i className="fas fa-user-circle fa-3x text-primary mb-3"></i>
                        <h2>Connexion</h2>
                    </div>

                    {/* Messages d'erreur/succès */}
                    {message.text && (
                        <div className={`alert alert-${message.type === 'error' ? 'danger' : 'success'} mb-4`} role="alert">
                            <i className={`fas fa-${message.type === 'error' ? 'exclamation-triangle' : 'check-circle'} me-2`}></i>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <div className="form-outline">
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
                                    />
                                </div>
                                <label className="form-label" htmlFor="email">Email</label>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="form-outline">
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
                                    />
                                </div>
                                <label className="form-label" htmlFor="password">Mot de passe</label>
                            </div>
                        </div>

                        <div className="d-flex justify-content-between gap-3">
                            {/* Register button */}
                            <NavLink to="/register">
                                <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                >
                                    <i className="fas fa-user-plus me-2"></i>
                                    S'inscrire
                                </button>
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