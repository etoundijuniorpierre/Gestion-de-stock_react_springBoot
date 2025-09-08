# Erreur lors de la suppression d'un article

## Problème identifié

Lors de la tentative de suppression d'un article, deux erreurs principales se produisent :

### 1. Erreur Backend (Spring Boot)
```
java.lang.NullPointerException: Cannot invoke "com.example.Gestion.de.stock.repository.LigneCdeCltRepository.findAllByArticleId(java.lang.Integer)" because "this.commandeClientRepository" is null
```

**Cause :** Le repository `commandeClientRepository` n'est pas injecté correctement dans `ArticleServiceImpl.deleteById()`.

**Impact :** L'article ne peut pas être supprimé car le système ne peut pas vérifier s'il est utilisé dans des commandes clients.

### 2. Erreur Frontend (React)
```
⚠️ Token présent mais erreur d'authentification, tentative de rafraîchissement
❌ Échec du rafraîchissement du token, redirection vers login
```

**Cause :** Le token d'authentification a expiré ou est invalide.

## Solutions mises en place

### Frontend (React)

#### 1. Amélioration de la gestion des erreurs
- **Service Article :** Gestion spécifique des erreurs 401 (authentification) et 500 (serveur)
- **Hook useErrorHandler :** Ajout de la gestion des messages de succès
- **Composant ErrorHandler :** Support des messages de succès et d'erreur
- **Composant Article :** Gestion différenciée des types d'erreurs

#### 2. Gestion des erreurs d'authentification
- Détection automatique des erreurs 401
- Tentative de rafraîchissement du token
- Redirection vers la page de login en cas d'échec
- Messages d'erreur explicites pour l'utilisateur

#### 3. Gestion des erreurs serveur
- Détection des erreurs 500
- Messages d'erreur informatifs pour l'utilisateur
- Suggestion de vérifier les dépendances de l'article

#### 4. Gestion des erreurs métier (HTTP 400)
- Détection automatique des erreurs 400
- Message spécifique : "Impossible de supprimer un article déjà utilisé dans des commandes client"
- Type d'erreur : `businessError`
- Affichage approprié dans l'interface utilisateur

#### 5. Amélioration de l'interface utilisateur
- Remplacement de `window.confirm` par un popup personnalisé
- Composant `ConfirmationPopup` moderne et responsive
- Meilleure expérience utilisateur lors de la suppression
- Design cohérent avec l'application

### Backend (Spring Boot) - À implémenter

#### 1. Injection des repositories
```java
@Service
public class ArticleServiceImpl implements ArticleService {
    
    @Autowired
    private CommandeClientRepository commandeClientRepository;
    
    @Autowired
    private CommandeFournisseurRepository commandeFournisseurRepository;
    
    // ... autres repositories
}
```

#### 2. Vérification des dépendances avant suppression
```java
@Override
public void deleteById(Integer id) {
    // Vérifier si l'article est utilisé dans des commandes clients
    List<LigneCdeClt> lignesClient = commandeClientRepository.findAllByArticleId(id);
    if (!lignesClient.isEmpty()) {
        throw new BusinessException("L'article ne peut pas être supprimé car il est utilisé dans " + lignesClient.size() + " commande(s) client(s)");
    }
    
    // Vérifier si l'article est utilisé dans des commandes fournisseurs
    List<LigneCdeFrs> lignesFournisseur = commandeFournisseurRepository.findAllByArticleId(id);
    if (!lignesFournisseur.isEmpty()) {
        throw new BusinessException("L'article ne peut pas être supprimé car il est utilisé dans " + lignesFournisseur.size() + " commande(s) fournisseur(s)");
    }
    
    // Si aucune dépendance, supprimer l'article
    articleRepository.deleteById(id);
}
```

## Recommandations

### 1. Immédiat (Frontend)
- ✅ Gestion des erreurs d'authentification
- ✅ Messages d'erreur informatifs
- ✅ Gestion des messages de succès

### 2. Court terme (Backend)
- 🔧 Corriger l'injection des repositories
- 🔧 Implémenter la vérification des dépendances
- 🔧 Retourner des messages d'erreur explicites

### 3. Long terme
- 📊 Ajouter une interface pour voir les dépendances d'un article
- 📊 Permettre la suppression en cascade (optionnel)
- 📊 Logs détaillés pour le debugging

## Tests recommandés

1. **Test d'authentification :**
   - Vérifier que l'expiration du token est gérée correctement
   - Vérifier la redirection vers la page de login

2. **Test de suppression :**
   - Article sans dépendances → doit être supprimé
   - Article avec commandes clients → doit retourner une erreur explicite
   - Article avec commandes fournisseurs → doit retourner une erreur explicite
   - Article avec dépendances → doit retourner l'erreur HTTP 400 avec le message approprié

3. **Test des messages :**
   - Vérifier l'affichage des messages de succès
   - Vérifier l'affichage des messages d'erreur appropriés

## Fichiers modifiés

- `src/services/article/article.service.jsx` - Gestion des erreurs
- `src/hooks/useErrorHandler.js` - Support des messages de succès
- `src/components/error-handler/error-handler.jsx` - Affichage des succès/erreurs
- `src/pages/page-articles/article/article.jsx` - Gestion des erreurs dans le composant
- `src/services/article/article.service.test.js` - Tests de gestion des erreurs
- `src/components/confirmation-popup/confirmation-popup.jsx` - Nouveau composant popup de confirmation
- `src/components/confirmation-popup/confirmation-popup.css` - Styles du popup
- `src/components/confirmation-popup/index.js` - Export du composant
- `src/components/confirmation-popup/README.md` - Documentation du composant
- `src/components/confirmation-popup/demo.jsx` - Composant de démonstration
