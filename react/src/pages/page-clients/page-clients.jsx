import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CltfrsService } from '../../services/cltfrs/cltfrs.service';
import DetailClt from '../../components/detail-clt/detail-clt';
import './page-clients.scss';

const PageClients = () => {
  const [listClient, setListClient] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const cltFrsService = new CltfrsService();

  useEffect(() => {
    findAllClients();
  }, []);

  const findAllClients = async () => {
    try {
      setIsLoading(true);
      const clients = await cltFrsService.findAllClients();
      setListClient(clients);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des clients');
      console.error('Erreur lors du chargement des clients:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const nouveauClient = () => {
    navigate('/dashboard/nouveauclient');
  };

  const modifierClient = (id) => {
    if (id) {
      navigate(`/dashboard/nouveauclient/${id}`);
    }
  };

  const handleSuppression = (result) => {
    if (result === 'success') {
      findAllClients();
    }
  };

  if (isLoading) {
    return (
      <div className="page-clients">
        <div className="page-clients__loading">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Chargement des clients...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page-clients">
      <div className="page-clients__header">
        <h1>Gestion des Clients</h1>
        <button className="page-clients__btn page-clients__btn--primary" onClick={nouveauClient}>
          <i className="fas fa-plus"></i> Nouveau Client
        </button>
      </div>

      {error && (
        <div className="page-clients__error">
          <i className="fas fa-exclamation-triangle"></i>
          <span>{error}</span>
        </div>
      )}

      {/* Liste des clients */}
      {listClient.length > 0 && (
        <div className="page-clients__content">
          {listClient.map((client) => (
            <DetailClt
              key={client.id}
              client={client}
              onSuppressionResult={handleSuppression}
            />
          ))}
        </div>
      )}

      {/* Message si aucun client */}
      {!isLoading && !listClient.length && (
        <div className="page-clients__empty">
          <i className="fas fa-users"></i>
          <h3>Aucun client trouvé</h3>
          <p>Créez votre premier client pour commencer !</p>
          <button className="page-clients__btn page-clients__btn--primary" onClick={nouveauClient}>
            <i className="fas fa-plus"></i> Créer un client
          </button>
        </div>
      )}
    </div>
  );
};

export default PageClients;
