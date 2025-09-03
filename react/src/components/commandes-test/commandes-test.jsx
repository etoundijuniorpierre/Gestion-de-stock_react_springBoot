import React, { useState } from 'react';
import NouveauCmdFrs from '../nouveau-cmd-frs';
import NouveauCmdClt from '../nouveau-cmd-clt';
import './commandes-test.scss';

const CommandesTest = () => {
  const [activeComponent, setActiveComponent] = useState('menu');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'nouveau-cmd-frs':
        return <NouveauCmdFrs />;
      case 'nouveau-cmd-clt':
        return <NouveauCmdClt />;
      default:
        return (
          <div className="commandes-test__menu">
            <h2>Test des Composants de Commandes</h2>
            <p>Sélectionnez un composant à tester :</p>
            
            <div className="commandes-test__buttons">
              <button 
                className="btn btn-primary" 
                onClick={() => setActiveComponent('nouveau-cmd-frs')}
              >
                <i className="fas fa-truck"></i>
                Nouvelle Commande Fournisseur
              </button>
              
              <button 
                className="btn btn-success" 
                onClick={() => setActiveComponent('nouveau-cmd-clt')}
              >
                <i className="fas fa-shopping-cart"></i>
                Nouvelle Commande Client
              </button>
            </div>
            
            <div className="commandes-test__info">
              <h4>Instructions :</h4>
              <ul>
                <li><strong>Nouvelle Commande Fournisseur :</strong> Teste le composant de création de commandes fournisseurs</li>
                <li><strong>Nouvelle Commande Client :</strong> Teste le composant de création de commandes clients</li>
              </ul>
              
              <div className="commandes-test__back">
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setActiveComponent('menu')}
                >
                  <i className="fas fa-arrow-left"></i>
                  Retour au menu
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="commandes-test">
      {renderComponent()}
    </div>
  );
};

export default CommandesTest;
