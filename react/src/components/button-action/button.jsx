import React from 'react';
import './button.scss';

export default function ButtonAction({ 
  isNouveauVisible = true, 
  isExporterVisible = true, 
  isImporterVisible = true,
  onNouveauClick 
}) {
  
  const handleNouveauClick = () => {
    if (onNouveauClick) {
      onNouveauClick('Nouveau');
    }
  };

  return (
    <div className="d-flex">
      {isImporterVisible && (
        <div className="p-2 flex-fill">
          <button type="button" className="btn btn-warning">
            <i className="fas fa-cloud-upload-alt"></i>&nbsp;
            Importer
          </button>
        </div>
      )}
      {isExporterVisible && (
        <div className="p-2 flex-fill">
          <button type="button" className="btn btn-success">
            <i className="fas fa-cloud-download-alt"></i>&nbsp;
            Exporter
          </button>
        </div>
      )}
      {isNouveauVisible && (
        <div className="p-2 flex-fill">
          <button type="button" className="btn btn-primary" onClick={handleNouveauClick}>
            <i className="fas fa-plus"></i>&nbsp;
            Nouveau
          </button>
        </div>
      )}
    </div>
  );
}