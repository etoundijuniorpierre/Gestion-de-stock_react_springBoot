import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/registerService';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nom: '',
        email: '',
        adresse1: '',
        adresse2: '',
        codeFiscal: '',
        codePostal: '',
        ville: '',
        pays: '',
        password: '',
        confirmPassword: ''
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

    const validateForm = () => {
        if (!formData.nom || !formData.email || !formData.password || !formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Veuillez remplir tous les champs obligatoires' });
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
            return false;
        }

        if (formData.password.length < 6) {
            setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères' });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // Préparer les données pour l'API (exclure confirmPassword)
            const userData = {
                nom: formData.nom,
                email: formData.email,
                adresse1: formData.adresse1,
                adresse2: formData.adresse2,
                codeFiscal: formData.codeFiscal,
                codePostal: formData.codePostal,
                ville: formData.ville,
                pays: formData.pays,
                password: formData.password
            };

            const result = await registerUser(userData);

            if (result.success) {
                setMessage({ type: 'success', text: result.message });
                // Rediriger vers la page de connexion après 2 secondes
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
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
        <div className="container d-flex justify-content-center align-items-center min-vh-100 p-5">
            <div className="card shadow-lg" style={{ maxWidth: '600px', width: '100%' }}>
                <div className="card-body p-5">
                    <div className="text-center mb-4">
                        <i className="fas fa-user-plus fa-3x text-primary mb-3"></i>
                        <h2>S'inscrire</h2>
                        <p className="text-muted">Créez votre compte pour commencer</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Messages d'erreur/succès */}
                        {message.text && (
                            <div className={`alert alert-${message.type === 'error' ? 'danger' : 'success'} mb-4`} role="alert">
                                <i className={`fas fa-${message.type === 'error' ? 'exclamation-triangle' : 'check-circle'} me-2`}></i>
                                {message.text}
                            </div>
                        )}

                        {/* Nom et Code Fiscal */}
                        <div className="row mb-4">
                            <div className="form-outline">
                                <label className="form-label" htmlFor="nom">Nom</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="fas fa-user"></i>
                                    </span>
                                    <input
                                        type="text"
                                        id="nom"
                                        className="form-control"
                                        name="nom"
                                        value={formData.nom}
                                        onChange={handleChange}
                                        placeholder="Entrez votre nom"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="mb-4">
                            <div className="form-outline">
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
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Adresse 1 et 2 */}
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <div className="form-outline">
                                    <label className="form-label" htmlFor="adresse1">Adresse 1</label>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <i className="fas fa-map-marker-alt"></i>
                                        </span>
                                        <input
                                            type="text"
                                            id="adresse1"
                                            className="form-control"
                                            name="adresse1"
                                            value={formData.adresse1}
                                            onChange={handleChange}
                                            placeholder="Adresse principale"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-outline">
                                    <label className="form-label" htmlFor="adresse2">Adresse 2</label>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <i className="fas fa-building"></i>
                                        </span>
                                        <input
                                            type="text"
                                            id="adresse2"
                                            className="form-control"
                                            name="adresse2"
                                            value={formData.adresse2}
                                            onChange={handleChange}
                                            placeholder="Complément d'adresse"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Code postal et Code fiscal */}
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <div className="form-outline">
                                    <label className="form-label" htmlFor="codeFiscal">Code Fiscal</label>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <i className="fas fa-id-card"></i>
                                        </span>
                                        <input
                                            type="text"
                                            id="codeFiscal"
                                            className="form-control"
                                            name="codeFiscal"
                                            value={formData.codeFiscal}
                                            onChange={handleChange}
                                            placeholder="Code fiscal"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-outline">
                                    <label className="form-label" htmlFor="codePostal">Code postal</label>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <i className="fas fa-mail-bulk"></i>
                                        </span>
                                        <input
                                            type="text"
                                            id="codePostal"
                                            className="form-control"
                                            name="codePostal"
                                            value={formData.codePostal}
                                            onChange={handleChange}
                                            placeholder="Code postal"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Ville et Pays */}
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <div className="form-outline">
                                    <label className="form-label" htmlFor="ville">Ville</label>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <i className="fas fa-city"></i>
                                        </span>
                                        <input
                                            type="text"
                                            id="ville"
                                            className="form-control"
                                            name="ville"
                                            value={formData.ville}
                                            onChange={handleChange}
                                            placeholder="Ville"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-outline">
                                    <label className="form-label" htmlFor="pays">Pays</label>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <i className="fas fa-flag"></i>
                                        </span>
                                        <input
                                            type="text"
                                            id="pays"
                                            className="form-control"
                                            name="pays"
                                            value={formData.pays}
                                            onChange={handleChange}
                                            placeholder="Pays"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mot de passe et confirmation */}
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <div className="form-outline">
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
                                            placeholder="Mot de passe"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-outline">
                                    <label className="form-label" htmlFor="confirmPassword">Confirmer mot de passe</label>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <i className="fas fa-lock"></i>
                                        </span>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            className="form-control"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirmer le mot de passe"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit buttons */}
                        <div className="d-flex justify-content-between gap-3">
                            {/* Back to login button */}
                            <NavLink to="/login">
                                <button type="button" className="btn btn-outline-secondary">
                                    <i className="fas fa-arrow-left me-2"></i>
                                    Se connecter
                                </button>
                            </NavLink>

                            {/* Register button */}
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Inscription en cours...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-user-plus me-2"></i>
                                        S'inscrire
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