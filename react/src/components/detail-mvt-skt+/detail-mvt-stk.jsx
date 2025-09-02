import React from 'react';
import './detail-mvt-stk.scss';

export default function DetailMvtStk() { 
  return (
    <div className="detail-mvt-stk">
      {/* Details date */}
      <div className="detail-mvt-stk__date">
        <div className="detail-mvt-stk__date-content">
          12.12.2012
        </div>
      </div>

      {/* Details quantité */}
      <div className="detail-mvt-stk__quantity">
        <div className="detail-mvt-stk__quantity-content">
          <h5>139</h5>
        </div>
      </div>

      {/* Details type */}
      <div className="detail-mvt-stk__type">
        <div className="detail-mvt-stk__type-content">
          <h5>Sortie</h5>
        </div>
      </div>

      {/* Details source */}
      <div className="detail-mvt-stk__source">
        <div className="detail-mvt-stk__source-content">
          <h5>COMMANDE_CLIENT</h5>
        </div>
      </div>
    </div>
  );
}