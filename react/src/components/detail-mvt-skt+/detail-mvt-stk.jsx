import React, { useState } from 'react';
import './detail-mvt-stk.scss';

export default function DetailMvtStk() { 
  return (
    <>
      <div className="row mb-1 mr-0 custom-border detail-mvt-stk">
        {/*  Details article*/}
        <div className="col-md-3 custom-border-right mb-1 mt-1 ">
          <div className="row text-center">
            <div className="col-md-11">12.12.2012</div>
          </div>
        </div>

        {/*  details categorie*/}
        <div className="col-md-3 custom-border-right mb-1 mt-1 ">
          <div className="row">
            <div className="col-md-12 text-center">
              <h5>139</h5>
            </div>
          </div>
        </div>

        <div className="col-md-3 custom-border-right mb-1 mt-1 ">
          <div className="row">
            <div className="col-md-12 text-center">
              <h5>Sortie</h5>
            </div>
          </div>
        </div>

        {/*  boutons action*/}
        <div className="col-md-3 mb-1 mt-1">
          <div className="row text-center">
            <h5>COMMANDE_CLIENT</h5>
          </div>
        </div>
      </div>
    </>
  );
}