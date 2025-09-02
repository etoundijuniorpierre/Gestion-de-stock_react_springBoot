import React, { useState, useEffect } from 'react';

const Loader = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Simulation du service loader pour le développement
    // Dans une vraie application, vous utiliseriez un contexte ou un service
    const handleShowLoader = (event) => {
      if (event.detail && event.detail.show !== undefined) {
        setShow(event.detail.show);
      }
    };

    window.addEventListener('showLoader', handleShowLoader);
    
    return () => {
      window.removeEventListener('showLoader', handleShowLoader);
    };
  }, []);

  if (!show) return null;

  return (
    <div>
      <div className="loader-overlay">
        <div className="loader"></div>
      </div>
    </div>
  );
};

export default Loader;
