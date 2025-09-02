import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CategoryService } from '../../services/category/category.service';

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
    <div className="col mb-3">
      <div className="col-md-12">
        <div className="col-md-12 mb-3 mt-3">
          <h2>{isEdit ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h2>
        </div>
        <div className="col-md-12">
          {errorMsg.length > 0 && (
            <div className="alert alert-danger">
              {errorMsg.map((msg, index) => (
                <div key={index}>
                  <span>{msg}</span>
                </div>
              ))}
            </div>
          )}
          
          <form>
            <div className="row mb-3">
              <div className="col">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Code catégorie" 
                  name="code" 
                  value={categoryDto.code}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Description" 
                  name="designation" 
                  value={categoryDto.designation}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </form>
        </div>
      </div>
      
      <div className="col-md-12 text-right">
        <button 
          className="btn btn-danger mr-3" 
          onClick={cancel}
          disabled={loading}
        >
          <i className="fas fa-ban"></i>&nbsp;
          Annuler
        </button>
        <button 
          className="btn btn-primary" 
          onClick={enregistrerCategory}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
              {isEdit ? 'Modifier' : 'Enregistrer'}
            </>
          ) : (
            <>
              <i className="fas fa-save"></i>&nbsp;
              {isEdit ? 'Modifier' : 'Enregistrer'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default NouvelleCategorie;
