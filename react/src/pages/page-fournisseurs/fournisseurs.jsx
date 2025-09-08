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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 15;
  const navigate = useNavigate();
  const cltFrsService = new CltfrsService();

  useEffect(() => {
    findAllFournisseurs();
  }, []);

  // Calculer le nombre total de pages
  useEffect(() => {
    const total = Math.ceil(listFournisseur.length / itemsPerPage);
    setTotalPages(total);
  }, [listFournisseur.length]);

  // Obtenir les fournisseurs pour la page courante
  const getCurrentPageFournisseurs = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return listFournisseur.slice(startIndex, endIndex);
  };

  // Fonction pour changer de page et remonter en haut
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Remonter en haut de la page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        
        {getCurrentPageFournisseurs().map((fournisseur) => (
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
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              showFirstLast={true}
              maxVisiblePages={5}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Fournisseurs;