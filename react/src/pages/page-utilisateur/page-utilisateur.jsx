import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserService } from '../../services/user/user.service';
import ButtonAction from '../../components/button-action/button';
import DetailUtilisateur from '../../components/detail-utilisateur/detail-utilisateur';
import Pagination from '../../components/pagination/pagination';
import './page-utilisateur.scss';

const PageUtilisateur = () => {
  const [listUtilisateurs, setListUtilisateurs] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 15;
  const navigate = useNavigate();
  const userService = new UserService();

  useEffect(() => {
    findAllUtilisateurs();
  }, []);

  // Calculer le nombre total de pages
  useEffect(() => {
    const total = Math.ceil(listUtilisateurs.length / itemsPerPage);
    setTotalPages(total);
  }, [listUtilisateurs.length]);

  // Obtenir les utilisateurs pour la page courante
  const getCurrentPageUtilisateurs = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return listUtilisateurs.slice(startIndex, endIndex);
  };

  // Fonction pour changer de page et remonter en haut
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Remonter en haut de la page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const findAllUtilisateurs = async () => {
    try {
      const utilisateurs = await userService.findAll();
      setListUtilisateurs(utilisateurs);
      setErrorMsg('');
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      setErrorMsg('Erreur lors de la récupération des utilisateurs');
    }
  };

  const nouvelUtilisateur = () => {
    navigate('/dashboard/nouvelutilisateur');
  };

  const handleSuppression = (event) => {
    if (event === 'success') {
      findAllUtilisateurs();
      setErrorMsg('');
    } else {
      setErrorMsg(event);
    }
  };

  return (
    <div className="col">
      <div className="row m-3">
        <div className="col-md-8 p-0">
          <h1>Liste des utilisateurs</h1>
        </div>
        <div className="col-md-4 text-right">
          <ButtonAction
            onClick={nouvelUtilisateur}
            text="Nouvel utilisateur"
          />
        </div>
      </div>
      
      <div className="col m-3">
        {errorMsg && (
          <div className="alert alert-danger">
            {errorMsg}
          </div>
        )}
        
        {getCurrentPageUtilisateurs().map((utilisateur) => (
          <DetailUtilisateur
            key={utilisateur.id}
            utilisateur={utilisateur}
            onSuppressionResult={handleSuppression}
          />
        ))}
      </div>
      
      {listUtilisateurs.length > 0 && (
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

export default PageUtilisateur;
