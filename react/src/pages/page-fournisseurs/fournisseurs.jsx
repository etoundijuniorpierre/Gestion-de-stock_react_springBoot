import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CltfrsService } from '../../services/cltfrs/cltfrs.service';
import ButtonAction from '../../components/button-action/button';
import DetailCltFrs from '../../components/detail-clt-frs/detail-clt-frs';
import Pagination from '../../components/pagination/pagination';
import './fournisseurs.scss';

const Fournisseurs = () => {
  const [listFournisseur, setListFournisseur] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const cltFrsService = new CltfrsService();

  useEffect(() => {
    findAllFournisseurs();
  }, []);

  const findAllFournisseurs = async () => {
    try {
      const fournisseurs = await cltFrsService.findAllFournisseurs();
      setListFournisseur(fournisseurs);
    } catch (error) {
      console.error('Erreur lors de la récupération des fournisseurs:', error);
      setErrorMsg('Erreur lors de la récupération des fournisseurs');
    }
  };

  const nouveauFournisseur = () => {
    navigate('/dashboard/nouveaufournisseur');
  };

  const handleSuppression = (event) => {
    if (event === 'success') {
      findAllFournisseurs();
      setErrorMsg('');
    } else {
      setErrorMsg(event);
    }
  };

  return (
    <div className="col">
      <div className="row m-3">
        <div className="col-md-8 p-0">
          <h1>Liste des fournisseurs</h1>
        </div>
        <div className="col-md-4 text-right">
          <ButtonAction
            onClick={nouveauFournisseur}
            text="Nouveau fournisseur"
          />
        </div>
      </div>
      
      <div className="col m-3">
        {errorMsg && (
          <div className="alert alert-danger">
            {errorMsg}
          </div>
        )}
        
        {listFournisseur.map((fournisseur) => (
          <DetailCltFrs
            key={fournisseur.id}
            clientFournisseur={fournisseur}
            origin="fournisseur"
            onSuppressionResult={handleSuppression}
          />
        ))}
      </div>
      
      {listFournisseur.length > 0 && (
        <div className="row mb-3">
          <div className="col-md-12 text-center">
            <Pagination />
          </div>
        </div>
      )}
    </div>
  );
};

export default Fournisseurs;