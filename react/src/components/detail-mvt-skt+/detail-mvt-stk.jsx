import React from 'react';
import './detail-mvt-stk.scss';

export default function DetailMvtStk({ mouvement }) { 
  const getTypeIcon = (type) => {
    switch(type) {
      case 'Entrée': return 'fas fa-arrow-up text-success';
      case 'Sortie': return 'fas fa-arrow-down text-danger';
      case 'Correction positive': return 'fas fa-plus-circle text-success';
      case 'Correction négative': return 'fas fa-minus-circle text-danger';
      default: return 'fas fa-exchange-alt text-info';
    }
  };

  const getTypeClass = (type) => {
    switch(type) {
      case 'Entrée': return 'mouvement-entree';
      case 'Sortie': return 'mouvement-sortie';
      case 'Correction positive': return 'mouvement-correction-pos';
      case 'Correction négative': return 'mouvement-correction-neg';
      default: return 'mouvement-default';
    }
  };

  return (
    <div className={`detail-mvt-stk ${getTypeClass(mouvement?.type)}`}>
      {/* Details date */}
      <div className="detail-mvt-stk__date">
        <div className="detail-mvt-stk__date-content">
          <i className="fas fa-calendar-alt"></i>
          <span>{mouvement?.date || 'N/A'}</span>
        </div>
      </div>

      {/* Details quantité */}
      <div className="detail-mvt-stk__quantity">
        <div className="detail-mvt-stk__quantity-content">
          <i className="fas fa-cubes"></i>
          <span>{mouvement?.quantite || 0}</span>
        </div>
      </div>

      {/* Details type */}
      <div className="detail-mvt-stk__type">
        <div className="detail-mvt-stk__type-content">
          <i className={getTypeIcon(mouvement?.type)}></i>
          <span>{mouvement?.type || 'N/A'}</span>
        </div>
      </div>

      {/* Details source */}
      <div className="detail-mvt-stk__source">
        <div className="detail-mvt-stk__source-content">
          <i className="fas fa-tag"></i>
          <span>{mouvement?.source || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
}