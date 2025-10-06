# Gestion de Stock

## Description du projet

Ce projet est une application de gestion de stock complète avec un backend Spring Boot. L'application permet de gérer les articles, les mouvements de stock, les clients, les fournisseurs, les commandes et les ventes.

### Fonctionnalités principales

- Gestion des articles (création, modification, suppression, consultation)
- Suivi des mouvements de stock (entrées, sorties, corrections)
- Gestion des clients et fournisseurs
- Création et suivi des commandes clients et fournisseurs
- Gestion des ventes
- Gestion des utilisateurs et authentification
- Calcul du stock réel en temps réel

## Technologies utilisées

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

- Java 21
- Maven 3.8+
- Base de données PostgreSQL

### Configuration de la base de données

#### Création de la base de données

1. **Pour PostgreSQL :**
   ```sql
   CREATE DATABASE gestionstock;
   CREATE USER postgres WITH PASSWORD 'root';
   GRANT ALL PRIVILEGES ON DATABASE gestionstock TO postgres;
   ```

**Note :** L'application est déjà configurée pour utiliser une base de données PostgreSQL nommée `gestionstock` avec l'utilisateur `postgres` et le mot de passe `root`.

#### Configuration de l'application

La configuration actuelle dans le fichier `src/main/resources/application.properties` est :

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

**Explication des paramètres JPA :**
- `spring.jpa.hibernate.ddl-auto=update` : Hibernate créera automatiquement les tables de la base de données en se basant sur les entités définies dans le code. Si les tables existent déjà, elles seront mises à jour si nécessaire.

Si vous devez modifier ces paramètres, mettez à jour le fichier `src/main/resources/application.properties` avec vos propres valeurs.

### Importation de la base de données

Le projet inclut des fichiers de sauvegarde de la base de données dans le répertoire `src/main/resources` :
- `stock.sql` : Fichier SQL contenant les données de la base
- `stock.dump` : Fichier de sauvegarde binaire PostgreSQL

#### Importation du fichier SQL

Pour importer le fichier SQL dans votre base de données :

```bash
# Naviguez vers le répertoire des ressources
cd src/main/resources

# Importez le fichier SQL
psql -U postgres -d gestionstock -f stock.sql
```

#### Importation du fichier dump (format binaire)

Pour importer le fichier dump binaire :

```bash
# Naviguez vers le répertoire des ressources
cd src/main/resources

# Importez le fichier dump
pg_restore -U postgres -d gestionstock stock.dump
```

### Exportation de la base de données

Pour exporter la base de données actuelle :

#### Exportation en format SQL

```bash
# Exportez la base de données en format SQL
pg_dump -U postgres -d gestionstock > backup.sql
```

#### Exportation en format binaire

```bash
# Exportez la base de données en format binaire
pg_dump -U postgres -Fc -d gestionstock > backup.dump
```

### Lancement du backend

```bash
# Compilation du projet
mvn clean compile

# Lancement de l'application
mvn spring-boot:run
```

L'application démarre par défaut sur le port 8085.

Lors du premier lancement, Hibernate créera automatiquement le schéma de base de données. Vous pouvez voir les requêtes SQL générées dans la console grâce au paramètre `spring.jpa.show-sql=true`.

### Accès à la documentation de l'API

Une fois le backend lancé, vous pouvez accéder à la documentation Swagger à l'adresse :
- http://localhost:8085/swagger-ui.html

### URL de base de l'API

Toutes les APIs sont accessibles via l'URL de base :
- http://localhost:8085/api/gestionDeStock

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
│       ├── application.properties # Configuration de l'application
│       ├── stock.sql              # Fichier SQL de sauvegarde de la base
│       └── stock.dump             # Fichier de sauvegarde binaire de la base
└── test/                          # Tests unitaires et d'intégration
```

## Endpoints principaux

### Authentification
- `POST /api/gestionDeStock/authenticate` - Connexion utilisateur

### Articles
- `POST /api/gestionDeStock/articles/create` - Créer un article
- `GET /api/gestionDeStock/articles/{idArticle}` - Récupérer un article par ID
- `GET /api/gestionDeStock/articles/all` - Lister tous les articles
- `PUT /api/gestionDeStock/articles/{id}` - Mettre à jour un article
- `DELETE /api/gestionDeStock/articles/delete/{idArticle}` - Supprimer un article

### Mouvements de stock
- `POST /api/gestionDeStock/mvtstk/entree` - Enregistrer une entrée de stock
- `POST /api/gestionDeStock/mvtstk/sortie` - Enregistrer une sortie de stock
- `POST /api/gestionDeStock/mvtstk/correctionpos` - Correction positive de stock
- `POST /api/gestionDeStock/mvtstk/correctionneg` - Correction négative de stock
- `GET /api/gestionDeStock/mvtstk/stockreel/{idArticle}` - Obtenir le stock réel d'un article

### Clients
- `POST /api/gestionDeStock/clients/create` - Créer un client
- `GET /api/gestionDeStock/clients/{idClient}` - Récupérer un client par ID
- `GET /api/gestionDeStock/clients/all` - Lister tous les clients

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