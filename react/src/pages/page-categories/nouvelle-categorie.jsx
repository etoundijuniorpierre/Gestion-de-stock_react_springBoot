import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CategoryService } from '../../services/category/category.service';
import './nouvelle-categorie.scss';

const NouvelleCategorie = () => {
  const [categoryDto, setCategoryDto] = useState({
    code: '',
    designation: ''
  });
  const [errorMsg, setErrorMsg] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const categoryService = new CategoryService();

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      findCategoryById(id);
    }
  }, [id]);

  const findCategoryById = async (categoryId) => {
    try {
      setLoading(true);
      const category = await categoryService.findById(categoryId);
      if (category && category.id) {
        setCategoryDto({
          code: category.code || '',
          designation: category.designation || ''
        });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la catégorie:', error);
      setErrorMsg([error.message || 'Erreur lors de la récupération de la catégorie']);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryDto(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const cancel = () => {
    navigate('/dashboard/categories');
  };

  const enregistrerCategory = async () => {
    try {
      setLoading(true);
      setErrorMsg([]);

      // Validation
      if (!categoryDto.code || !categoryDto.designation) {
        setErrorMsg(['Le code et la désignation sont obligatoires']);
        return;
      }

      if (isEdit && id) {
        // Pour la modification, on ajoute l'ID
        const categoryToUpdate = { ...categoryDto, id: parseInt(id) };
        await categoryService.save(categoryToUpdate);
      } else {
        // Pour la création
        await categoryService.save(categoryDto);
      }

      navigate('/dashboard/categories');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      if (error.message) {
        setErrorMsg([error.message]);
      } else {
        setErrorMsg(['Erreur lors de la sauvegarde de la catégorie']);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="nouvelle-categorie-form">
      {/* En-tête du formulaire */}
      <div className="form-header">
        <h2>
          <i className="fas fa-tags"></i>
          {isEdit ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
        </h2>
      </div>
      
      {/* Contenu du formulaire */}
      <div className="form-content">
        {/* Messages d'erreur */}
        {errorMsg.length > 0 && (
          <div className="alert alert-danger">
            {errorMsg.map((msg, index) => (
              <div key={index}>
                <i className="fas fa-exclamation-triangle me-2"></i>
                {msg}
              </div>
            ))}
          </div>
        )}

        <form>
          {/* Section Informations de base */}
          <div className="form-section">
            <h5 className="section-title">Informations de la catégorie</h5>
            
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label" htmlFor="code">Code catégorie</label>
                  <input 
                    type="text" 
                    id="code"
                    className="form-control" 
                    placeholder="Code catégorie" 
                    name="code" 
                    value={categoryDto.code}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label" htmlFor="designation">Désignation</label>
                  <input 
                    type="text" 
                    id="designation"
                    className="form-control" 
                    placeholder="Description" 
                    name="designation" 
                    value={categoryDto.designation}
                    onChange={handleInputChange}
                    required
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
          onClick={cancel}
          disabled={loading}
        >
          <i className="fas fa-ban"></i>
          Annuler
        </button>
        <button 
          type="button"
          className="btn btn-primary" 
          onClick={enregistrerCategory}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border" role="status" aria-hidden="true"></span>
              {isEdit ? 'Modification...' : 'Enregistrement...'}
            </>
          ) : (
            <>
              <i className="fas fa-save"></i>
              {isEdit ? 'Modifier' : 'Enregistrer'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default NouvelleCategorie;
