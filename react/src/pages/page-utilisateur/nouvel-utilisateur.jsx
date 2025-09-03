import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserService } from '../../services/user/user.service';
import './nouvel-utilisateur.scss';

const NouvelUtilisateur = () => {
  const [utilisateurDto, setUtilisateurDto] = useState({
    nom: '',
    prenom: '',
    email: '',
    dateDeNaissance: '',
    motDePasse: '',
    adresse: {
      adresse1: '',
      adresse2: '',
      ville: '',
      codePostale: '',
      pays: ''
    }
  });
  const [errorMsg, setErrorMsg] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const userService = new UserService();

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      findUtilisateurById(id);
    }
  }, [id]);

  const findUtilisateurById = async (userId) => {
    try {
      setLoading(true);
      const utilisateur = await userService.findById(userId);
      if (utilisateur && utilisateur.id) {
        setUtilisateurDto({
          nom: utilisateur.nom || '',
          prenom: utilisateur.prenom || '',
          email: utilisateur.email || '',
          dateDeNaissance: utilisateur.dateDeNaissance ? utilisateur.dateDeNaissance.split('T')[0] : '',
          motDePasse: '',
          adresse: {
            adresse1: utilisateur.adresse?.adresse1 || '',
            adresse2: utilisateur.adresse?.adresse2 || '',
            ville: utilisateur.adresse?.ville || '',
            codePostale: utilisateur.adresse?.codePostale || '',
            pays: utilisateur.adresse?.pays || ''
          }
        });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      setErrorMsg([error.message || 'Erreur lors de la récupération de l\'utilisateur']);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setUtilisateurDto(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setUtilisateurDto(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const cancel = () => {
    navigate('/dashboard/utilisateurs');
  };

  const enregistrerUtilisateur = async () => {
    try {
      setLoading(true);
      setErrorMsg([]);

      // Validation
      if (!utilisateurDto.nom || !utilisateurDto.prenom || !utilisateurDto.email) {
        setErrorMsg(['Le nom, prénom et email sont obligatoires']);
        return;
      }

      if (!isEdit && !utilisateurDto.motDePasse) {
        setErrorMsg(['Le mot de passe est obligatoire pour un nouvel utilisateur']);
        return;
      }

      if (isEdit && id) {
        // Pour la modification, on utilise l'endpoint create avec l'ID
        const utilisateurToUpdate = { ...utilisateurDto, id: parseInt(id) };
        if (!utilisateurDto.motDePasse) {
          delete utilisateurToUpdate.motDePasse;
        }
        await userService.update(id, utilisateurToUpdate);
      } else {
        // Pour la création
        await userService.save(utilisateurDto);
      }

      navigate('/dashboard/utilisateurs');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      if (error.message) {
        setErrorMsg([error.message]);
      } else {
        setErrorMsg(['Erreur lors de la sauvegarde de l\'utilisateur']);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="nouvel-utilisateur-form">
      {/* En-tête du formulaire */}
      <div className="form-header">
        <h2>{isEdit ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}</h2>
      </div>
      
      {/* Contenu du formulaire */}
      <div className="form-content">
        {/* Messages d'erreur */}
        {errorMsg.length > 0 && (
          <div className="alert alert-danger">
            {errorMsg.map((msg, index) => (
              <div key={index}>
                <span>{msg}</span>
              </div>
            ))}
          </div>
        )}
        
        <form>
          {/* Section Informations personnelles */}
          <div className="form-section">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label">Nom</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Nom" 
                    name="nom" 
                    value={utilisateurDto.nom}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label">Prénom</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Prénom" 
                    name="prenom" 
                    value={utilisateurDto.prenom}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="Email" 
                    name="email" 
                    value={utilisateurDto.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label optional">Date de naissance</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    name="dateDeNaissance" 
                    value={utilisateurDto.dateDeNaissance}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label className={isEdit ? 'form-label optional' : 'form-label'}>
                    {isEdit ? 'Nouveau mot de passe' : 'Mot de passe'}
                  </label>
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder={isEdit ? 'Laissez vide pour ne pas changer' : 'Mot de passe'} 
                    name="motDePasse" 
                    value={utilisateurDto.motDePasse}
                    onChange={handleInputChange}
                    required={!isEdit}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Section Adresse */}
          <div className="form-section">
            <h5 className="section-title">Adresse</h5>
            
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label optional">Adresse 1</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Adresse 1" 
                    name="adresse.adresse1" 
                    value={utilisateurDto.adresse.adresse1}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label optional">Adresse 2</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Adresse 2" 
                    name="adresse.adresse2" 
                    value={utilisateurDto.adresse.adresse2}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-4">
                <div className="form-group">
                  <label className="form-label optional">Ville</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Ville" 
                    name="adresse.ville" 
                    value={utilisateurDto.adresse.ville}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label className="form-label optional">Code postal</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Code postal" 
                    name="adresse.codePostale" 
                    value={utilisateurDto.adresse.codePostale}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label className="form-label optional">Pays</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Pays" 
                    name="adresse.pays" 
                    value={utilisateurDto.adresse.pays}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      {/* Actions du formulaire */}
      <div className="form-actions">
        <button 
          className="btn btn-danger" 
          onClick={cancel}
          disabled={loading}
        >
          <i className="fas fa-ban"></i>
          Annuler
        </button>
        <button 
          className="btn btn-primary" 
          onClick={enregistrerUtilisateur}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border" role="status" aria-hidden="true"></span>
              {isEdit ? 'Modifier' : 'Enregistrer'}
            </>
          ) : (
            <>
              <i className="fas fa-save"></i>
              {isEdit ? 'Modifier' : 'Enregistrer'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default NouvelUtilisateur;
