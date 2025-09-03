import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './route-debug.scss';

const RouteDebug = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const testRoutes = [
    { path: '/dashboard/nouvellecommandectl', label: 'Nouvelle Commande Client' },
    { path: '/dashboard/nouvellecommandefrs', label: 'Nouvelle Commande Fournisseur' },
    { path: '/dashboard/commandes-clients', label: 'Commandes Clients' },
    { path: '/dashboard/commandes-fournisseurs', label: 'Commandes Fournisseurs' },
    { path: '/dashboard/vue-ensemble', label: 'Vue Ensemble' }
  ];

  return (
    <div className="route-debug">
      <div className="route-debug__header">
        <h1>🔍 Debug des Routes</h1>
        <p>Page de débogage pour tester le routage</p>
      </div>
      
      <div className="route-debug__content">
        <div className="route-debug__current">
          <h2>📍 Route Actuelle</h2>
          <div className="route-debug__details">
            <p><strong>Pathname :</strong> <code>{location.pathname}</code></p>
            <p><strong>Search :</strong> <code>{location.search}</code></p>
            <p><strong>Hash :</strong> <code>{location.hash}</code></p>
            <p><strong>State :</strong> <code>{JSON.stringify(location.state)}</code></p>
          </div>
        </div>
        
        <div className="route-debug__tests">
          <h2>🧪 Tests de Navigation</h2>
          <div className="route-debug__buttons">
            {testRoutes.map((route, index) => (
              <button
                key={index}
                className="btn btn-primary"
                onClick={() => navigate(route.path)}
              >
                {route.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="route-debug__info">
          <h2>ℹ️ Informations</h2>
          <p>Si la route <code>/dashboard/nouvellecommandectl</code> ne fonctionne pas :</p>
          <ul>
            <li>Vérifiez que le composant <code>NouvelleCommandeClt</code> est bien importé</li>
            <li>Vérifiez qu'il n'y a pas d'erreurs dans la console</li>
            <li>Vérifiez que l'application a été rechargée après les modifications</li>
            <li>Testez avec le bouton ci-dessus</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RouteDebug;
