import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CmdcltfrsService } from '../../services/cmdcltfrs.service';
import './commandes-fournisseurs.scss';

const CommandesFournisseurs = () => {
  const [listeCommandes, setListeCommandes] = useState([]);
  const [mapLignesCommande, setMapLignesCommande] = useState(new Map());
  const [mapPrixTotalCommande, setMapPrixTotalCommande] = useState(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 15;

  const navigate = useNavigate();
  const cmdCltFrsService = new CmdcltfrsService();

  useEffect(() => {
    findAllCommandes();
  }, []);

  // Calculer le nombre total de pages
  useEffect(() => {
    const total = Math.ceil(listeCommandes.length / itemsPerPage);
    setTotalPages(total);
  }, [listeCommandes.length]);

  // Obtenir les commandes pour la page courante
  const getCurrentPageCommandes = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return listeCommandes.slice(startIndex, endIndex);
  };

  // Fonction pour changer de page et remonter en haut
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Remonter en haut de la page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const findAllCommandes = async () => {
    setIsLoading(true);
    try {
      const cmd = await cmdCltFrsService.findAllCommandesFournisseur();
      setListeCommandes(cmd || []);
      findAllLignesCommande(cmd || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes fournisseurs:', error);
      setErrorMsg('Erreur lors de la récupération des commandes fournisseurs');
    } finally {
      setIsLoading(false);
    }
  };

  const findAllLignesCommande = (commandes) => {
    commandes.forEach((cmd) => {
      if (cmd.id) {
        findLignesCommande(cmd.id);
      }
    });
  };

  const nouvelleCommande = () => {
    navigate('/dashboard/nouvellecommandefrs');
  };

  const modifierCommande = (id) => {
    navigate(`/dashboard/nouvellecommandefrs/${id}`);
  };

  const findLignesCommande = async (idCommande) => {
    if (!idCommande) return;
    
    try {
      const list = await cmdCltFrsService.findAllLigneCommandesFournisseur(idCommande);
      setMapLignesCommande(prev => new Map(prev).set(idCommande, list || []));
      setMapPrixTotalCommande(prev => new Map(prev).set(idCommande, calculerTotalCmd(list || [])));
    } catch (error) {
      console.error('Erreur lors de la récupération des lignes de commande fournisseur:', error);
      setMapLignesCommande(prev => new Map(prev).set(idCommande, []));
      setMapPrixTotalCommande(prev => new Map(prev).set(idCommande, 0));
    }
  };

  const calculerTotalCmd = (list) => {
    let total = 0;
    list.forEach((ligne) => {
      if (ligne.prixUnitaire && ligne.quantite) {
        total += +ligne.quantite * +ligne.prixUnitaire;
      }
    });
    return Math.floor(total);
  };

  const calculerTotalCommande = (id) => {
    return mapPrixTotalCommande.get(id) || 0;
  };

  const getLignesCommande = (id) => {
    return mapLignesCommande.get(id) || [];
  };

  const validerCommande = async (id) => {
    try {
      await cmdCltFrsService.updateEtatCommandeFournisseur(id, 'VALIDEE');
      // Refresh the command list
      findAllCommandes();
    } catch (error) {
      console.error('Erreur lors de la validation de la commande:', error);
      setErrorMsg('Erreur lors de la validation de la commande');
    }
  };

  const isCommandeModifiable = (etatCommande) => {
    // La commande peut être modifiée si elle n'est pas encore validée ou livrée
    return etatCommande === 'EN_PREPARATION';
  };

  const isCommandeValidable = (etatCommande) => {
    // La commande peut être validée si elle est en préparation
    return etatCommande === 'EN_PREPARATION';
  };

  if (isLoading) {
    return <div className="commandes-fournisseurs__loading">Chargement...</div>;
  }

  if (errorMsg) {
    return <div className="commandes-fournisseurs__error">{errorMsg}</div>;
  }

  return (
    <div className="commandes-fournisseurs">
      <div className="commandes-fournisseurs__header">
        <h1>Commandes Fournisseurs</h1>
        <button className="commandes-fournisseurs__btn commandes-fournisseurs__btn--primary" onClick={nouvelleCommande}>
          <i className="fas fa-plus"></i> Nouvelle Commande
        </button>
      </div>

      {listeCommandes.length > 0 ? (
        <div className="commandes-fournisseurs__content">
          {getCurrentPageCommandes().map((cmd) => (
            <div key={cmd.id} className="commandes-fournisseurs__card">
              <div className="commandes-fournisseurs__card-header">
                <h5 className="commandes-fournisseurs__card-title">
                  Commande {cmd.code} - {new Date(cmd.dateCommande).toLocaleDateString('fr-FR')}
                </h5>
              </div>
              <div className="commandes-fournisseurs__card-body">
                <div className="commandes-fournisseurs__card-info">
                  <div className="commandes-fournisseurs__info-left">
                    <strong>État:</strong> {cmd.etatCommande}<br />
                    <strong>Total:</strong> {calculerTotalCommande(cmd.id)}€
                  </div>
                  <div className="commandes-fournisseurs__info-right">
                    <strong>Fournisseur:</strong><br />
                    {cmd.fournisseur?.nom} {cmd.fournisseur?.prenom}
                  </div>
                </div>
                
                {cmd.id && getLignesCommande(cmd.id).length > 0 && (
                  <div className="commandes-fournisseurs__lignes">
                    <h6>Lignes de commande ({getLignesCommande(cmd.id).length})</h6>
                    <div className="commandes-fournisseurs__table-container">
                      <table className="commandes-fournisseurs__table">
                        <thead>
                          <tr>
                            <th>Article</th>
                            <th>Quantité</th>
                            <th>Prix unitaire</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getLignesCommande(cmd.id).map((ligne, index) => (
                            <tr key={index}>
                              <td>{ligne.article?.designation}</td>
                              <td>{ligne.quantite}</td>
                              <td>{ligne.prixUnitaire}€</td>
                              <td>
                                {(ligne.quantite && ligne.prixUnitaire ? ligne.quantite * ligne.prixUnitaire : 0).toFixed(2)}€
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="commandes-fournisseurs__total">
                      <strong>Total commande: {calculerTotalCommande(cmd.id)}€</strong>
                    </div>
                  </div>
                )}
                
                {/* Boutons d'action */}
                <div className="commandes-fournisseurs__actions">
                  {isCommandeModifiable(cmd.etatCommande) && (
                    <button 
                      className="commandes-fournisseurs__btn commandes-fournisseurs__btn--secondary"
                      onClick={() => modifierCommande(cmd.id)}
                    >
                      <i className="fas fa-edit"></i> Modifier
                    </button>
                  )}
                  {isCommandeValidable(cmd.etatCommande) && (
                    <button 
                      className="commandes-fournisseurs__btn commandes-fournisseurs__btn--success"
                      onClick={() => validerCommande(cmd.id)}
                    >
                      <i className="fas fa-check"></i> Valider
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="commandes-fournisseurs__empty">
          <div className="commandes-fournisseurs__empty-message">
            Aucune commande fournisseur trouvée.
          </div>
        </div>
      )}

      {listeCommandes.length > 0 && totalPages > 1 && (
        <div className="commandes-fournisseurs__pagination">
          <div className="commandes-fournisseurs__pagination-info">
            Page {currentPage} sur {totalPages}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommandesFournisseurs;