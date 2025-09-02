import React from 'react';
import './button.scss';

export default function ButtonAction({ 
  isNouveauVisible = true, 
  isExporterVisible = true, 
  isImporterVisible = true,
  onNouveauClick,
  onClick,
  text = "Nouveau"
}) {
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (onNouveauClick) {
      onNouveauClick('Nouveau');
    }
  };

  return (
    <div className="button-action">
      {isImporterVisible && (
        <div className="button-action__item">
          <button type="button" className="button-action__btn button-action__btn--warning">
            <i className="fas fa-cloud-upload-alt"></i>&nbsp;
            Importer
          </button>
        </div>
      )}
      {isExporterVisible && (
        <div className="button-action__item">
          <button type="button" className="button-action__btn button-action__btn--success">
            <i className="fas fa-cloud-download-alt"></i>&nbsp;
            Exporter
          </button>
        </div>
      )}
      {isNouveauVisible && (
        <div className="button-action__item">
          <button type="button" className="button-action__btn button-action__btn--primary" onClick={handleClick}>
            <i className="fas fa-plus"></i>&nbsp;
            {text}
          </button>
        </div>
      )}
    </div>
  );
}