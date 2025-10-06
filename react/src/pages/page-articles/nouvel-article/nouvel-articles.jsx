import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArticleService } from '../../../services/article/article.service';
import { CategoryService } from '../../../services/category/category.service';
import './nouvel-article.scss';

const NouvelArticle = () => {
  const [article, setArticle] = useState({
    id: null,
    codeArticle: '',
    designation: '',
    prixUnitaireHt: null,
    tauxTva: null,
    prixUnitaireTtc: null,
    photo: '',
    categorie: null,
    idEntreprise: null
  });
  const [categories, setCategories] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const articleService = new ArticleService();
  const categoryService = new CategoryService();

  useEffect(() => {
    loadCategories();
    checkEditMode();
    initializeArticle();
  }, []);

  // Auto-calculate prixUnitaireTtc when prixUnitaireHt or tauxTva changes
  useEffect(() => {
    if (article.prixUnitaireHt && article.tauxTva && article.prixUnitaireHt > 0) {
      const tvaRate = Number(article.tauxTva) / 100; // Convert percentage to decimal
      const calculatedTtc = Number(article.prixUnitaireHt) * (1 + tvaRate);
      setArticle(prev => ({
        ...prev,
        prixUnitaireTtc: Math.round(calculatedTtc * 100) / 100 // Round to 2 decimal places
      }));
    }
  }, [article.prixUnitaireHt, article.tauxTva]);

  const initializeArticle = () => {
    // Récupérer l'ID de l'utilisateur depuis le localStorage
    // Maintenant que loginService stocke directement l'ID, on peut le récupérer facilement
    let idUser = localStorage.getItem('idUser') || localStorage.getItem('id');
    
    if (idUser) {
      setArticle(prev => ({
        ...prev,
        idEntreprise: Number(idUser)
      }));
      console.log('✅ ID entreprise défini:', Number(idUser));
    } else {
      console.warn('❌ ID utilisateur non trouvé dans le localStorage');
      
      // Fallback : essayer de récupérer depuis l'objet connectedUser
      const connectedUserStr = localStorage.getItem('connectedUser');
      if (connectedUserStr) {
        try {
          const connectedUser = JSON.parse(connectedUserStr);
          if (connectedUser.id) {
            setArticle(prev => ({
              ...prev,
              idEntreprise: Number(connectedUser.id)
            }));
            console.log('✅ ID entreprise récupéré depuis connectedUser:', Number(connectedUser.id));
          }
        } catch (e) {
          console.error('❌ Erreur parsing connectedUser:', e);
        }
      }
    }
  };

  const loadCategories = async () => {
    try {
      const cats = await categoryService.findAll();
      setCategories(cats || []);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      setErrorMsg('Erreur lors du chargement des catégories');
    }
  };

  const checkEditMode = async () => {
    if (id) {
      setIsEditMode(true);
      try {
        const art = await articleService.findArticleById(Number(id));
        if (art && art.id) {
          setArticle({
            id: art.id,
            codeArticle: art.codeArticle || '',
            designation: art.designation || '',
            prixUnitaireHt: art.prixUnitaireHt || null,
            tauxTva: art.tauxTva || null,
            prixUnitaireTtc: art.prixUnitaireTtc || null,
            photo: art.photo || '',
            categorie: art.categorie || null,
            idEntreprise: art.idEntreprise || null
          });
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'article:', error);
        setErrorMsg('Erreur lors de la récupération de l\'article');
      }
    }
  };

  const annuler = () => navigate('/dashboard/article');

  const validateForm = () => {
    if (!article.codeArticle || !article.designation || !article.prixUnitaireHt) {
      setErrorMsg('Veuillez remplir tous les champs obligatoires (Code, Désignation, Prix HT)');
      return false;
    }

    if (!article.categorie && categories.length === 0) {
      setErrorMsg('Aucune catégorie disponible. Veuillez créer une catégorie d\'abord.');
      return false;
    }

    if (!article.categorie) {
      setErrorMsg('Veuillez sélectionner une catégorie');
      return false;
    }

    if (!article.idEntreprise) {
      setErrorMsg('Erreur: ID de l\'entreprise non trouvé. Veuillez vous reconnecter.');
      return false;
    }

    return true;
  };

  const enregistrer = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // Préparer les données selon le format attendu par le backend
      const articleData = {
        id: article.id,
        codeArticle: article.codeArticle,
        designation: article.designation,
        prixUnitaireHt: Number(article.prixUnitaireHt),
        tauxTva: article.tauxTva ? Number(article.tauxTva) : 0,
        prixUnitaireTtc: article.prixUnitaireTtc ? Number(article.prixUnitaireTtc) : 0,
        photo: article.photo || '',
        categorie: article.categorie, // Send the complete category object instead of just partial data
        idEntreprise: article.idEntreprise
      };

      console.log('Données de l\'article à envoyer:', articleData);
      
      if (isEditMode) {
        await articleService.updateArticle(article.id, articleData);
        setSuccessMsg('Article modifié avec succès !');
      } else {
        await articleService.enregistrerArticle(articleData);
        setSuccessMsg('Article enregistré avec succès !');
      }
      setTimeout(() => navigate('/dashboard/article'), 2000);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'article:', error);
      setErrorMsg(isEditMode ? 'Erreur lors de la modification de l\'article' : 'Erreur lors de l\'enregistrement de l\'article');
    } finally {
      setIsLoading(false);
    }
  };

  const onChange = (field, value) => {
    // Convertir les champs numériques
    let processedValue = value;
    if (['prixUnitaireHt', 'tauxTva', 'prixUnitaireTtc'].includes(field)) {
      processedValue = value === '' ? null : Number(value);
    }
    setArticle(prev => ({ ...prev, [field]: processedValue }));
  };

  if (isLoading) {
    return (
      <div className="nouvel-article-form">
        <div className="form-content d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="ms-3">Chargement en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="nouvel-article-form">
      {/* En-tête du formulaire */}
      <div className="form-header">
        <h2>
          <i className="fas fa-box"></i>
          {isEditMode ? 'Modifier l\'article' : 'Nouvel article'}
        </h2>
      </div>

      {/* Contenu du formulaire */}
      <div className="form-content">
        {/* Messages d'erreur/succès */}
        {errorMsg && (
          <div className="alert alert-danger">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {errorMsg}
          </div>
        )}
        
        {successMsg && (
          <div className="alert alert-success">
            <i className="fas fa-check-circle me-2"></i>
            {successMsg}
          </div>
        )}

        <form>
          {/* Section Photo */}
          <div className="form-section">
            <h5 className="section-title">Photo de l'article</h5>
            <div className="photo-section">
              <img 
                src={article.photo || "/src/assets/product.png"} 
                alt="Photo article" 
                className="nouveau-client__photo" 
              />
              <input
                type="file"
                accept="image/*"
                className="nouveau-client__file-input"
                onChange={e => {
                  const file = e.target.files[0];
                  if (file) {
                    // Créer une URL temporaire pour l'image
                    const imageUrl = URL.createObjectURL(file);
                    onChange('photo', imageUrl);
                  }
                }}
              />
            </div>
          </div>

          {/* Section Informations de base */}
          <div className="form-section">
            <h5 className="section-title">Informations de l'article</h5>
            
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label" htmlFor="codeArticle">Code Article</label>
                  <input
                    type="text"
                    id="codeArticle"
                    className="form-control"
                    name="codearticle"
                    placeholder="Code article"
                    value={article.codeArticle || ''}
                    onChange={e => onChange('codeArticle', e.target.value)}
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
                    name="designation"
                    placeholder="Désignation"
                    value={article.designation || ''}
                    onChange={e => onChange('designation', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label" htmlFor="prixUnitaireHt">Prix unitaire HT</label>
                  <input
                    type="number"
                    id="prixUnitaireHt"
                    className="form-control"
                    name="prixunitht"
                    placeholder="Prix unitaire HT"
                    value={article.prixUnitaireHt || ''}
                    onChange={e => onChange('prixUnitaireHt', e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label optional" htmlFor="tauxTva">Taux TVA</label>
                  <input
                    type="number"
                    id="tauxTva"
                    className="form-control"
                    name="tauxtva"
                    placeholder="Taux TVA"
                    value={article.tauxTva || ''}
                    onChange={e => onChange('tauxTva', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label optional" htmlFor="prixUnitaireTtc">Prix unitaire TTC</label>
                  <input
                    type="number"
                    id="prixUnitaireTtc"
                    className="form-control"
                    name="prixunitttc"
                    placeholder="Calculé automatiquement"
                    value={article.prixUnitaireTtc || ''}
                    onChange={e => onChange('prixUnitaireTtc', e.target.value)}
                    readOnly
                  />
                  <small className="form-text text-muted">
                    <i className="fas fa-calculator me-1"></i>
                    Calculé automatiquement à partir du prix HT et du taux TVA
                  </small>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label optional" htmlFor="categorie">Catégorie</label>
                  <select
                    id="categorie"
                    className="form-control"
                    name="cat"
                    value={article.categorie?.id || ''}
                    onChange={e => {
                      const selectedCat = categories.find(cat => cat.id === Number(e.target.value));
                      onChange('categorie', selectedCat);
                    }}
                    disabled={categories.length === 0}
                  >
                    <option value="">
                      {categories.length === 0 ? 'Aucune catégorie disponible' : 'Sélectionner une catégorie'}
                    </option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.designation}
                      </option>
                    ))}
                  </select>
                  {categories.length === 0 && (
                    <small className="form-text text-muted">
                      <button
                        type="button"
                        className="btn btn-link p-0"
                        onClick={() => navigate('/dashboard/nouvellecategorie')}
                        style={{ textDecoration: 'none', color: '#007bff' }}
                      >
                        Créer une catégorie
                      </button>
                    </small>
                  )}
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
          onClick={annuler}
          disabled={isLoading}
        >
          <i className="fas fa-ban"></i>
          Annuler
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={enregistrer}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border" role="status" aria-hidden="true"></span>
              Enregistrement...
            </>
          ) : (
            <>
              <i className="fas fa-save"></i>
              Enregistrer
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default NouvelArticle;
