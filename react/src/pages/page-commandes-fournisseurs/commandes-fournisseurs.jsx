import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CmdcltfrsService } from '../../services/cmdcltfrs.service';
import ButtonAction from '../../components/button-action/button';
import DetailCmdFrs from '../../components/detail-cmd-frs/detail-cmd-frs';
import DetailCmd from '../../components/detail-cmd/detail-cmd';
import Pagination from '../../components/pagination/pagination';
import './commandes-fournisseurs.scss';

const CommandesFournisseurs = () => {
  const [listeCommandes, setListeCommandes] = useState([]);
  const [mapLignesCommande, setMapLignesCommande] = useState(new Map());
  const [mapPrixTotalCommande, setMapPrixTotalCommande] = useState(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [expandedCommands, setExpandedCommands] = useState(new Set());

  const navigate = useNavigate();
  const cmdCltFrsService = new CmdcltfrsService();

  useEffect(() => {
    findAllCommandes();
  }, []);

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

  const toggleCommand = (commandId) => {
    setExpandedCommands(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commandId)) {
        newSet.delete(commandId);
      } else {
        newSet.add(commandId);
      }
      return newSet;
    });
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
        <div className="commandes-fournisseurs__title">
          <h1>Commandes Fournisseurs</h1>
        </div>
        <div className="commandes-fournisseurs__actions">
          <ButtonAction
            isImporterVisible={false}
            onNouveauClick={nouvelleCommande}
          />
        </div>
      </div>

      <div className="commandes-fournisseurs__content">
        {listeCommandes.map((cmd) => (
          <div key={cmd.id} className="commandes-fournisseurs__card">
            <div className="commandes-fournisseurs__card-header">
              <button
                className="commandes-fournisseurs__toggle-btn"
                type="button"
                onClick={() => toggleCommand(cmd.id)}
                aria-expanded={expandedCommands.has(cmd.id)}
              >
                <DetailCmdFrs commande={cmd} />
              </button>
            </div>

            {expandedCommands.has(cmd.id) && (
              <div className="commandes-fournisseurs__card-body">
                <div className="commandes-fournisseurs__lignes">
                  {getLignesCommande(cmd.id).map((ligne, index) => (
                    <DetailCmd key={index} ligneCommande={ligne} />
                  ))}
                </div>
              </div>
            )}

            <div className="commandes-fournisseurs__card-footer">
              <div className="commandes-fournisseurs__footer-content">
                <div className="commandes-fournisseurs__lignes-count">
                  <h5>{getLignesCommande(cmd.id).length} lignes de commande</h5>
                </div>
                <div className="commandes-fournisseurs__total">
                  <h5>Total commande: {calculerTotalCommande(cmd.id)}€</h5>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {listeCommandes.length > 0 && (
        <div className="commandes-fournisseurs__pagination">
          <Pagination />
        </div>
      )}
    </div>
  );
};

export default CommandesFournisseurs; 