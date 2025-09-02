import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CltfrsService } from '../../services/cltfrs/cltfrs.service';
import { PhotosService } from '../../services/photos.service';
import './nouveau-client.scss';

const NouveauClient = () => {
  const [client, setClient] = useState({});
  const [adresseDto, setAdresseDto] = useState({});
  const [errorMsg, setErrorMsg] = useState([]);
  const [file, setFile] = useState(null);
  const [imgUrl, setImgUrl] = useState('assets/product.png');
  const [isEditMode, setIsEditMode] = useState(false);
  
  const navigate = useNavigate();
  const { id } = useParams();
  const cltFrsService = new CltfrsService();
  const photoService = new PhotosService();

  useEffect(() => {
    findObject();
  }, []);

  const findObject = async () => {
    if (id) {
      setIsEditMode(true);
      try {
        const clientData = await cltFrsService.findClientById(id);
        setClient(clientData);
        setAdresseDto(clientData.adresse || {});
      } catch (error) {
        console.error('Erreur lors de la récupération du client:', error);
      }
    }
  };

  const enregistrer = async () => {
    // Validation des champs obligatoires
    if (!client.nom || !client.prenom || !client.mail) {
      setErrorMsg(['Les champs nom, prénom et email sont obligatoires']);
      return;
    }

    // Mapper l'adresse
    const clientToSave = { ...client, adresse: adresseDto };

    try {
      if (isEditMode) {
        // Mode édition
        const updatedClient = await cltFrsService.updateClient(client.id, clientToSave);
        await savePhoto(updatedClient.id, updatedClient.nom);
      } else {
        // Mode création
        const newClient = await cltFrsService.saveClient(clientToSave);
        await savePhoto(newClient.id, newClient.nom);
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.errors || ['Erreur lors de la sauvegarde']);
    }
  };

  const cancelClick = () => {
    navigate('/dashboard/clients');
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
        context: 'client'
      };

      try {
        await photoService.savePhoto(params);
        navigate('/dashboard/clients');
      } catch (error) {
        console.error('Erreur lors de la sauvegarde de la photo:', error);
        navigate('/dashboard/clients');
      }
    } else {
      navigate('/dashboard/clients');
    }
  };

  const handleInputChange = (field, value) => {
    setClient(prev => ({ ...prev, [field]: value }));
  };

  const handleAdresseChange = (field, value) => {
    setAdresseDto(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="nouveau-client">
      <div className="nouveau-client__header">
        <h2>{isEditMode ? 'Modifier le client' : 'Nouveau client'}</h2>
      </div>

      {errorMsg.length > 0 && (
        <div className="nouveau-client__errors">
          {errorMsg.map((error, index) => (
            <div key={index} className="nouveau-client__error">
              {error}
            </div>
          ))}
        </div>
      )}

      <div className="nouveau-client__form">
        <div className="nouveau-client__section">
          <h3>Informations personnelles</h3>
          
          <div className="nouveau-client__photo-section">
            <img src={imgUrl} alt="Photo client" className="nouveau-client__photo" />
            <input
              type="file"
              accept="image/*"
              onChange={onFileInput}
              className="nouveau-client__file-input"
            />
          </div>

          <div className="nouveau-client__form-row">
            <div className="nouveau-client__form-group">
              <label>Nom *</label>
              <input
                type="text"
                value={client.nom || ''}
                onChange={(e) => handleInputChange('nom', e.target.value)}
                className="nouveau-client__input"
                required
              />
            </div>
            
            <div className="nouveau-client__form-group">
              <label>Prénom *</label>
              <input
                type="text"
                value={client.prenom || ''}
                onChange={(e) => handleInputChange('prenom', e.target.value)}
                className="nouveau-client__input"
                required
              />
            </div>
          </div>

          <div className="nouveau-client__form-row">
            <div className="nouveau-client__form-group">
              <label>Email *</label>
              <input
                type="email"
                value={client.mail || ''}
                onChange={(e) => handleInputChange('mail', e.target.value)}
                className="nouveau-client__input"
                required
              />
            </div>
            
            <div className="nouveau-client__form-group">
              <label>Téléphone</label>
              <input
                type="tel"
                value={client.numTel || ''}
                onChange={(e) => handleInputChange('numTel', e.target.value)}
                className="nouveau-client__input"
              />
            </div>
          </div>
        </div>

        <div className="nouveau-client__section">
          <h3>Adresse</h3>
          
          <div className="nouveau-client__form-group">
            <label>Adresse 1</label>
            <input
              type="text"
              value={adresseDto.adresse1 || ''}
              onChange={(e) => handleAdresseChange('adresse1', e.target.value)}
              className="nouveau-client__input"
            />
          </div>

          <div className="nouveau-client__form-group">
            <label>Adresse 2</label>
            <input
              type="text"
              value={adresseDto.adresse2 || ''}
              onChange={(e) => handleAdresseChange('adresse2', e.target.value)}
              className="nouveau-client__input"
            />
          </div>

          <div className="nouveau-client__form-row">
            <div className="nouveau-client__form-group">
              <label>Code postal</label>
              <input
                type="text"
                value={adresseDto.codePostale || ''}
                onChange={(e) => handleAdresseChange('codePostale', e.target.value)}
                className="nouveau-client__input"
              />
            </div>
            
            <div className="nouveau-client__form-group">
              <label>Ville</label>
              <input
                type="text"
                value={adresseDto.ville || ''}
                onChange={(e) => handleAdresseChange('ville', e.target.value)}
                className="nouveau-client__input"
              />
            </div>
          </div>

          <div className="nouveau-client__form-group">
            <label>Pays</label>
            <input
              type="text"
              value={adresseDto.pays || ''}
              onChange={(e) => handleAdresseChange('pays', e.target.value)}
              className="nouveau-client__input"
            />
          </div>
        </div>

        <div className="nouveau-client__actions">
          <button
            type="button"
            onClick={cancelClick}
            className="nouveau-client__btn nouveau-client__btn--secondary"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={enregistrer}
            className="nouveau-client__btn nouveau-client__btn--primary"
          >
            {isEditMode ? 'Modifier' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NouveauClient;
