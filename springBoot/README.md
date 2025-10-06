# Gestion de Stock

## Description du projet

Ce projet est une application de gestion de stock complète avec un backend Spring Boot et un frontend React. L'application permet de gérer les articles, les mouvements de stock, les clients, les fournisseurs, les commandes et les ventes.

### Fonctionnalités principales

- Gestion des articles (création, modification, suppression, consultation)
- Suivi des mouvements de stock (entrées, sorties, corrections)
- Gestion des clients et fournisseurs
- Création et suivi des commandes clients et fournisseurs
- Gestion des ventes
- Calcul du stock réel en temps réel

## Technologies utilisées

### Backend (Spring Boot)
- Java 17+
- Spring Boot 3.x
- Spring Security
- Spring Data JPA
- Hibernate
- PostgreSQL/MySQL
- Swagger/OpenAPI pour la documentation des APIs
- JWT pour l'authentification

### Frontend (React)
- React 18+
- React Router
- Axios pour les appels HTTP
- Material-UI/Bootstrap pour l'interface utilisateur

## Installation et configuration

### Prérequis

- Java 17 ou supérieur
- Maven 3.8+
- Node.js 16+ et npm
- Base de données PostgreSQL ou MySQL

### Configuration de la base de données

1. Créez une base de données dans votre SGBD
2. Mettez à jour les informations de connexion dans le fichier `src/main/resources/application.properties`

### Lancement du backend

```bash
# Compilation du projet
mvn clean compile

# Lancement de l'application
mvn spring-boot:run
```

L'application démarre par défaut sur le port 8080 ou 8085.

### Accès à la documentation de l'API

Une fois le backend lancé, vous pouvez accéder à la documentation Swagger à l'adresse :
- http://localhost:8080/swagger-ui.html
- ou http://localhost:8085/swagger-ui.html (selon le port configuré)

## Lancement du frontend React

Le frontend React se trouve dans un répertoire séparé. Pour le lancer :

1. Naviguez vers le répertoire du frontend React
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Démarrez l'application :
   ```bash
   npm start
   ```

L'application React démarre généralement sur le port 3000.

## Structure du projet backend

```
src/
├── main/
│   ├── java/
│   │   └── com/example/Gestion/de/stock/
│   │       ├── configuration/     # Configuration de l'application
│   │       ├── controller/        # Contrôleurs REST
│   │       ├── dto/               # DTOs pour la communication
│   │       ├── exception/         # Gestion des exceptions
│   │       ├── model/             # Entités JPA
│   │       ├── repository/        # Interfaces de repository
│   │       ├── service/           # Services métier
│   │       └── validator/         # Validateurs
│   └── resources/
│       └── application.properties # Configuration de l'application
└── test/                          # Tests unitaires et d'intégration
```

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