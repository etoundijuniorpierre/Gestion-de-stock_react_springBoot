# Gestion de Stock - Application complète React + Spring Boot

**NOTE IMPORTANTE SUR LA GESTION DES MOTS DE PASSE :**
> Lorsque vous créez votre compte, vous êtes automatiquement redirigé vers la modification de votre mot de passe. Si après votre première déconnexion vous souhaitez vous reconnecter et rencontrez un problème, connectez-vous avec le mot de passe "som3R@nd0mP@$$word" puis modifiez à nouveau votre mot de passe après la connexion.

## Description du Projet

Cette application est un système de gestion de stock complet composé d'un frontend React et d'un backend Spring Boot. Elle permet de gérer efficacement les stocks d'une entreprise en offrant les fonctionnalités suivantes :

### Fonctionnalités principales

- **Gestion des utilisateurs** : Création, modification, suppression et authentification des utilisateurs
- **Gestion des articles** : Catalogue complet des produits avec catégorisation
- **Gestion des mouvements de stock** : Suivi des entrées, sorties et corrections de stock
- **Gestion des clients et fournisseurs** : Base de données complète des partenaires commerciaux
- **Gestion des commandes** : Suivi des commandes clients et fournisseurs avec différents statuts
- **Interface utilisateur moderne** : Dashboard intuitif avec navigation simplifiée

## Structure du projet

```
├── react/                 # Frontend React
│   ├── src/               # Code source de l'application
│   ├── package.json       # Dépendances et scripts npm
│   └── README.md          # Documentation spécifique du frontend
└── springBoot/            # Backend Spring Boot
    ├── src/               # Code source de l'application
    ├── pom.xml            # Fichier de configuration Maven
    └── README.md          # Documentation spécifique du backend
```

## Technologies utilisées

### Frontend (React)
- React 18
- Vite
- React Router pour la navigation
- Sass/SCSS pour le styling
- Fetch API pour les appels HTTP

### Backend (Spring Boot)
- Java 21
- Spring Boot 3.4.4
- Spring Security
- Spring Data JPA
- Hibernate 6.4.4.Final
- PostgreSQL
- Swagger/OpenAPI pour la documentation des APIs
- JWT pour l'authentification

## Installation et configuration

### Prérequis

- Node.js (version 14 ou supérieure) pour le frontend
- Java 21 et Maven 3.8+ pour le backend
- Base de données PostgreSQL

### Configuration de la base de données

1. **Création de la base de données :**
   ```sql
   CREATE DATABASE gestionstock;
   CREATE USER postgres WITH PASSWORD 'root';
   GRANT ALL PRIVILEGES ON DATABASE gestionstock TO postgres;
   ```

2. **Configuration de l'application Spring Boot :**
   
   La configuration actuelle dans le fichier `springBoot/src/main/resources/application.properties` est :
   ```properties
   # PostgreSQL Database
   spring.datasource.url=jdbc:postgresql://localhost:5432/gestionstock
   spring.datasource.username=postgres
   spring.datasource.password=root
   spring.datasource.driver-class-name=org.postgresql.Driver
   
   # JPA & Hibernate
   spring.jpa.database=postgresql
   spring.jpa.show-sql=true
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
   ```

### Lancement de l'application

1. **Démarrer le backend Spring Boot :**
   ```bash
   cd springBoot
   mvn clean compile
   mvn spring-boot:run
   ```
   Le backend démarre par défaut sur le port 8085.

2. **Démarrer le frontend React :**
   ```bash
   cd react
   npm install
   npm run dev
   ```
   Le frontend démarre par défaut sur le port 5173.

### Accès à l'application

- Interface utilisateur : http://localhost:5173
- Documentation de l'API Swagger : http://localhost:8085/swagger-ui.html
- URL de base de l'API : http://localhost:8085/api/gestionDeStock

## Documentation détaillée

Pour plus de détails sur chaque partie de l'application, consultez les README spécifiques :
- [Documentation du Frontend React](./react/README.md)
- [Documentation du Backend Spring Boot](./springBoot/README.md)

## Contribution

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/ma-fonctionnalite`)
3. Commitez vos modifications (`git commit -am 'Ajout d'une fonctionnalité'`)
4. Poussez la branche (`git push origin feature/ma-fonctionnalite`)
5. Ouvrez une Pull Request

## Licence

Ce projet est sous licence MIT.

## Contact

Pour toute question ou suggestion, veuillez contacter l'équipe de développement.