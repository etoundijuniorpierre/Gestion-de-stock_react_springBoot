import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CltfrsService } from '../../services/cltfrs/cltfrs.service';
import { CmdcltfrsService } from '../../services/cmdcltfrs.service';
import { ArticleService } from '../../services/article/article.service';
import './nouveau-cmd-frs.scss';

const NouveauCmdFrs = () => {
  const [selectedFournisseur, setSelectedFournisseur] = useState({});
  const [listFournisseurs, setListFournisseurs] = useState([]);
  const [searchedArticle, setSearchedArticle] = useState({});
  const [listArticle, setListArticle] = useState([]);
  const [codeArticle, setCodeArticle] = useState('');
  const [quantite, setQuantite] = useState('');
  const [codeCommande, setCodeCommande] = useState('');
  const [lignesCommande, setLignesCommande] = useState([]);
  const [totalCommande, setTotalCommande] = useState(0);
  const [articleNotYetSelected, setArticleNotYetSelected] = useState(false);
  const [errorMsg, setErrorMsg] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();
  const cltFrsService = new CltfrsService();
  const cmdCltFrsService = new CmdcltfrsService();
  const articleService = new ArticleService();

  useEffect(() => {
    findAllFournisseurs();
    findAllArticles();
  }, []);

  const findAllFournisseurs = async () => {
    try {
      const fournisseurs = await cltFrsService.findAllFournisseurs();
      setListFournisseurs(fournisseurs);
    } catch (error) {
      console.error('Erreur lors du chargement des fournisseurs:', error);
      setErrorMsg(['Erreur lors du chargement des fournisseurs']);
    }
  };

  const findAllArticles = async () => {
    try {
      const articles = await articleService.findAllArticles();
      setListArticle(articles);
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error);
      setErrorMsg(['Erreur lors du chargement des articles']);
    }
  };

  const filtrerArticle = () => {
    if (codeArticle.length === 0) {
      findAllArticles();
    } else {
      const filteredArticles = listArticle.filter(art => 
        art.codeArticle?.includes(codeArticle) || art.designation?.includes(codeArticle)
      );
      setListArticle(filteredArticles);
    }
  };

  const selectArticleClick = (article) => {
    setSearchedArticle(article);
    setCodeArticle(article.codeArticle);
    setArticleNotYetSelected(false);
  };

  const ajouterLigneCommande = () => {
    if (checkLigneCommande()) {
      const newLigne = {
        article: searchedArticle,
        quantite: parseFloat(quantite),
        prixUnitaire: searchedArticle.prixUnitaireTtc
      };
      
      setLignesCommande([...lignesCommande, newLigne]);
      calculerTotalCommande();
      setSearchedArticle({});
      setQuantite('');
      setCodeArticle('');
      setArticleNotYetSelected(false);
      findAllArticles();
    }
  };

  const checkLigneCommande = () => {
    const errors = [];
    
    if (!searchedArticle.id) {
      errors.push('Veuillez sélectionner un article');
      setArticleNotYetSelected(true);
    }
    
    if (!quantite || parseFloat(quantite) <= 0) {
      errors.push('Veuillez entrer une quantité valide');
    }
    
    if (errors.length > 0) {
      setErrorMsg(errors);
      return false;
    }
    
    setErrorMsg([]);
    return true;
  };

  const calculerTotalCommande = () => {
    const total = lignesCommande.reduce((sum, ligne) => 
      sum + (ligne.prixUnitaire * ligne.quantite), 0
    );
    setTotalCommande(total);
  };

  const enregistrerCommande = async () => {
    if (lignesCommande.length === 0) {
      setErrorMsg(['Veuillez ajouter au moins une ligne de commande']);
      return;
    }

    if (!selectedFournisseur.id) {
      setErrorMsg(['Veuillez sélectionner un fournisseur']);
      return;
    }

    setIsLoading(true);
    try {
      const commande = {
        code: codeCommande,
        fournisseur: selectedFournisseur,
        lignesCommande: lignesCommande,
        etatCommande: 'EN_PREPARATION'
      };

      await cmdCltFrsService.saveCommandeFournisseur(commande);
      setSuccessMsg('Commande enregistrée avec succès');
      setTimeout(() => {
        navigate('/dashboard/commandes-fournisseurs');
      }, 2000);
    } catch (error) {
      setErrorMsg(['Erreur lors de l\'enregistrement de la commande']);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="nouveau-cmd-frs">
      <div className="nouveau-cmd-frs__header">
        <h2>Nouvelle commande fournisseur</h2>
      </div>

      {errorMsg.length > 0 && (
        <div className="nouveau-cmd-frs__errors">
          {errorMsg.map((msg, index) => (
            <div key={index} className="nouveau-cmd-frs__error">
              <span>{msg}</span>
            </div>
          ))}
        </div>
      )}

      <div className="nouveau-cmd-frs__form-section">
        <div className="nouveau-cmd-frs__form-left">
          <form>
            <div className="nouveau-cmd-frs__form-group">
              <input 
                type="text" 
                className="nouveau-cmd-frs__input" 
                name="codeCmd" 
                placeholder="Code commande" 
                value={codeCommande}
                onChange={(e) => setCodeCommande(e.target.value)}
              />
            </div>
            <div className="nouveau-cmd-frs__form-group">
              <input 
                type="text" 
                className="nouveau-cmd-frs__input" 
                placeholder="Date commande" 
                value={new Date().toLocaleDateString('fr-FR')}
                readOnly
              />
            </div>
            <div className="nouveau-cmd-frs__form-group">
              <select 
                className="nouveau-cmd-frs__select" 
                name="frs" 
                value={selectedFournisseur.id || ''}
                onChange={(e) => {
                  const fournisseur = listFournisseurs.find(f => f.id === parseInt(e.target.value));
                  setSelectedFournisseur(fournisseur || {});
                }}
              >
                <option value="">Sélectionner un fournisseur</option>
                {listFournisseurs.map((fournisseur) => (
                  <option key={fournisseur.id} value={fournisseur.id}>
                    {fournisseur.nom}&nbsp;{fournisseur.prenom}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </div>

        {selectedFournisseur.nom && (
          <>
            <div className="nouveau-cmd-frs__fournisseur-info">
              <div className="nouveau-cmd-frs__info-item">
                <i className="fas fa-info-circle nouveau-cmd-frs__icon"></i>
                <span>{selectedFournisseur.nom}</span>
              </div>
              <div className="nouveau-cmd-frs__info-item">
                <i className="fas fa-info-circle nouveau-cmd-frs__icon"></i>
                <span>{selectedFournisseur.prenom}</span>
              </div>
              <div className="nouveau-cmd-frs__info-item">
                <i className="fas fa-phone-alt nouveau-cmd-frs__icon"></i>
                <span>{selectedFournisseur.numTel}</span>
              </div>
              <div className="nouveau-cmd-frs__info-item">
                <i className="fas fa-hourglass-half nouveau-cmd-frs__icon"></i>
                <span className="nouveau-cmd-frs__status">EN PREPARATION</span>
              </div>
            </div>
            <div className="nouveau-cmd-frs__fournisseur-photo">
              <img 
                src={selectedFournisseur.photo ? selectedFournisseur.photo : 'assets/product.png'} 
                alt="Photo fournisseur"
                width="150"
                height="150" 
              />
            </div>
          </>
        )}
      </div>

      <div className="nouveau-cmd-frs__article-section">
        <div className="nouveau-cmd-frs__article-form">
          <div className="nouveau-cmd-frs__article-input">
            <input 
              type="text" 
              className="nouveau-cmd-frs__input" 
              placeholder="Code article" 
              value={codeArticle}
              onChange={(e) => setCodeArticle(e.target.value)}
              onInput={filtrerArticle}
            />
            {codeArticle.length > 0 && !articleNotYetSelected && (
              <div className="nouveau-cmd-frs__autocomplete">
                {listArticle.map((article) => (
                  <p 
                    key={article.id} 
                    className="nouveau-cmd-frs__autocomplete-item"
                    onClick={() => selectArticleClick(article)}
                  >
                    {article.codeArticle}&nbsp;{article.designation}
                  </p>
                ))}
              </div>
            )}
          </div>
          <div className="nouveau-cmd-frs__article-input">
            <input 
              type="text" 
              className="nouveau-cmd-frs__input" 
              placeholder="Quantite" 
              value={quantite}
              onChange={(e) => setQuantite(e.target.value)}
            />
          </div>
          <div className="nouveau-cmd-frs__article-input">
            <input 
              type="text" 
              className="nouveau-cmd-frs__input" 
              placeholder="Prix unitaire" 
              value={searchedArticle.prixUnitaireTtc || ''}
              readOnly
            />
          </div>
          <div className="nouveau-cmd-frs__article-input">
            <button 
              type="button" 
              className="nouveau-cmd-frs__btn nouveau-cmd-frs__btn--success"
              onClick={ajouterLigneCommande}
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="nouveau-cmd-frs__lignes-section">
        <div className="nouveau-cmd-frs__lignes-header">
          <h3>Lignes de commande</h3>
        </div>
        <div className="nouveau-cmd-frs__lignes-list">
          {lignesCommande.map((ligne, index) => (
            <div key={index} className="nouveau-cmd-frs__ligne">
              <div className="nouveau-cmd-frs__ligne-item">
                <strong>Article:</strong> {ligne.article?.codeArticle}
              </div>
              <div className="nouveau-cmd-frs__ligne-item">
                <strong>Désignation:</strong> {ligne.article?.designation}
              </div>
              <div className="nouveau-cmd-frs__ligne-item">
                <strong>Quantité:</strong> {ligne.quantite}
              </div>
              <div className="nouveau-cmd-frs__ligne-item">
                <strong>Prix:</strong> {ligne.prixUnitaire}
              </div>
              <div className="nouveau-cmd-frs__ligne-item">
                <strong>Total:</strong> {ligne.prixUnitaire * ligne.quantite}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="nouveau-cmd-frs__total-section">
        <div className="nouveau-cmd-frs__total">
          <strong>Total de la commande: {totalCommande} €</strong>
        </div>
      </div>

      <div className="nouveau-cmd-frs__actions">
        <button 
          type="button" 
          className="nouveau-cmd-frs__btn nouveau-cmd-frs__btn--secondary"
          onClick={() => navigate('/dashboard/commandes-fournisseurs')}
        >
          Annuler
        </button>
        <button 
          type="button" 
          className="nouveau-cmd-frs__btn nouveau-cmd-frs__btn--primary"
          onClick={enregistrerCommande}
          disabled={isLoading}
        >
          {isLoading ? 'Enregistrement...' : 'Enregistrer la commande'}
        </button>
      </div>
    </div>
  );
};

export default NouveauCmdFrs;
