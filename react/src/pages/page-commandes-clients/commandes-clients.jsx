import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CmdcltfrsService } from '../../services/cmdcltfrs.service';
import './commandes-clients.scss';

const CommandesClients = () => {
  const [listeCommandes, setListeCommandes] = useState([]);
  const [mapLignesCommande, setMapLignesCommande] = useState(new Map());
  const [mapPrixTotalCommande, setMapPrixTotalCommande] = useState(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();
  const cmdCltFrsService = new CmdcltfrsService();

  useEffect(() => {
    findAllCommandes();
  }, []);

  const findAllCommandes = async () => {
    setIsLoading(true);
    try {
      const cmd = await cmdCltFrsService.findAllCommandesClient();
      setListeCommandes(cmd || []);
      findAllLignesCommande(cmd || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      setErrorMsg('Erreur lors de la récupération des commandes');
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
    navigate('/dashboard/nouvellecommandeclt');
  };

  const findLignesCommande = async (idCommande) => {
    if (!idCommande) return;
    
    try {
      const list = await cmdCltFrsService.findAllLigneCommandesClient(idCommande);
      setMapLignesCommande(prev => new Map(prev).set(idCommande, list || []));
      setMapPrixTotalCommande(prev => new Map(prev).set(idCommande, calculerTotalCmd(list || [])));
    } catch (error) {
      console.error('Erreur lors de la récupération des lignes de commande:', error);
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

  if (isLoading) {
    return <div className="commandes-clients__loading">Chargement...</div>;
  }

  if (errorMsg) {
    return <div className="commandes-clients__error">{errorMsg}</div>;
  }

  return (
    <div className="commandes-clients">
      <div className="commandes-clients__header">
        <h1>Commandes Clients</h1>
        <button className="commandes-clients__btn commandes-clients__btn--primary" onClick={nouvelleCommande}>
          <i className="fas fa-plus"></i> Nouvelle Commande
        </button>
      </div>

      {listeCommandes.length > 0 ? (
        <div className="commandes-clients__content">
          {listeCommandes.map((cmd) => (
            <div key={cmd.id} className="commandes-clients__card">
              <div className="commandes-clients__card-header">
                <h5 className="commandes-clients__card-title">
                  Commande {cmd.code} - {new Date(cmd.dateCommande).toLocaleDateString('fr-FR')}
                </h5>
              </div>
              <div className="commandes-clients__card-body">
                <div className="commandes-clients__card-info">
                  <div className="commandes-clients__info-left">
                    <strong>État:</strong> {cmd.etatCommande}<br />
                    <strong>Total:</strong> {cmd.totalPrix}€
                  </div>
                  <div className="commandes-clients__info-right">
                    <strong>Client:</strong><br />
                    {cmd.client?.nom} {cmd.client?.prenom}
                  </div>
                </div>
                
                {cmd.id && getLignesCommande(cmd.id).length > 0 && (
                  <div className="commandes-clients__lignes">
                    <h6>Lignes de commande ({getLignesCommande(cmd.id).length})</h6>
                    <div className="commandes-clients__table-container">
                      <table className="commandes-clients__table">
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
                    <div className="commandes-clients__total">
                      <strong>Total commande: {calculerTotalCommande(cmd.id)}€</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="commandes-clients__empty">
          <div className="commandes-clients__empty-message">
            Aucune commande client trouvée.
          </div>
        </div>
      )}
    </div>
  );
};

export default CommandesClients; 