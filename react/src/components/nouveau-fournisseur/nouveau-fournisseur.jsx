import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CltfrsService } from '../../services/cltfrs/cltfrs.service';
import { PhotosService } from '../../services/photos.service';
import './nouveau-fournisseur.scss';

const NouveauFournisseur = () => {
  const [fournisseur, setFournisseur] = useState({});
  const [adresseDto, setAdresseDto] = useState({});
  const [errorMsg, setErrorMsg] = useState([]);
  const [file, setFile] = useState(null);
  const [imgUrl, setImgUrl] = useState('assets/product.png');
  const [isEditMode, setIsEditMode] = useState(false);
  
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef();
  const cltFrsService = new CltfrsService();
  const photoService = new PhotosService();

  useEffect(() => {
    findObject();
  }, []);

  const findObject = async () => {
    if (id) {
      setIsEditMode(true);
      try {
        const fournisseurData = await cltFrsService.findFournisseurById(id);
        setFournisseur(fournisseurData);
        setAdresseDto(fournisseurData.adresse || {});
      } catch (error) {
        console.error('Erreur lors de la récupération du fournisseur:', error);
      }
    }
  };

  const enregistrer = async () => {
    // Validation des champs obligatoires
    if (!fournisseur.nom || !fournisseur.prenom || !fournisseur.mail) {
      setErrorMsg(['Les champs nom, prénom et email sont obligatoires']);
      return;
    }

    // Mapper l'adresse
    const fournisseurToSave = { ...fournisseur, adresse: adresseDto };

    try {
      if (isEditMode) {
        // Mode édition
        const updatedFournisseur = await cltFrsService.updateFournisseur(fournisseur.id, fournisseurToSave);
        await savePhoto(updatedFournisseur.id, updatedFournisseur.nom);
        navigate('/dashboard/fournisseurs');
      } else {
        // Mode création
        const newFournisseur = await cltFrsService.saveFournisseur(fournisseurToSave);
        await savePhoto(newFournisseur.id, newFournisseur.nom);
        navigate('/dashboard/fournisseurs');
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.errors || ['Erreur lors de la sauvegarde']);
    }
  };

  const cancelClick = () => {
    navigate('/dashboard/fournisseurs');
  };

  const onFileInput = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      
      const fileReader = new FileReader();
      fileReader.readAsDataURL(selectedFile);
      fileReader.onload = (event) => {
        if (fileReader.result) {
          setImgUrl(fileReader.result);
        }
      };
    }
  };

  const savePhoto = async (idObject, titre) => {
    if (idObject && titre && file) {
      const params = {
        id: idObject,
        file: file,
        title: titre,
        context: 'fournisseur'
      };

      try {
        await photoService.savePhoto(params);
      } catch (error) {
        console.error('Erreur lors de la sauvegarde de la photo:', error);
        // Ne pas naviguer ici, laisser la fonction enregistrer gérer la navigation
      }
    }
  };

  const handleInputChange = (field, value) => {
    setFournisseur(prev => ({ ...prev, [field]: value }));
  };

  const handleAdresseChange = (field, value) => {
    setAdresseDto(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="nouveau-fournisseur-form">
      {/* En-tête du formulaire */}
      <div className="form-header">
        <h2>
          <i className="fas fa-truck"></i>
          {isEditMode ? 'Modifier le fournisseur' : 'Nouveau fournisseur'}
        </h2>
      </div>
      
      {/* Contenu du formulaire */}
      <div className="form-content">

        {/* Messages d'erreur */}
        {errorMsg.length > 0 && (
          <div className="alert alert-danger">
            {errorMsg.map((msg, index) => (
              <div key={index}>
                <i className="fas fa-exclamation-triangle me-2"></i>
                {msg}
              </div>
            ))}
          </div>
        )}

        <form>
          {/* Section Photo */}
          <div className="form-section">
            <h5 className="section-title">Photo du fournisseur</h5>
            <div className="photo-section">
              <button 
                onClick={() => fileInputRef.current.click()} 
                className="photo-button"
              >
                <img src={imgUrl} alt="Photo fournisseur" className="nouveau-fournisseur__photo" />
              </button>
              <input 
                hidden 
                type="file" 
                ref={fileInputRef}
                onChange={onFileInput}
                accept="image/*"
              />
            </div>
          </div>

          {/* Section Informations personnelles */}
          <div className="form-section">
            <h5 className="section-title">Informations personnelles</h5>
            
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label" htmlFor="nom">Nom</label>
                  <input
                    type="text"
                    id="nom"
                    className="form-control"
                    placeholder="Nom"
                    value={fournisseur.nom || ''}
                    onChange={(e) => handleInputChange('nom', e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label" htmlFor="prenom">Prénom</label>
                  <input
                    type="text"
                    id="prenom"
                    className="form-control"
                    placeholder="Prénom"
                    value={fournisseur.prenom || ''}
                    onChange={(e) => handleInputChange('prenom', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="E-mail"
                    value={fournisseur.mail || ''}
                    onChange={(e) => handleInputChange('mail', e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label optional" htmlFor="telephone">Téléphone</label>
                  <input
                    type="tel"
                    id="telephone"
                    className="form-control"
                    placeholder="Téléphone"
                    value={fournisseur.numTel || ''}
                    onChange={(e) => handleInputChange('numTel', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section Adresse */}
          <div className="form-section adresse-section">
            <h5 className="section-title">Adresse</h5>
            
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label optional" htmlFor="adresse1">Adresse 1</label>
                  <input
                    type="text"
                    id="adresse1"
                    className="form-control"
                    placeholder="Adresse 1"
                    value={adresseDto.adresse1 || ''}
                    onChange={(e) => handleAdresseChange('adresse1', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label optional" htmlFor="adresse2">Adresse 2</label>
                  <input
                    type="text"
                    id="adresse2"
                    className="form-control"
                    placeholder="Adresse 2"
                    value={adresseDto.adresse2 || ''}
                    onChange={(e) => handleAdresseChange('adresse2', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4">
                <div className="form-group">
                  <label className="form-label optional" htmlFor="ville">Ville</label>
                  <input
                    type="text"
                    id="ville"
                    className="form-control"
                    placeholder="Ville"
                    value={adresseDto.ville || ''}
                    onChange={(e) => handleAdresseChange('ville', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="form-group">
                  <label className="form-label optional" htmlFor="codePostale">Code postal</label>
                  <input
                    type="text"
                    id="codePostale"
                    className="form-control"
                    placeholder="Code postal"
                    value={adresseDto.codePostale || ''}
                    onChange={(e) => handleAdresseChange('codePostale', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="form-group">
                  <label className="form-label optional" htmlFor="pays">Pays</label>
                  <input
                    type="text"
                    id="pays"
                    className="form-control"
                    placeholder="Pays"
                    value={adresseDto.pays || ''}
                    onChange={(e) => handleAdresseChange('pays', e.target.value)}
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
          type="button"
          className="btn btn-secondary"
          onClick={cancelClick}
        >
          <i className="fas fa-ban"></i>
          Annuler
        </button>
        <button 
          type="button"
          className="btn btn-primary"
          onClick={enregistrer}
        >
          <i className="fas fa-save"></i>
          {isEditMode ? 'Mettre à jour' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
};

export default NouveauFournisseur;
