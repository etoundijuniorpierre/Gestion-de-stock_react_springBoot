# Gestion de Stock - Application React

## Description du Projet

Cette application est un système de gestion de stock complet développé avec React. Elle permet de gérer efficacement les stocks d'une entreprise en offrant les fonctionnalités suivantes :

- **Gestion des utilisateurs** : Création, modification, suppression et authentification des utilisateurs
- **Gestion des articles** : Catalogue complet des produits avec catégorisation
- **Gestion des mouvements de stock** : Suivi des entrées, sorties et corrections de stock
- **Gestion des clients et fournisseurs** : Base de données complète des partenaires commerciaux
- **Gestion des commandes** : Suivi des commandes clients et fournisseurs avec différents statuts
- **Interface utilisateur moderne** : Dashboard intuitif avec navigation simplifiée

L'application utilise une architecture moderne basée sur React avec Vite pour un développement rapide et efficace.

## Prérequis

Avant de lancer l'application, assurez-vous d'avoir installé :

- Node.js (version 14 ou supérieure)
- npm ou yarn

## Installation

1. Clonez le repository :
```bash
git clone <url-du-repository>
```

2. Naviguez vers le dossier du projet React :
```bash
cd react
```

3. Installez les dépendances :
```bash
npm install
```
ou
```bash
yarn install
```

## Configuration

Assurez-vous que le backend Spring Boot est en cours d'exécution sur `http://localhost:8085`. Vous pouvez modifier l'URL du backend dans le fichier `src/config/api.config.js` si nécessaire.

## Lancement de l'Application

Pour lancer l'application en mode développement :

```bash
npm run dev
```
ou
```bash
yarn dev
```

L'application sera accessible à l'adresse `http://localhost:5173` (ou un port différent si 5173 est déjà utilisé).

## Build pour la Production

Pour créer une version optimisée de l'application :

```bash
npm run build
```
ou
```bash
yarn build
```

Les fichiers de production seront générés dans le dossier `dist`.

## Technologies Utilisées

- React 18
- Vite
- React Router pour la navigation
- Sass/SCSS pour le styling
- Fetch API pour les appels HTTP
- Bootstrap 5 pour l'interface utilisateur

## Structure du Projet

```
src/
├── assets/           # Images et ressources statiques
├── components/       # Composants React réutilisables
├── config/           # Configuration de l'application
├── hooks/            # Hooks personnalisés
├── pages/            # Pages principales de l'application
├── services/         # Services pour l'API et la logique métier
├── styles/           # Styles globaux
└── utils/            # Fonctions utilitaires
```