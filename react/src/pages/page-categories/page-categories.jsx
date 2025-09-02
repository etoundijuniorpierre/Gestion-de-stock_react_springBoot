import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CategoryService } from '../../services/category/category.service';
import ButtonAction from '../../components/button-action/button.jsx';
import Pagination from '../../components/pagination/pagination.jsx';

const PageCategories = () => {
  const [listCategories, setListCategories] = useState([]);
  const [selectedCatIdToDelete, setSelectedCatIdToDelete] = useState(-1);
  const [errorMsgs, setErrorMsgs] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const categoryService = new CategoryService();

  useEffect(() => {
    findAllCategories();
  }, []);

  const findAllCategories = async () => {
    try {
      setLoading(true);
      const categories = await categoryService.findAll();
      setListCategories(categories);
      setErrorMsgs('');
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      setErrorMsgs('Erreur lors de la récupération des catégories');
    } finally {
      setLoading(false);
    }
  };

  const nouvelleCategory = () => {
    navigate('/nouvellecategorie');
  };

  const modifierCategory = (id) => {
    navigate(`/nouvellecategorie/${id}`);
  };

  const confirmerEtSupprimerCat = async () => {
    if (selectedCatIdToDelete !== -1) {
      try {
        const result = await categoryService.delete(selectedCatIdToDelete);
        if (result.success) {
          setSelectedCatIdToDelete(-1);
          findAllCategories();
        } else {
          setErrorMsgs('Erreur lors de la suppression de la catégorie');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setErrorMsgs('Erreur lors de la suppression de la catégorie');
      }
    }
  };

  const annulerSuppressionCat = () => {
    setSelectedCatIdToDelete(-1);
  };

  const selectCatPourSupprimer = (id) => {
    setSelectedCatIdToDelete(id);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="col">
      <div className="row m-3">
        <div className="col-md-8 p-0">
          <h1>Liste des catégories</h1>
        </div>
        <div className="col-md-4 text-right">
          <ButtonAction
            onClick={nouvelleCategory}
            text="Nouvelle catégorie"
          />
        </div>
      </div>
      
      <div className="col m-3">
        {errorMsgs && (
          <div className="row col-md-12 alert alert-danger">
            {errorMsgs}
          </div>
        )}
        
        {listCategories.length === 0 ? (
          <div className="row col-md-12 custom-border mb-3 p-3">
            <div className="col-md-12 text-center">
              Aucune catégorie trouvée
            </div>
          </div>
        ) : (
          listCategories.map((cat) => (
            <div key={cat.id} className="row col-md-12 custom-border mb-3 p-3">
              <div className="col-md-3 custom-border-right">
                {cat.code}
              </div>
              <div className="col-md-4 custom-border-right">
                {cat.designation}
              </div>
              <div className="col-md-3">
                <div className="row">
                  <div className="col-md-4">
                    <button 
                      type="button" 
                      className="btn btn-link" 
                      onClick={() => modifierCategory(cat.id)}
                    >
                      <i className="fas fa-pencil-alt"></i>&nbsp;Modifier
                    </button>
                  </div>
                  <div className="col-md-4">
                    <button 
                      type="button" 
                      className="btn btn-link text-danger" 
                      data-toggle="modal" 
                      data-target="#modalDeleteCat"
                      onClick={() => selectCatPourSupprimer(cat.id)}
                    >
                      <i className="fas fa-trash-alt"></i>&nbsp;Supprimer
                    </button>
                  </div>
                  <div className="col-md-4">
                    <button type="button" className="btn btn-link">
                      <i className="far fa-list-alt"></i>&nbsp;Détails
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {listCategories.length > 0 && (
        <div className="row mb-3">
          <div className="col-md-12 text-center">
            <Pagination />
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      <div 
        className="modal fade" 
        id="modalDeleteCat" 
        data-backdrop="static" 
        data-keyboard="false" 
        tabIndex="-1" 
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">Confirmation</h5>
              <button 
                type="button" 
                className="close" 
                data-dismiss="modal" 
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              Êtes-vous sûr de vouloir supprimer cette catégorie ?
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                data-dismiss="modal" 
                onClick={annulerSuppressionCat}
              >
                <i className="fas fa-ban"></i>&nbsp;Annuler
              </button>
              <button 
                type="button" 
                className="btn btn-danger" 
                data-dismiss="modal" 
                onClick={confirmerEtSupprimerCat}
              >
                <i className="fas fa-trash-alt"></i>&nbsp;Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageCategories;
