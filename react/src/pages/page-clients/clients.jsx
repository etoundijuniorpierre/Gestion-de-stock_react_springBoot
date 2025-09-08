import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonAction from '../../components/button-action/button';
import DetailCltFrs from '../../components/detail-clt-frs/detail-clt-frs';
import Pagination from '../../components/pagination/pagination';
import { CltfrsService } from '../../services/cltfrs/cltfrs.service';
import './clients.scss';

const Clients = () => {
  console.log('🚀 Composant Clients rendu');
  
  const navigate = useNavigate();
  const [listClient, setListClient] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    console.log('🔍 useEffect exécuté');
    findAllClients();
  }, []);

  // Calculer le nombre total de pages et les données à afficher
  useEffect(() => {
    const total = Math.ceil(listClient.length / itemsPerPage);
    setTotalPages(total);
  }, [listClient.length]);

  // Obtenir les clients pour la page courante
  const getCurrentPageClients = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return listClient.slice(startIndex, endIndex);
  };

  // Fonction pour changer de page et remonter en haut
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Remonter en haut de la page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const findAllClients = async () => {
    try {
      console.log('📡 Récupération des clients...');
      setLoading(true);
      const cltFrsService = new CltfrsService();
      const clients = await cltFrsService.findAllClients();
      console.log('✅ Clients récupérés:', clients);
      setListClient(clients || []);
      setErrorMsg('');
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des clients:', error);
      setErrorMsg('Erreur lors de la récupération des clients');
    } finally {
      setLoading(false);
    }
  };

  const nouveauClient = () => {
    console.log('➕ Navigation vers nouveau client');
    navigate('/dashboard/nouveauclient');
  };

  const handleSuppression = (event) => {
    console.log('🗑️ Gestion suppression:', event);
    if (event === 'success') {
      findAllClients();
    } else {
      setErrorMsg(event);
    }
  };

  if (loading) {
    console.log('⏳ Affichage du loader');
    return (
      <div className="clients">
        <div className="text-center p-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p>Chargement des clients...</p>
        </div>
      </div>
    );
  }

  console.log('🎨 Rendu de la liste des clients, count:', listClient.length);
  
  return (
    <div className="clients">
      <div className="col">
        <div className="row m-3">
          <div className="col-md-8 p-0">
            <h1>Liste des clients</h1>
          </div>
          <div className="col-md-4 text-right">
            <ButtonAction
              isNouveauVisible={true}
              isExporterVisible={false}
              isImporterVisible={false}
              onNouveauClick={nouveauClient}
              text="Nouveau Client"
            />
          </div>
        </div>
        
        <div className="col m-3">
          {errorMsg && (
            <div className="alert alert-danger">
              {errorMsg}
            </div>
          )}
          
          {listClient.length === 0 && !errorMsg ? (
            <div className="alert alert-info">
              Aucun client trouvé. Cliquez sur "Nouveau Client" pour en ajouter un.
            </div>
          ) : (
            getCurrentPageClients().map((client, index) => (
              <DetailCltFrs
                key={client.id || index}
                clientFournisseur={client}
                origin="client"
                onSuppressionResult={handleSuppression}
              />
            ))
          )}
        </div>
        
        {listClient.length > 0 && (
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
    </div>
  );
};

export default Clients; 