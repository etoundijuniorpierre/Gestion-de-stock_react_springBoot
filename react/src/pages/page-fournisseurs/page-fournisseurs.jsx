import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CltfrsService } from '../../services/cltfrs/cltfrs.service';
import DetailFrs from '../../components/detail-frs/detail-frs';
import './page-fournisseurs.scss';

const PageFournisseurs = () => {
  const [listFournisseurs, setListFournisseurs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const cltFrsService = new CltfrsService();

  useEffect(() => {
    findAllFournisseurs();
  }, []);

  const findAllFournisseurs = async () => {
    try {
      setIsLoading(true);
      const fournisseurs = await cltFrsService.findAllFournisseurs();
      setListFournisseurs(fournisseurs);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des fournisseurs');
      console.error('Erreur lors du chargement des fournisseurs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const nouveauFournisseur = () => {
    navigate('/dashboard/nouveaufournisseur');
  };

  const modifierFournisseur = (id) => {
    if (id) {
      navigate(`/dashboard/nouveaufournisseur/${id}`);
    }
  };

  const handleSuppression = (result) => {
    if (result === 'success') {
      findAllFournisseurs();
    }
  };

  if (isLoading) {
    return (
      <div className="page-fournisseurs">
        <div className="page-fournisseurs__loading">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Chargement des fournisseurs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page-fournisseurs">
      <div className="page-fournisseurs__header">
        <h1>Gestion des Fournisseurs</h1>
        <button className="page-fournisseurs__btn page-fournisseurs__btn--primary" onClick={nouveauFournisseur}>
          <i className="fas fa-plus"></i> Nouveau Fournisseur
        </button>
      </div>

      {error && (
        <div className="page-fournisseurs__error">
          <i className="fas fa-exclamation-triangle"></i>
          <span>{error}</span>
        </div>
      )}

      {/* Liste des fournisseurs */}
      {listFournisseurs.length > 0 && (
        <div className="page-fournisseurs__content">
          {listFournisseurs.map((fournisseur) => (
            <DetailFrs
              key={fournisseur.id}
              fournisseur={fournisseur}
              onSuppressionResult={handleSuppression}
            />
          ))}
        </div>
      )}

      {/* Message si aucun fournisseur */}
      {!isLoading && !listFournisseurs.length && (
        <div className="page-fournisseurs__empty">
          <i className="fas fa-truck"></i>
          <h3>Aucun fournisseur trouvé</h3>
          <p>Créez votre premier fournisseur pour commencer !</p>
          <button className="page-fournisseurs__btn page-fournisseurs__btn--primary" onClick={nouveauFournisseur}>
            <i className="fas fa-plus"></i> Créer un fournisseur
          </button>
        </div>
      )}
    </div>
  );
};

export default PageFournisseurs;
