import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CltfrsService } from '../../services/cltfrs/cltfrs.service';
import { CmdcltfrsService } from '../../services/cmdcltfrs.service';
import { ArticleService } from '../../services/article/article.service';
import DetailCmd from '../detail-cmd/detail-cmd';
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

  const navigate = useNavigate();
  const cltFrsService = new CltfrsService();
  const cmdCltFrsService = new CmdcltfrsService();
  const articleService = new ArticleService();

  const origin = 'fournisseur';

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
        art.codeArticle?.toLowerCase().includes(codeArticle.toLowerCase()) || 
        art.designation?.toLowerCase().includes(codeArticle.toLowerCase())
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
        id: Date.now(), // ID temporaire
        article: searchedArticle,
        quantite: parseFloat(quantite),
        prixUnitaire: searchedArticle.prixUnitaireTtc,
        prixTotal: parseFloat(quantite) * searchedArticle.prixUnitaireTtc
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
    const total = lignesCommande.reduce((sum, ligne) => sum + ligne.prixTotal, 0);
    setTotalCommande(total);
  };

  const enregistrerCommande = async () => {
    if (!selectedFournisseur.id) {
      setErrorMsg(['Veuillez sélectionner un fournisseur']);
      return;
    }

    if (lignesCommande.length === 0) {
      setErrorMsg(['Veuillez ajouter au moins une ligne de commande']);
      return;
    }

    try {
      setIsLoading(true);
      const commande = {
        codeCommande: codeCommande,
        client: null,
        fournisseur: selectedFournisseur,
        lignesCommande: lignesCommande,
        totalCommande: totalCommande,
        dateCommande: new Date().toISOString()
      };

      await cmdCltFrsService.saveCommandeFournisseur(commande);
      navigate('/dashboard/commandes-fournisseurs');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la commande:', error);
      setErrorMsg(['Erreur lors de la sauvegarde de la commande']);
    } finally {
      setIsLoading(false);
    }
  };

  const annuler = () => {
    navigate('/dashboard/commandes-fournisseurs');
  };

  return (
    <div className="col mb-3">
      <div className="col-md-12">
        <div className="col-md-12 mb-3 mt-3">
          <h2>Nouvelle commande {origin}</h2>
        </div>
        
        {errorMsg.length > 0 && (
          <div className="alert alert-danger">
            {errorMsg.map((msg, index) => (
              <div key={index}>
                <span>{msg}</span>
              </div>
            ))}
          </div>
        )}

        <div className="row p-3 custom-border">
          <div className="col-md-5 custom-border-right">
            <form>
              <div className="form-group">
                <input 
                  type="text" 
                  className="form-control" 
                  name="codeCmd" 
                  placeholder="Code commande" 
                  value={codeCommande}
                  onChange={(e) => setCodeCommande(e.target.value)}
                />
              </div>
              <div className="form-group">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Date commande"
                  value={new Date().toLocaleDateString()}
                  readOnly
                />
              </div>
              <div className="form-group">
                <select 
                  className="form-control" 
                  name="cltFrs" 
                  value={selectedFournisseur.id || ''}
                  onChange={(e) => {
                    const selected = listFournisseurs.find(f => f.id === parseInt(e.target.value));
                    setSelectedFournisseur(selected || {});
                  }}
                >
                  <option value="">Sélectionner un {origin}</option>
                  {listClientsFournisseurs.map((obj) => (
                    <option key={obj.id} value={obj.id}>
                      {obj.nom}&nbsp;{obj.prenom}
                    </option>
                  ))}
                </select>
              </div>
            </form>
          </div>
          
          {selectedFournisseur.nom && (
            <>
              <div className="col-md-5 custom-border-right">
                <div className="col">
                  <div className="row">
                    <div className="col-md-1"><i className="fas fa-info-circle blue-color"></i></div>
                    <div className="col-md-10">{selectedFournisseur.nom}</div>
                  </div>
                  <div className="row">
                    <div className="col-md-1"><i className="fas fa-info-circle blue-color"></i></div>
                    <div className="col-md-10">{selectedFournisseur.prenom}</div>
                  </div>
                  <div className="row">
                    <div className="col-md-1"><i className="fas fa-phone-alt blue-color"></i></div>
                    <div className="col-md-10">{selectedFournisseur.numTel}</div>
                  </div>
                  <div className="row">
                    <div className="col-md-1"><i className="fas fa-hourglass-half blue-color"></i></div>
                    <div className="col-md-10 text-primary">EN PREPARATION</div>
                  </div>
                </div>
              </div>
              <div className="col-md-2 text-center">
                <img 
                  src={selectedFournisseur.photo ? selectedFournisseur.photo : '/src/assets/product.png'} 
                  className="rounded-circle" 
                  width="150px"
                  height="150px" 
                  alt="Photo fournisseur"
                />
              </div>
            </>
          )}
        </div>

        <div className="row mt-2 p-3 custom-border">
          <div className="form-row col-md-12">
            <div className="col-md-4">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Code article" 
                value={codeArticle}
                onChange={(e) => setCodeArticle(e.target.value)}
                onInput={filtrerArticle}
              />
              {codeArticle.length > 0 && !articleNotYetSelected && (
                <div className="autocomplete shadow p-3 mb-5 bg-white rounded">
                  {listArticle.map((article) => (
                    <p 
                      key={article.id} 
                      className="p-1"
                      onClick={() => selectArticleClick(article)}
                      style={{ cursor: 'pointer' }}
                    >
                      {article.codeArticle}&nbsp;{article.designation}
                    </p>
                  ))}
                </div>
              )}
            </div>
            <div className="col-md-4">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Quantite" 
                value={quantite}
                onChange={(e) => setQuantite(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Prix unitaire" 
                value={searchedArticle.prixUnitaireTtc || ''}
                readOnly
              />
            </div>
            <div className="col-md-1">
              <button 
                type="button" 
                className="btn btn-success" 
                onClick={ajouterLigneCommande}
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="row mt-2 p-3 custom-border" style={{ maxHeight: '300px', overflowY: 'scroll' }}>
          <div className="col-md-12">
            {lignesCommande.map((ligne) => (
              <DetailCmd key={ligne.id} ligneCommande={ligne} />
            ))}
          </div>
        </div>

        <div className="row mt-2 p-3 custom-border">
          <div className="col-md-12 text-right">
            <h3>Total de la commande: {totalCommande.toFixed(2)}€</h3>
          </div>
        </div>
      </div>

      <div className="col-md-12 text-right mt-2">
        <button className="btn btn-danger mr-3" onClick={annuler}>
          <i className="fas fa-ban"></i>&nbsp;
          Annuler
        </button>
        <button 
          className="btn btn-primary" 
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

export default NouveauCmdFrs;
