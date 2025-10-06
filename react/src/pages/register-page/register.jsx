import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/registerService';
import { loginUser } from '../../services/loginService';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nom: '',
        codeFiscal: '',
        email: '',
        adresse1: '',
        adresse2: '',
        ville: '',
        codePostale: '',
        pays: '',
        description: '',
        numTel: ''
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
        if (!formData.nom || !formData.email || !formData.codeFiscal) {
            setMessage({ type: 'error', text: 'Veuillez remplir tous les champs obligatoires (Nom, Email, Code Fiscal)' });
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
            // Préparer les données pour l'API selon la structure EntrepriseDto
            const entrepriseData = {
                nom: formData.nom,
                codeFiscal: formData.codeFiscal,
                email: formData.email,
                adresse: {
                    adresse1: formData.adresse1,
                    adresse2: formData.adresse2,
                    ville: formData.ville,
                    codePostale: formData.codePostale,
                    pays: formData.pays
                },
                description: formData.description,
                numTel: formData.numTel
            };

            const result = await registerUser(entrepriseData);

            if (result.success) {
                setMessage({ type: 'success', text: 'Entreprise créée avec succès. Connexion automatique en cours...' });
                
                // Stocker l'ID de l'entreprise créée
                if (result.data && result.data.id) {
                    localStorage.setItem('entrepriseId', result.data.id.toString());
                    console.log('✅ ID entreprise créée stocké:', result.data.id);
                }
                
                // Connexion automatique avec mot de passe par défaut
                try {
                    await connectEntreprise(formData.email, result.data);
                } catch (loginError) {
                    console.error('Erreur lors de la connexion automatique:', loginError);
                    setMessage({ type: 'error', text: 'Entreprise créée mais erreur de connexion. Veuillez vous connecter manuellement.' });
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                    return;
                }
            } else {
                setMessage({ type: 'error', text: result.error });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour connecter automatiquement l'entreprise après inscription
    const connectEntreprise = async (email, entrepriseData) => {
        try {
            // Mot de passe par défaut comme dans le composant Angular
            const defaultPassword = 'som3R@nd0mP@$$word';
            
            // Connexion automatique
            const loginResult = await loginUser({
                email: email,
                password: defaultPassword
            });

            if (loginResult.success) {
                try {
                    // Créer l'utilisateur avec l'ID réel de l'entreprise créée
                    await createUserFromEntreprise(email, entrepriseData);
                    
                    // Stocker l'origine pour indiquer que l'utilisateur vient de s'inscrire
                    localStorage.setItem('origin', 'inscription');
                    
                    // Marquer que l'utilisateur doit changer son mot de passe
                    localStorage.setItem('mustChangePassword', 'true');
                    
                    // Rediriger vers la page de modification du mot de passe
                    setMessage({ type: 'success', text: 'Connexion réussie ! Redirection vers la modification du mot de passe...' });
                    setTimeout(() => {
                        navigate('/dashboard/changer-mot-passe');
                    }, 2000);
                } catch (userError) {
                    console.error('Erreur lors de la création de l\'utilisateur:', userError);
                    // Continuer quand même avec la redirection
                    setMessage({ type: 'warning', text: 'Connexion réussie mais erreur de création utilisateur. Redirection...' });
                    setTimeout(() => {
                        navigate('/dashboard/changer-mot-passe');
                    }, 2000);
                }
            } else {
                throw new Error(loginResult.error || 'Erreur de connexion');
            }
        } catch (error) {
            console.error('Erreur lors de la connexion automatique:', error);
            throw error;
        }
    };

    // Fonction pour créer l'utilisateur avec l'ID réel de l'entreprise
    const createUserFromEntreprise = async (email, entrepriseData) => {
        try {
            // Utiliser l'ID réel de l'entreprise créée
            const entrepriseId = entrepriseData.id;
            console.log('🏢 Utilisation de l\'ID entreprise réel:', entrepriseId);
            
            // Créer l'objet utilisateur avec l'ID réel
            const user = {
                id: entrepriseId, // Utiliser l'ID de l'entreprise comme ID utilisateur
                email: email,
                entreprise: {
                    id: entrepriseId
                }
            };
            
            // Stocker l'utilisateur connecté dans le localStorage
            localStorage.setItem('connectedUser', JSON.stringify(user));
            localStorage.setItem('entrepriseId', entrepriseId.toString());
            
            console.log('✅ Utilisateur créé avec ID réel:', user);
            return user;
            
        } catch (error) {
            console.error('Erreur lors de la création de l\'utilisateur:', error);
            throw error;
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100 p-5">
            <div className="card shadow-lg" style={{ maxWidth: '600px', width: '100%' }}>
                <div className="card-body p-5">
                    <div className="text-center mb-4">
                        <i className="fas fa-building fa-3x text-primary mb-3"></i>
                        <h2>S'inscrire</h2>
                        <p className="text-muted">Créez votre entreprise pour commencer</p>
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

                        {/* Code Fiscal et Code postal */}
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
                                    <div className="form-outline">
                                        <label className="form-label" htmlFor="codePostale">Code postal</label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <i className="fas fa-mail-bulk"></i>
                                            </span>
                                            <input
                                                type="text"
                                                id="codePostale"
                                                className="form-control"
                                                name="codePostale"
                                                value={formData.codePostale}
                                                onChange={handleChange}
                                                placeholder="Code postal"
                                            />
                                        </div>
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

                        {/* Description et Numéro de téléphone */}
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <div className="form-outline">
                                    <label className="form-label" htmlFor="description">Description</label>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <i className="fas fa-align-left"></i>
                                        </span>
                                        <textarea
                                            id="description"
                                            className="form-control"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="Description de l'entreprise"
                                            rows="1"
                                            style={{ resize: 'none', height: '38px' }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-outline">
                                    <label className="form-label" htmlFor="numTel">Numéro de téléphone</label>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <i className="fas fa-phone"></i>
                                        </span>
                                        <input
                                            type="text"
                                            id="numTel"
                                            className="form-control"
                                            name="numTel"
                                            value={formData.numTel}
                                            onChange={handleChange}
                                            placeholder="Numéro de téléphone"
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
                                        <i className="fas fa-building me-2"></i>
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