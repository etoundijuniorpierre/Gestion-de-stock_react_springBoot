import React from 'react';
import { useLocation } from 'react-router-dom';
import './vue-ensemble.scss';

const VueEnsemble = () => {
  const location = useLocation();

  return (
    <div className="vue-ensemble">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h4>📊 Vue d'ensemble</h4>
              </div>
              <div className="card-body">
                <div className="alert alert-info">
                  <strong>📍 Page Vue d'ensemble</strong> - URL: {location.pathname}
                </div>
                <p>Cette page s'affiche dans la zone principale du dashboard.</p>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-body">
                        <h5>Test de navigation</h5>
                        <p>Cliquez sur les liens du menu pour tester la navigation.</p>
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

export default VueEnsemble; 