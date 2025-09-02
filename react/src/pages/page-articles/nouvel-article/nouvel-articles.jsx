import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArticleService } from '../../../services/article/article.service';
import { CategoryService } from '../../../services/category/category.service';
import './nouvel-article.scss';

const NouvelArticle = () => {
  const [article, setArticle] = useState({
    codeArticle: '',
    designation: '',
    prixUnitaireHt: null,
    tauxTva: null,
    prixUnitaireTtc: null,
    categorie: null
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
  }, []);

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
            codeArticle: art.codeArticle || '',
            designation: art.designation || '',
            prixUnitaireHt: art.prixUnitaireHt || null,
            tauxTva: art.tauxTva || null,
            prixUnitaireTtc: art.prixUnitaireTtc || null,
            categorie: art.categorie || null
          });
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'article:', error);
        setErrorMsg('Erreur lors de la récupération de l\'article');
      }
    }
  };

  const annuler = () => navigate('/dashboard/articles');

  const validateForm = () => {
    if (!article.codeArticle || !article.designation || !article.prixUnitaireHt) {
      setErrorMsg('Veuillez remplir tous les champs obligatoires');
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
      await articleService.enregistrerArticle(article);
      setSuccessMsg('Article enregistré avec succès !');
      setTimeout(() => navigate('/dashboard/articles'), 2000);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'article:', error);
      setErrorMsg('Erreur lors de l\'enregistrement de l\'article');
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

  return (
    <div className="nouvel-article">
      <div className="nouvel-article__photo">
        <button className="nouvel-article__photo-btn">
          <img src="favicon.ico" className="nouvel-article__photo-img" width="200" height="200" alt="Photo article" />
          <input hidden type="file" />
        </button>
      </div>

      <hr className="nouvel-article__divider" />

      <div className="nouvel-article__content">
        <div className="nouvel-article__header">
          <h2 className="nouvel-article__title">
            <i className="fas fa-info-circle nouvel-article__icon"></i>&nbsp;Informations de l'article
          </h2>
        </div>

        {errorMsg && (
          <div className="nouvel-article__error">{errorMsg}</div>
        )}
        
        {successMsg && (
          <div className="nouvel-article__success">{successMsg}</div>
        )}

        <form className="nouvel-article__form">
          <div className="nouvel-article__form-row">
            <div className="nouvel-article__form-group">
              <input
                type="text"
                className="nouvel-article__input"
                name="codearticle"
                placeholder="Code article"
                value={article.codeArticle || ''}
                onChange={e => onChange('codeArticle', e.target.value)}
                required
              />
            </div>
            <div className="nouvel-article__form-group">
              <input
                type="text"
                className="nouvel-article__input"
                name="designation"
                placeholder="Désignation"
                value={article.designation || ''}
                onChange={e => onChange('designation', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="nouvel-article__form-row">
            <div className="nouvel-article__form-group">
              <input
                type="number"
                className="nouvel-article__input"
                name="prixunitht"
                placeholder="Prix unitaire HT"
                value={article.prixUnitaireHt || ''}
                onChange={e => onChange('prixUnitaireHt', e.target.value)}
                required
              />
            </div>
            <div className="nouvel-article__form-group">
              <input
                type="number"
                className="nouvel-article__input"
                name="tauxtva"
                placeholder="Taux TVA"
                value={article.tauxTva || ''}
                onChange={e => onChange('tauxTva', e.target.value)}
              />
            </div>
          </div>

          <div className="nouvel-article__form-row">
            <div className="nouvel-article__form-group">
              <input
                type="number"
                className="nouvel-article__input"
                name="prixunitttc"
                placeholder="Prix unitaire TTC"
                value={article.prixUnitaireTtc || ''}
                onChange={e => onChange('prixUnitaireTtc', e.target.value)}
              />
            </div>
            <div className="nouvel-article__form-group">
              <select
                className="nouvel-article__select"
                name="cat"
                value={article.categorie?.id || ''}
                onChange={e => {
                  const selectedCat = categories.find(cat => cat.id === Number(e.target.value));
                  onChange('categorie', selectedCat);
                }}
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.designation}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>

        <div className="nouvel-article__actions">
          <button
            className="nouvel-article__btn nouvel-article__btn--secondary"
            onClick={annuler}
            disabled={isLoading}
          >
            <i className="fas fa-ban"></i>&nbsp;Annuler
          </button>
          <button
            className="nouvel-article__btn nouvel-article__btn--primary"
            onClick={enregistrer}
            disabled={isLoading}
          >
            <i className="fas fa-save"></i>&nbsp;
            {isLoading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NouvelArticle;
