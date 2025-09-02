import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CltfrsService } from '../../services/cltfrs/cltfrs.service';
import { CmdcltfrsService } from '../../services/cmdcltfrs.service';
import { ArticleService } from '../../services/article/article.service';
import './nouveau-cmd-clt.scss';

const NouveauCmdClt = () => {
  const [selectedClient, setSelectedClient] = useState({});
  const [listClients, setListClients] = useState([]);
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
    findAllClients();
    findAllArticles();
  }, []);

  const findAllClients = async () => {
    try {
      const clients = await cltFrsService.findAllClients();
      setListClients(clients);
    } catch (error) {
      console.error('Erreur lors du chargement des clients:', error);
      setErrorMsg(['Erreur lors du chargement des clients']);
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
    setCodeArticle(article.codeArticle || '');
    setArticleNotYetSelected(false);
  };

  const ajouterLigneCommande = () => {
    checkLigneCommande();
    if (errorMsg.length === 0) {
      const newLigne = {
        article: searchedArticle,
        quantite: parseFloat(quantite),
        prixUnitaire: searchedArticle.prixUnitaireTtc || 0
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
    setErrorMsg([]);
    
    if (!searchedArticle.id) {
      setErrorMsg(['Veuillez sélectionner un article']);
      return;
    }
    
    if (!quantite || parseFloat(quantite) <= 0) {
      setErrorMsg(['Veuillez entrer une quantité valide']);
      return;
    }
    
    if (lignesCommande.some(ligne => ligne.article?.id === searchedArticle.id)) {
      setErrorMsg(['Cet article est déjà dans la commande']);
      return;
    }
  };

  const calculerTotalCommande = () => {
    const total = lignesCommande.reduce((sum, ligne) => {
      return sum + ((ligne.prixUnitaire || 0) * (ligne.quantite || 0));
    }, 0);
    setTotalCommande(total);
  };

  const enregistrerCommande = async () => {
    if (!selectedClient.id) {
      setErrorMsg(['Veuillez sélectionner un client']);
      return;
    }
    
    if (lignesCommande.length === 0) {
      setErrorMsg(['Veuillez ajouter au moins une ligne de commande']);
      return;
    }

    setIsLoading(true);
    
    try {
      const commandeData = {
        code: codeCommande,
        client: selectedClient,
        lignesCommande: lignesCommande,
        totalCommande: totalCommande,
        etatCommande: 'EN_PREPARATION'
      };

      await cmdCltFrsService.saveCommandeClient(commandeData);
      setSuccessMsg('Commande enregistrée avec succès');
      
      // Redirection après un délai
      setTimeout(() => {
        navigate('/dashboard/commandes-clients');
      }, 2000);
      
    } catch (error) {
      setErrorMsg(['Erreur lors de l\'enregistrement de la commande']);
    } finally {
      setIsLoading(false);
    }
  };

  const annulerCommande = () => {
    navigate('/dashboard/commandes-clients');
  };

  return (
    <div className="nouveau-cmd-clt">
      <div className="nouveau-cmd-clt__header">
        <h2>Nouvelle commande client</h2>
      </div>

      {errorMsg.length > 0 && (
        <div className="nouveau-cmd-clt__errors">
          {errorMsg.map((msg, index) => (
            <div key={index} className="nouveau-cmd-clt__error">
              <span>{msg}</span>
            </div>
          ))}
        </div>
      )}

      {successMsg && (
        <div className="nouveau-cmd-clt__success">
          <span>{successMsg}</span>
        </div>
      )}

      <div className="nouveau-cmd-clt__client-section">
        <div className="nouveau-cmd-clt__form-section">
          <form>
            <div className="nouveau-cmd-clt__form-group">
              <input 
                type="text" 
                className="nouveau-cmd-clt__input" 
                name="codeCmd" 
                placeholder="Code commande" 
                value={codeCommande}
                onChange={(e) => setCodeCommande(e.target.value)}
              />
            </div>
            <div className="nouveau-cmd-clt__form-group">
              <input 
                type="text" 
                className="nouveau-cmd-clt__input" 
                placeholder="Date commande" 
                value={new Date().toLocaleDateString('fr-FR')}
                readOnly
              />
            </div>
            <div className="nouveau-cmd-clt__form-group">
              <select 
                className="nouveau-cmd-clt__select" 
                name="clt" 
                value={selectedClient.id || ''}
                onChange={(e) => {
                  const client = listClients.find(c => c.id === parseInt(e.target.value));
                  setSelectedClient(client || {});
                }}
              >
                <option value="">Sélectionner un client</option>
                {listClients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.nom}&nbsp;{client.prenom}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </div>

        {selectedClient.nom && (
          <>
            <div className="nouveau-cmd-clt__client-info">
              <div className="nouveau-cmd-clt__client-detail">
                <i className="fas fa-info-circle nouveau-cmd-clt__icon"></i>
                <span>{selectedClient.nom}</span>
              </div>
              <div className="nouveau-cmd-clt__client-detail">
                <i className="fas fa-info-circle nouveau-cmd-clt__icon"></i>
                <span>{selectedClient.prenom}</span>
              </div>
              <div className="nouveau-cmd-clt__client-detail">
                <i className="fas fa-phone-alt nouveau-cmd-clt__icon"></i>
                <span>{selectedClient.numTel}</span>
              </div>
              <div className="nouveau-cmd-clt__client-detail">
                <i className="fas fa-hourglass-half nouveau-cmd-clt__icon"></i>
                <span className="nouveau-cmd-clt__status">EN PREPARATION</span>
              </div>
            </div>
            <div className="nouveau-cmd-clt__client-photo">
              <img 
                src={selectedClient.photo ? selectedClient.photo : 'assets/product.png'} 
                className="nouveau-cmd-clt__photo" 
                alt="Photo client"
              />
            </div>
          </>
        )}
      </div>

      <div className="nouveau-cmd-clt__article-section">
        <div className="nouveau-cmd-clt__article-form">
          <div className="nouveau-cmd-clt__article-input">
            <input 
              type="text" 
              className="nouveau-cmd-clt__input" 
              placeholder="Code article" 
              value={codeArticle}
              onChange={(e) => {
                setCodeArticle(e.target.value);
                filtrerArticle();
              }}
            />
            {codeArticle.length > 0 && !articleNotYetSelected && (
              <div className="nouveau-cmd-clt__autocomplete">
                {listArticle.map((article) => (
                  <p 
                    key={article.id} 
                    className="nouveau-cmd-clt__autocomplete-item"
                    onClick={() => selectArticleClick(article)}
                  >
                    {article.codeArticle}&nbsp;{article.designation}
                  </p>
                ))}
              </div>
            )}
          </div>
          <div className="nouveau-cmd-clt__article-input">
            <input 
              type="text" 
              className="nouveau-cmd-clt__input" 
              placeholder="Quantite" 
              value={quantite}
              onChange={(e) => setQuantite(e.target.value)}
            />
          </div>
          <div className="nouveau-cmd-clt__article-input">
            <input 
              type="text" 
              className="nouveau-cmd-clt__input" 
              placeholder="Prix unitaire" 
              value={searchedArticle.prixUnitaireTtc || ''}
              readOnly
            />
          </div>
          <div className="nouveau-cmd-clt__article-input">
            <button 
              type="button" 
              className="nouveau-cmd-clt__btn nouveau-cmd-clt__btn--add"
              onClick={ajouterLigneCommande}
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="nouveau-cmd-clt__lignes-section">
        <div className="nouveau-cmd-clt__lignes-header">
          <h3>Lignes de commande</h3>
        </div>
        <div className="nouveau-cmd-clt__lignes-list">
          {lignesCommande.map((ligne, index) => (
            <div key={index} className="nouveau-cmd-clt__ligne">
              <div className="nouveau-cmd-clt__ligne-item">
                <strong>Article:</strong> {ligne.article?.codeArticle}
              </div>
              <div className="nouveau-cmd-clt__ligne-item">
                <strong>Désignation:</strong> {ligne.article?.designation}
              </div>
              <div className="nouveau-cmd-clt__ligne-item">
                <strong>Quantité:</strong> {ligne.quantite}
              </div>
              <div className="nouveau-cmd-clt__ligne-item">
                <strong>Prix:</strong> {ligne.prixUnitaire}
              </div>
              <div className="nouveau-cmd-clt__ligne-item">
                <strong>Total:</strong> {(ligne.prixUnitaire || 0) * (ligne.quantite || 0)}
              </div>
            </div>
          ))}
        </div>
        <div className="nouveau-cmd-clt__total">
          <strong>Total de la commande: {totalCommande} €</strong>
        </div>
      </div>

      <div className="nouveau-cmd-clt__actions">
        <button 
          className="nouveau-cmd-clt__btn nouveau-cmd-clt__btn--secondary"
          onClick={annulerCommande}
        >
          <i className="fas fa-ban"></i>&nbsp;Annuler
        </button>
        <button 
          className="nouveau-cmd-clt__btn nouveau-cmd-clt__btn--primary"
          onClick={enregistrerCommande}
          disabled={isLoading}
        >
          <i className="fas fa-save"></i>&nbsp;
          {isLoading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
};

export default NouveauCmdClt;
