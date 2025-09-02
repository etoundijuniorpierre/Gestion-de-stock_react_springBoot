import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CategoryService } from '../../services/category/category.service';

const CategorieDetails = () => {
  const [categorie, setCategorie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const categoryService = new CategoryService();

  useEffect(() => {
    if (id) {
      findCategorieById(id);
    }
  }, [id]);

  const findCategorieById = async (categoryId) => {
    try {
      setLoading(true);
      const category = await categoryService.findById(categoryId);
      if (category && category.id) {
        setCategorie(category);
      } else {
        setError('Catégorie non trouvée');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la catégorie:', error);
      setError(error.message || 'Erreur lors de la récupération de la catégorie');
    } finally {
      setLoading(false);
    }
  };

  const retourListe = () => {
    navigate('/dashboard/categories');
  };

  const modifierCategorie = () => {
    navigate(`/dashboard/nouvellecategorie/${id}`);
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

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <h4>Erreur</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={retourListe}>
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  if (!categorie) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          <h4>Catégorie non trouvée</h4>
          <button className="btn btn-primary" onClick={retourListe}>
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Détails de la catégorie</h2>
            <div>
              <button className="btn btn-warning me-2" onClick={modifierCategorie}>
                <i className="fas fa-pencil-alt"></i>&nbsp;Modifier
              </button>
              <button className="btn btn-secondary" onClick={retourListe}>
                <i className="fas fa-arrow-left"></i>&nbsp;Retour
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h5>Informations de la catégorie</h5>
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <td><strong>ID :</strong></td>
                        <td>{categorie.id}</td>
                      </tr>
                      <tr>
                        <td><strong>Code :</strong></td>
                        <td>{categorie.code || 'Non renseigné'}</td>
                      </tr>
                      <tr>
                        <td><strong>Désignation :</strong></td>
                        <td>{categorie.designation || 'Non renseignée'}</td>
                      </tr>
                      <tr>
                        <td><strong>ID Entreprise :</strong></td>
                        <td>{categorie.idEntreprise || 'Non renseigné'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="col-md-6">
                  <h5>Actions disponibles</h5>
                  <div className="d-grid gap-2">
                    <button className="btn btn-warning" onClick={modifierCategorie}>
                      <i className="fas fa-pencil-alt"></i>&nbsp;Modifier cette catégorie
                    </button>
                    <button className="btn btn-info" onClick={retourListe}>
                      <i className="fas fa-list"></i>&nbsp;Voir toutes les catégories
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorieDetails;
