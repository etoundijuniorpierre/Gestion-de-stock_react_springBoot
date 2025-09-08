import React, { useState } from 'react';
import ConfirmationPopup from './confirmation-popup';
import './confirmation-popup.css';

const ConfirmationPopupDemo = () => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showActionConfirm, setShowActionConfirm] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const handleDelete = () => {
    console.log('✅ Suppression confirmée !');
    setShowDeleteConfirm(false);
  };

  const handleAction = () => {
    console.log('✅ Action confirmée !');
    setShowActionConfirm(false);
  };

  const handleWarning = () => {
    console.log('⚠️ Action dangereuse confirmée !');
    setShowWarning(false);
  };

  return (
    <div className="container mt-5">
      <h2>Démonstration du Composant ConfirmationPopup</h2>
      <p className="text-muted">
        Ce composant remplace les alertes window.confirm par des popups modernes et personnalisables.
      </p>

      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Suppression d'élément</h5>
              <p className="card-text">
                Popup de confirmation pour la suppression avec bouton rouge.
              </p>
              <button 
                className="btn btn-danger"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <i className="fas fa-trash me-2"></i>
                Supprimer un élément
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Confirmation d'action</h5>
              <p className="card-text">
                Popup de confirmation standard avec bouton bleu.
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => setShowActionConfirm(true)}
              >
                <i className="fas fa-play me-2"></i>
                Effectuer une action
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Avertissement</h5>
              <p className="card-text">
                Popup d'avertissement avec bouton orange.
              </p>
              <button 
                className="btn btn-warning"
                onClick={() => setShowWarning(true)}
              >
                <i className="fas fa-exclamation-triangle me-2"></i>
                Action dangereuse
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Popup de suppression */}
      <ConfirmationPopup
        isOpen={showDeleteConfirm}
        title="Confirmation de suppression"
        message="Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible."
        confirmText="Oui, supprimer"
        cancelText="Non, annuler"
        confirmButtonClass="btn-danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        onClose={() => setShowDeleteConfirm(false)}
      />

      {/* Popup de confirmation d'action */}
      <ConfirmationPopup
        isOpen={showActionConfirm}
        title="Confirmation d'action"
        message="Voulez-vous vraiment effectuer cette action ?"
        confirmText="Confirmer"
        cancelText="Annuler"
        confirmButtonClass="btn-primary"
        onConfirm={handleAction}
        onCancel={() => setShowActionConfirm(false)}
        onClose={() => setShowActionConfirm(false)}
      />

      {/* Popup d'avertissement */}
      <ConfirmationPopup
        isOpen={showWarning}
        title="⚠️ Attention"
        message="Cette action est potentiellement dangereuse et peut avoir des conséquences importantes. Êtes-vous sûr de vouloir continuer ?"
        confirmText="Continuer"
        cancelText="Arrêter"
        confirmButtonClass="btn-warning"
        onConfirm={handleWarning}
        onCancel={() => setShowWarning(false)}
        onClose={() => setShowWarning(false)}
      />

      <div className="mt-5">
        <h3>Fonctionnalités du composant</h3>
        <ul className="list-group">
          <li className="list-group-item">
            <i className="fas fa-check text-success me-2"></i>
            <strong>Design moderne :</strong> Interface claire et professionnelle
          </li>
          <li className="list-group-item">
            <i className="fas fa-check text-success me-2"></i>
            <strong>Responsive :</strong> Adaptation automatique aux écrans mobiles
          </li>
          <li className="list-group-item">
            <i className="fas fa-check text-success me-2"></i>
            <strong>Animations :</strong> Transitions fluides d'entrée et de sortie
          </li>
          <li className="list-group-item">
            <i className="fas fa-check text-success me-2"></i>
            <strong>Personnalisation :</strong> Textes, couleurs et comportements configurables
          </li>
          <li className="list-group-item">
            <i className="fas fa-check text-success me-2"></i>
            <strong>Accessibilité :</strong> Support des lecteurs d'écran et navigation clavier
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ConfirmationPopupDemo;
