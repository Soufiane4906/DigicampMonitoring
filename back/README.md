# DigicampMonitoring Backend

## Description
Backend de l'application DigicampMonitoring - Système de gestion de projets et de ressources.

## Technologies
- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- Spring Security avec JWT
- Azure SQL Database
- Azure Blob Storage
- iText 7 (génération PDF)

## Architecture
Architecture hexagonale (DDD) avec les couches suivantes :
- **Domain** : Entités métier et interfaces de repositories
- **Application** : Services et cas d'utilisation
- **Infrastructure** : Implémentations JPA, Azure services
- **Presentation** : Contrôleurs REST et DTOs

## Prérequis
- Java 17+
- Maven 3.6+
- SQL Server (local ou Azure)

## Installation

1. **Cloner le repository**
```bash
git clone https://github.com/Soufiane4906/DigicampMonitoring.git
cd DigicampMonitoring/back
```

2. **Configuration**

Copier `.env.example` vers `.env` et configurer les variables :
```env
DB_URL=jdbc:sqlserver://localhost:1433;databaseName=digicampdb
DB_USERNAME=sa
DB_PASSWORD=YourPassword123
JWT_SECRET=YourSecretKey
AZURE_STORAGE_CONNECTION_STRING=YourAzureConnectionString
```

3. **Build**
```bash
mvn clean install
```

4. **Run**
```bash
mvn spring-boot:run
```

L'application sera accessible sur `http://localhost:8080`

## Docker

### Build l'image
```bash
docker build -t digicamp-monitoring-backend .
```

### Run le conteneur
```bash
docker run -p 8080:8080 \
  -e DB_URL=jdbc:sqlserver://host:1433;databaseName=digicampdb \
  -e DB_USERNAME=sa \
  -e DB_PASSWORD=password \
  digicamp-monitoring-backend
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

### Projects
- `GET /api/projects` - Liste des projets
- `GET /api/projects/{id}` - Détails d'un projet
- `POST /api/projects` - Créer un projet
- `PUT /api/projects/{id}` - Modifier un projet
- `DELETE /api/projects/{id}` - Supprimer un projet

### Collaborators
- `GET /api/collaborators` - Liste des collaborateurs
- `GET /api/collaborators/available` - Collaborateurs disponibles
- `GET /api/collaborators/{id}` - Détails d'un collaborateur
- `POST /api/collaborators` - Créer un collaborateur
- `PUT /api/collaborators/{id}` - Modifier un collaborateur
- `DELETE /api/collaborators/{id}` - Supprimer un collaborateur

### Health
- `GET /api/health` - Vérification de l'état du service

## Tests
```bash
mvn test
```

## Déploiement Azure

### Via Azure CLI
```bash
az webapp up --name digicamp-monitoring --resource-group digicamp-rg
```

## License
MIT