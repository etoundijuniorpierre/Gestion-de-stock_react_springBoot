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
    <div className="nouveau-client-form">
      {/* En-tête du formulaire */}
      <div className="form-header">
        <h2>
          <i className="fas fa-user-plus"></i>
          {isEditMode ? 'Modifier le client' : 'Nouveau client'}
        </h2>
      </div>
      
      {/* Contenu du formulaire */}
      <div className="form-content">
        {/* Messages d'erreur */}
        {errorMsg.length > 0 && (
          <div className="alert alert-danger">
            {errorMsg.map((error, index) => (
              <div key={index}>
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
              </div>
            ))}
          </div>
        )}

        <form>
        <div className="form-section">
          <h3>Informations personnelles</h3>
          
          <div className="photo-section">
            <img src={imgUrl} alt="Photo client" className="nouveau-client__photo" />
            <input
              type="file"
              accept="image/*"
              onChange={onFileInput}
              className="nouveau-client__file-input"
            />
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">Nom</label>
                <input
                  type="text"
                  value={client.nom || ''}
                  onChange={(e) => handleInputChange('nom', e.target.value)}
                  className="form-control"
                  required
                />
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">Prénom</label>
                <input
                  type="text"
                  value={client.prenom || ''}
                  onChange={(e) => handleInputChange('prenom', e.target.value)}
                  className="form-control"
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
                  value={client.mail || ''}
                  onChange={(e) => handleInputChange('mail', e.target.value)}
                  className="form-control"
                  required
                />
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label optional">Téléphone</label>
                <input
                  type="tel"
                  value={client.numTel || ''}
                  onChange={(e) => handleInputChange('numTel', e.target.value)}
                  className="form-control"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-section adresse-section">
          <h3>Adresse</h3>
          
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label optional">Adresse 1</label>
                <input
                  type="text"
                  value={adresseDto.adresse1 || ''}
                  onChange={(e) => handleAdresseChange('adresse1', e.target.value)}
                  className="form-control"
                />
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label optional">Adresse 2</label>
                <input
                  type="text"
                  value={adresseDto.adresse2 || ''}
                  onChange={(e) => handleAdresseChange('adresse2', e.target.value)}
                  className="form-control"
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label className="form-label optional">Code postal</label>
                <input
                  type="text"
                  value={adresseDto.codePostale || ''}
                  onChange={(e) => handleAdresseChange('codePostale', e.target.value)}
                  className="form-control"
                />
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="form-group">
                <label className="form-label optional">Ville</label>
                <input
                  type="text"
                  value={adresseDto.ville || ''}
                  onChange={(e) => handleAdresseChange('ville', e.target.value)}
                  className="form-control"
                />
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="form-group">
                <label className="form-label optional">Pays</label>
                <input
                  type="text"
                  value={adresseDto.pays || ''}
                  onChange={(e) => handleAdresseChange('pays', e.target.value)}
                  className="form-control"
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
          {isEditMode ? 'Modifier' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
};

export default NouveauClient;
