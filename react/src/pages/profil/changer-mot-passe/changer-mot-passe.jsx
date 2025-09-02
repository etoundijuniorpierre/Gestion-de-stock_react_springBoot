import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserService } from '../../../services/user/user.service';
import './changer-mot-passe.scss';

const ChangerMotPasse = () => {
  const [changerMotDePasseDto, setChangerMotDePasseDto] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
        setTimeout(() => navigate('/dashboard/vue-ensemble'), 2000);
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

  const cancel = () => navigate('/dashboard/vue-ensemble');

  return (
    <div className="changer-mdp">
      <div className="changer-mdp__left">
        <div className="changer-mdp__photo">
          <img src="assets/product.png" className="changer-mdp__avatar" width="200" height="200" alt="avatar" />
        </div>
        <div className="changer-mdp__title">
          <h2>Modification du mot de passe</h2>
          <small className="changer-mdp__subtitle">Sécurisez votre compte en changeant le mot de passe par défaut</small>
        </div>
      </div>

      <div className="changer-mdp__right">
        <form className="changer-mdp__form" onSubmit={onSubmit}>
          <div className="changer-mdp__form-group">
            <label className="changer-mdp__label" htmlFor="nouveaumotdepasse">Nouveau mot de passe</label>
            <input
              id="nouveaumotdepasse"
              type="password"
              className="changer-mdp__input"
              placeholder="Nouveau mot de passe"
              value={changerMotDePasseDto.motDePasse || ''}
              onChange={e => setChangerMotDePasseDto(prev => ({ ...prev, motDePasse: e.target.value }))}
              required
            />
          </div>

          <div className="changer-mdp__form-group">
            <label className="changer-mdp__label" htmlFor="confirmmotdepasse">Confirmer le mot de passe</label>
            <input
              id="confirmmotdepasse"
              type="password"
              className="changer-mdp__input"
              placeholder="Confirmer mot de passe"
              value={changerMotDePasseDto.confirmMotDePasse || ''}
              onChange={e => setChangerMotDePasseDto(prev => ({ ...prev, confirmMotDePasse: e.target.value }))}
              required
            />
          </div>

          {errorMessage && (
            <div className="changer-mdp__error" role="alert">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="changer-mdp__success" role="alert">
              <i className="fas fa-check-circle me-2"></i>
              {successMessage}
            </div>
          )}

          <div className="changer-mdp__actions">
            <button type="button" className="changer-mdp__btn changer-mdp__btn--secondary" onClick={cancel} disabled={isLoading}>
              <i className="fas fa-ban"></i>&nbsp;Annuler
            </button>
            <button type="submit" className="changer-mdp__btn changer-mdp__btn--primary" disabled={isLoading}>
              <i className="fas fa-save"></i>&nbsp;
              {isLoading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangerMotPasse;
