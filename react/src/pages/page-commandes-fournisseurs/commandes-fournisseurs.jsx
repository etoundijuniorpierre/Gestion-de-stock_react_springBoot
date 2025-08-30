import React from 'react';
import './commandes-fournisseurs.scss';

const CommandesFournisseurs = () => {
  return (
    <div className="commandes-fournisseurs">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
              toujours pas mes link ne s'ouvre pas toujours dans le main de mon dashboard mais ouvre une nouvelle page                 
              <h4>🚚 Commandes Fournisseurs</h4>
              </div>
              <div className="card-body">
                <div className="alert alert-success">
                  <strong>✅ Route fonctionnelle !</strong> Cette page s'affiche correctement dans la zone principale du dashboard.
                </div>
                <p>Page des commandes fournisseurs en cours de développement...</p>
                <div className="row">
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-body">
                        <h5>Fonctionnalités à venir :</h5>
                        <ul>
                          <li>Liste des commandes fournisseurs</li>
                          <li>Création de commande</li>
                          <li>Suivi des livraisons</li>
                          <li>Gestion des stocks</li>
                        </ul>
                      </div>
                    </div>
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

export default CommandesFournisseurs; 