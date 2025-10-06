import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserService } from '../../../services/user/user.service';
import './changer-mot-passe.scss';

const ChangerMotPasse = () => {
  const [changerMotDePasseDto, setChangerMotDePasseDto] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  // State for password visibility
  const [showPassword, setShowPassword] = useState({
    motDePasse: false,
    confirmMotDePasse: false
  });

  const navigate = useNavigate();
  const userService = new UserService();

  useEffect(() => {
    // Récupérer l'ID de l'utilisateur connecté (comme dans le composant Angular)
    const connectedUser = localStorage.getItem('connectedUser');
    if (connectedUser) {
      try {
        const user = JSON.parse(connectedUser);
        if (user.id) {
          setChangerMotDePasseDto(prev => ({ ...prev, id: parseInt(user.id) }));
          console.log('✅ ID utilisateur récupéré:', user.id);
        } else {
          console.warn('⚠️ ID utilisateur non trouvé dans les données utilisateur');
          setErrorMessage('ID de l\'utilisateur non trouvé. Veuillez vous reconnecter.');
        }
      } catch (error) {
        console.error('Erreur lors du parsing des données utilisateur:', error);
        setErrorMessage('Erreur lors de la récupération des données utilisateur.');
      }
    } else {
      console.warn('⚠️ Utilisateur connecté non trouvé dans le localStorage');
      setErrorMessage('Utilisateur non connecté. Veuillez vous reconnecter.');
    }

    // Vérifier si l'utilisateur vient de s'inscrire
    const origin = localStorage.getItem('origin');
    if (origin === 'inscription') {
      setSuccessMessage('Bienvenue ! Veuillez modifier votre mot de passe par défaut pour sécuriser votre compte.');
      // Nettoyer l'origine après affichage
      localStorage.removeItem('origin');
    }
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!changerMotDePasseDto.motDePasse || !changerMotDePasseDto.confirmMotDePasse) {
      setErrorMessage('Veuillez remplir tous les champs');
      return;
    }
    if (changerMotDePasseDto.motDePasse !== changerMotDePasseDto.confirmMotDePasse) {
      setErrorMessage('Les mots de passe ne correspondent pas');
      return;
    }
    if (!changerMotDePasseDto.id) {
      setErrorMessage("ID de l'utilisateur non trouvé");
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Log des données envoyées pour debug
      console.log('📤 Données envoyées au serveur:', changerMotDePasseDto);
      
      const result = await userService.changerMotDePasse(changerMotDePasseDto);
      
      if (result.success) {
        setSuccessMessage('Mot de passe modifié avec succès !');
        
        // Marquer que le mot de passe a été changé
        localStorage.setItem('mustChangePassword', 'false');
        localStorage.setItem('passwordChanged', 'true');
        
        // Mettre à jour les informations de l'utilisateur si nécessaire
        try {
          const updatedUser = await userService.findById(changerMotDePasseDto.id);
          if (updatedUser) {
            localStorage.setItem('connectedUser', JSON.stringify(updatedUser));
          }
        } catch (error) {
          console.warn('Impossible de mettre à jour les informations utilisateur:', error);
        }
        
        // Rediriger vers le dashboard après un court délai
        setTimeout(() => {
          navigate('/dashboard/vue-ensemble');
        }, 2000);
      } else {
        // Message d'erreur plus détaillé
        let errorMsg = 'Erreur lors de la modification du mot de passe. ';
        if (result.error) {
          errorMsg += result.error;
        } else if (result.status) {
          errorMsg += `Status: ${result.status}`;
        } else {
          errorMsg += 'Erreur inconnue';
        }
        
        setErrorMessage(errorMsg);
        console.error('❌ Résultat d\'erreur:', result);
      }
    } catch (error) {
      console.error('❌ Erreur détaillée:', error);
      
      // Message d'erreur plus détaillé
      let errorMsg = 'Erreur lors de la modification du mot de passe. ';
      if (error.message) {
        errorMsg += error.message;
      } else if (error.status) {
        errorMsg += `Status: ${error.status}`;
      }
      
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const cancel = () => {
    // Vérifier si l'utilisateur vient de s'inscrire et n'a pas encore changé son mot de passe
    const mustChangePassword = localStorage.getItem('mustChangePassword');
    if (mustChangePassword === 'true') {
      // Ne pas permettre l'annulation si c'est obligatoire
      setErrorMessage('Vous devez changer votre mot de passe par défaut pour continuer.');
      return;
    }
    navigate('/dashboard/vue-ensemble');
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="changer-mot-passe-form">
      {/* En-tête du formulaire */}
      <div className="form-header">
        <h2>Modification du mot de passe</h2>
        <div className="subtitle">Sécurisez votre compte en changeant le mot de passe par défaut</div>
      </div>
      
      {/* Contenu du formulaire */}
      <div className="form-content">
        {/* Messages d'erreur/succès */}
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="alert alert-success" role="alert">
            <i className="fas fa-check-circle me-2"></i>
            {successMessage}
          </div>
        )}
        
        <form onSubmit={onSubmit}>
          {/* Section Mot de passe */}
          <div className="form-section">
            <h5 className="section-title">Nouveau mot de passe</h5>
            
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label" htmlFor="nouveaumotdepasse">Nouveau mot de passe</label>
                  <div className="password-input-container">
                    <input
                      id="nouveaumotdepasse"
                      type={showPassword.motDePasse ? "text" : "password"}
                      className="form-control password-input"
                      placeholder="Nouveau mot de passe"
                      value={changerMotDePasseDto.motDePasse || ''}
                      onChange={e => setChangerMotDePasseDto(prev => ({ ...prev, motDePasse: e.target.value }))}
                      required
                    />
                    <span 
                      className="password-toggle-icon"
                      onClick={() => togglePasswordVisibility('motDePasse')}
                    >
                      <i className={`fas ${showPassword.motDePasse ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label" htmlFor="confirmmotdepasse">Confirmer le mot de passe</label>
                  <div className="password-input-container">
                    <input
                      id="confirmmotdepasse"
                      type={showPassword.confirmMotDePasse ? "text" : "password"}
                      className="form-control password-input"
                      placeholder="Confirmer mot de passe"
                      value={changerMotDePasseDto.confirmMotDePasse || ''}
                      onChange={e => setChangerMotDePasseDto(prev => ({ ...prev, confirmMotDePasse: e.target.value }))}
                      required
                    />
                    <span 
                      className="password-toggle-icon"
                      onClick={() => togglePasswordVisibility('confirmMotDePasse')}
                    >
                      <i className={`fas ${showPassword.confirmMotDePasse ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      {/* Actions du formulaire */}
      <div className="form-actions">
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={cancel} 
          disabled={isLoading}
        >
          <i className="fas fa-ban"></i>
          Annuler
        </button>
        <button 
          type="submit" 
          className="btn btn-primary" 
          onClick={onSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border" role="status" aria-hidden="true"></span>
              Enregistrement...
            </>
          ) : (
            <>
              <i className="fas fa-save"></i>
              Enregistrer
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ChangerMotPasse;