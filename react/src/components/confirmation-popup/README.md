# Composant ConfirmationPopup

## Description

Le composant `ConfirmationPopup` remplace les alertes `window.confirm()` par un popup moderne et personnalisable. Il offre une meilleure expérience utilisateur avec des animations, un design responsive et une personnalisation complète.

## Utilisation

### Import

```jsx
import ConfirmationPopup from '../../../components/confirmation-popup';
```

### Props

| Prop | Type | Défaut | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | `false` | Contrôle l'affichage du popup |
| `title` | `string` | - | Titre du popup (optionnel) |
| `message` | `string` | - | Message de confirmation |
| `confirmText` | `string` | `'Confirmer'` | Texte du bouton de confirmation |
| `cancelText` | `string` | `'Annuler'` | Texte du bouton d'annulation |
| `confirmButtonClass` | `string` | `'btn-danger'` | Classe CSS du bouton de confirmation |
| `onConfirm` | `function` | - | Fonction appelée lors de la confirmation |
| `onCancel` | `function` | - | Fonction appelée lors de l'annulation (optionnel) |
| `onClose` | `function` | - | Fonction appelée pour fermer le popup |

### Exemple d'utilisation

```jsx
const [showConfirm, setShowConfirm] = useState(false);

const handleDelete = (articleId) => {
  setArticleToDelete(articleId);
  setShowConfirm(true);
};

const handleConfirmDelete = () => {
  // Logique de suppression
  console.log('Suppression confirmée');
  setShowConfirm(false);
};

const handleCancelDelete = () => {
  setShowConfirm(false);
};

return (
  <div>
    <button onClick={() => handleDelete(123)}>
      Supprimer
    </button>
    
    <ConfirmationPopup
      isOpen={showConfirm}
      title="Confirmation de suppression"
      message="Êtes-vous sûr de vouloir supprimer cet article ?"
      confirmText="Oui, supprimer"
      cancelText="Non, annuler"
      confirmButtonClass="btn-danger"
      onConfirm={handleConfirmDelete}
      onCancel={handleCancelDelete}
      onClose={() => setShowConfirm(false)}
    />
  </div>
);
```

## Fonctionnalités

### 🎨 **Design moderne**
- Interface claire et professionnelle
- Icônes FontAwesome intégrées
- Couleurs cohérentes avec Bootstrap

### 📱 **Responsive**
- Adaptation automatique aux écrans mobiles
- Boutons empilés sur petits écrans
- Marges et espacements adaptatifs

### ✨ **Animations**
- Animation d'entrée fluide
- Animation de sortie
- Transitions sur les boutons

### ♿ **Accessibilité**
- Support des lecteurs d'écran
- Navigation au clavier
- Labels ARIA appropriés

### 🔧 **Personnalisation**
- Couleurs des boutons configurables
- Textes personnalisables
- Gestion des événements flexible

## Cas d'usage

### 1. **Suppression d'éléments**
```jsx
<ConfirmationPopup
  isOpen={showDeleteConfirm}
  message="Êtes-vous sûr de vouloir supprimer cet élément ?"
  confirmText="Oui, supprimer"
  cancelText="Non, annuler"
  confirmButtonClass="btn-danger"
  onConfirm={handleDelete}
  onClose={() => setShowDeleteConfirm(false)}
/>
```

### 2. **Confirmation d'action**
```jsx
<ConfirmationPopup
  isOpen={showActionConfirm}
  title="Confirmation d'action"
  message="Voulez-vous vraiment effectuer cette action ?"
  confirmText="Confirmer"
  cancelText="Annuler"
  confirmButtonClass="btn-primary"
  onConfirm={handleAction}
  onClose={() => setShowActionConfirm(false)}
/>
```

### 3. **Avertissement**
```jsx
<ConfirmationPopup
  isOpen={showWarning}
  title="Attention"
  message="Cette action est irréversible. Continuer ?"
  confirmText="Continuer"
  cancelText="Arrêter"
  confirmButtonClass="btn-warning"
  onConfirm={handleContinue}
  onClose={() => setShowWarning(false)}
/>
```

## Remplacement de window.confirm

### ❌ **Avant (window.confirm)**
```jsx
const handleDelete = () => {
  if (window.confirm('Êtes-vous sûr de vouloir supprimer ?')) {
    // Action de suppression
  }
};
```

### ✅ **Après (ConfirmationPopup)**
```jsx
const [showConfirm, setShowConfirm] = useState(false);

const handleDelete = () => {
  setShowConfirm(true);
};

const handleConfirm = () => {
  // Action de suppression
  setShowConfirm(false);
};

return (
  <>
    <button onClick={handleDelete}>Supprimer</button>
    
    <ConfirmationPopup
      isOpen={showConfirm}
      message="Êtes-vous sûr de vouloir supprimer ?"
      onConfirm={handleConfirm}
      onClose={() => setShowConfirm(false)}
    />
  </>
);
```

## Avantages

1. **UX améliorée** : Interface plus professionnelle et intuitive
2. **Personnalisation** : Adaptation aux besoins de l'application
3. **Responsive** : Fonctionne sur tous les appareils
4. **Accessibilité** : Meilleur support des technologies d'assistance
5. **Maintenance** : Code plus maintenable et testable
6. **Cohérence** : Design uniforme dans toute l'application

## Fichiers associés

- `confirmation-popup.jsx` - Composant React
- `confirmation-popup.css` - Styles CSS
- `index.js` - Export du composant
- `README.md` - Documentation (ce fichier)
