import React from 'react';
import { useLocation } from 'react-router-dom';
import './commandes-clients.scss';

const CommandesClients = () => {
  const location = useLocation();

  return (
    <div className="commandes-clients">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header bg-success text-white">
                <h4>🎉 SUCCÈS - Commandes Clients</h4>
              </div>
              <div className="card-body">
                <div className="alert alert-success">
                  <strong>✅ NAVIGATION RÉUSSIE !</strong> Cette page s'affiche correctement dans la zone principale du dashboard.
                </div>
                <div className="alert alert-info">
                  <strong>📍 URL actuelle :</strong> {location.pathname}
                </div>
                <div className="alert alert-warning">
                  <strong>🔧 Test de routage :</strong> Si vous voyez ce message, la navigation fonctionne parfaitement !
                </div>
                <div className="alert alert-primary">
                  <strong>📊 Méthode utilisée :</strong> Navigation via useNavigate() + affichage conditionnel basé sur useLocation()
                </div>
                <p>Page des commandes clients en cours de développement...</p>
                <div className="row">
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-body">
                        <h5>Fonctionnalités à venir :</h5>
                        <ul>
                          <li>Liste des commandes</li>
                          <li>Création de commande</li>
                          <li>Suivi des commandes</li>
                          <li>Historique des commandes</li>
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

export default CommandesClients; 