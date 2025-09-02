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
    if (!fournisseur.nom || !fournisseur.prenom || !fournisseur.email) {
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
      } else {
        // Mode création
        const newFournisseur = await cltFrsService.saveFournisseur(fournisseurToSave);
        await savePhoto(newFournisseur.id, newFournisseur.nom);
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
        navigate('/dashboard/fournisseurs');
      } catch (error) {
        console.error('Erreur lors de la sauvegarde de la photo:', error);
        navigate('/dashboard/fournisseurs');
      }
    } else {
      navigate('/dashboard/fournisseurs');
    }
  };

  const handleInputChange = (field, value) => {
    setFournisseur(prev => ({ ...prev, [field]: value }));
  };

  const handleAdresseChange = (field, value) => {
    setAdresseDto(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="nouveau-fournisseur">
      <div className="nouveau-fournisseur__photo-section">
        <button 
          onClick={() => fileInputRef.current.click()} 
          className="nouveau-fournisseur__photo-button"
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

      <hr className="nouveau-fournisseur__divider" />

      <div className="nouveau-fournisseur__content">
        <div className="nouveau-fournisseur__header">
          <h2>
            <i className="fas fa-info-circle nouveau-fournisseur__icon"></i>
            &nbsp;Information du fournisseur
          </h2>
        </div>

        {errorMsg.length > 0 && (
          <div className="nouveau-fournisseur__errors">
            {errorMsg.map((msg, index) => (
              <div key={index} className="nouveau-fournisseur__error">
                {msg}
              </div>
            ))}
          </div>
        )}

        <div className="nouveau-fournisseur__form">
          <div className="nouveau-fournisseur__form-row">
            <div className="nouveau-fournisseur__form-group">
              <input
                type="text"
                className="nouveau-fournisseur__input"
                placeholder="Nom"
                value={fournisseur.nom || ''}
                onChange={(e) => handleInputChange('nom', e.target.value)}
              />
            </div>
            <div className="nouveau-fournisseur__form-group">
              <input
                type="text"
                className="nouveau-fournisseur__input"
                placeholder="Adresse 1"
                value={adresseDto.adresse1 || ''}
                onChange={(e) => handleAdresseChange('adresse1', e.target.value)}
              />
            </div>
          </div>

          <div className="nouveau-fournisseur__form-row">
            <div className="nouveau-fournisseur__form-group">
              <input
                type="text"
                className="nouveau-fournisseur__input"
                placeholder="Prenom"
                value={fournisseur.prenom || ''}
                onChange={(e) => handleInputChange('prenom', e.target.value)}
              />
            </div>
            <div className="nouveau-fournisseur__form-group">
              <input
                type="text"
                className="nouveau-fournisseur__input"
                placeholder="Adresse 2"
                value={adresseDto.adresse2 || ''}
                onChange={(e) => handleAdresseChange('adresse2', e.target.value)}
              />
            </div>
          </div>

          <div className="nouveau-fournisseur__form-row">
            <div className="nouveau-fournisseur__form-group">
              <input
                type="email"
                className="nouveau-fournisseur__input"
                placeholder="E-mail"
                value={fournisseur.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
            <div className="nouveau-fournisseur__form-group">
              <input
                type="text"
                className="nouveau-fournisseur__input"
                placeholder="Ville"
                value={adresseDto.ville || ''}
                onChange={(e) => handleAdresseChange('ville', e.target.value)}
              />
            </div>
          </div>

          <div className="nouveau-fournisseur__form-row">
            <div className="nouveau-fournisseur__form-group">
              <input
                type="text"
                className="nouveau-fournisseur__input"
                placeholder="Telephone"
                value={fournisseur.numTel || ''}
                onChange={(e) => handleInputChange('numTel', e.target.value)}
              />
            </div>
            <div className="nouveau-fournisseur__form-group">
              <input
                type="text"
                className="nouveau-fournisseur__input"
                placeholder="Code postal"
                value={adresseDto.codePostale || ''}
                onChange={(e) => handleAdresseChange('codePostale', e.target.value)}
              />
            </div>
          </div>

          <div className="nouveau-fournisseur__form-row">
            <div className="nouveau-fournisseur__form-group">
              &nbsp;
            </div>
            <div className="nouveau-fournisseur__form-group">
              <input
                type="text"
                className="nouveau-fournisseur__input"
                placeholder="Pays"
                value={adresseDto.pays || ''}
                onChange={(e) => handleAdresseChange('pays', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="nouveau-fournisseur__actions">
        <button 
          className="nouveau-fournisseur__btn nouveau-fournisseur__btn--danger"
          onClick={cancelClick}
        >
          <i className="fas fa-ban"></i>&nbsp;
          Annuler
        </button>
        <button 
          className="nouveau-fournisseur__btn nouveau-fournisseur__btn--primary"
          onClick={enregistrer}
        >
          <i className="fas fa-save"></i>&nbsp;
          {isEditMode ? 'Mettre à jour' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
};

export default NouveauFournisseur;
