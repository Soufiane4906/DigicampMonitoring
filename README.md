# DigicampMonitoring 🚀

Application complète de gestion de projets et de ressources pour Digicamp avec génération automatique de newsletters mensuelles en PDF.

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Architecture](#architecture)
- [Technologies](#technologies)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Déploiement Azure](#déploiement-azure)
- [Fonctionnalités](#fonctionnalités)
- [Structure du projet](#structure-du-projet)
- [Contribution](#contribution)

## 🎯 Vue d'ensemble

DigicampMonitoring est une solution complète de gestion permettant aux Engineering Managers (EM) de :
- Gérer les projets (création, suivi, statuts personnalisables)
- Gérer les collaborateurs (profils, compétences, disponibilité)
- Affecter les collaborateurs aux projets
- Gérer les besoins des projets en ressources
- Générer des newsletters mensuelles en PDF

## 🏗️ Architecture

### Architecture Globale
```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│                 │      │                  │      │                 │
│   Angular 17    │─────▶│  Spring Boot 3   │─────▶│  Azure SQL DB   │
│   (Frontend)    │      │   (Backend)      │      │                 │
│                 │      │                  │      └─────────────────┘
└─────────────────┘      └──────────────────┘
        │                         │
        │                         │
        ▼                         ▼
┌─────────────────┐      ┌──────────────────┐
│ Azure Static    │      │ Azure Blob       │
│ Web Apps        │      │ Storage          │
└─────────────────┘      └──────────────────┘
```

### Backend - Architecture Hexagonale (DDD)
```
back/
├── domain/              # Couche Domain
│   ├── model/          # Entités métier
│   └── repository/     # Interfaces de repositories
├── application/        # Couche Application
│   └── service/       # Services métier
├── infrastructure/     # Couche Infrastructure
│   ├── persistence/   # Implémentation JPA
│   └── security/      # Configuration sécurité
└── presentation/      # Couche Présentation
    ├── controller/   # REST Controllers
    └── dto/         # Data Transfer Objects
```

### Frontend - Architecture Modulaire
```
front/src/app/
├── core/               # Services centraux
│   ├── guards/        # Guards de routing
│   ├── interceptors/  # HTTP Interceptors
│   ├── models/        # Interfaces TypeScript
│   └── services/      # Services HTTP
├── features/          # Modules fonctionnels
│   ├── authentication/
│   ├── dashboard/
│   ├── projects/
│   └── collaborators/
└── shared/           # Composants partagés
```

## 🛠️ Technologies

### Backend
- **Java 17** - Langage de programmation
- **Spring Boot 3.2.0** - Framework application
- **Spring Data JPA** - ORM et accès données
- **Spring Security + JWT** - Authentification et autorisation
- **Azure SQL Database** - Base de données
- **Azure Blob Storage** - Stockage de fichiers
- **iText 7** - Génération de PDF
- **Maven** - Gestion de dépendances

### Frontend
- **Angular 17** - Framework frontend
- **TypeScript 5.2** - Langage typé
- **PrimeNG** - Bibliothèque de composants UI
- **RxJS** - Programmation réactive
- **Standalone Components** - Architecture moderne Angular

### Infrastructure
- **Azure App Service** - Hébergement backend
- **Azure Static Web Apps** - Hébergement frontend
- **Azure SQL Database** - Base de données managée
- **Azure Blob Storage** - Stockage de fichiers
- **Bicep** - Infrastructure as Code
- **Docker** - Conteneurisation
- **GitHub Actions** - CI/CD

## 🚀 Installation

### Prérequis
- Java 17+
- Node.js 18+
- Maven 3.6+
- Docker (optionnel)
- Azure CLI (pour déploiement)

### Installation locale avec Docker Compose

1. **Cloner le repository**
```bash
git clone https://github.com/Soufiane4906/DigicampMonitoring.git
cd DigicampMonitoring
```

2. **Démarrer avec Docker Compose**
```bash
docker-compose up -d
```

Cette commande démarre :
- SQL Server (port 1433)
- Backend Spring Boot (port 8080)
- Frontend Angular (port 80)

3. **Accéder à l'application**
- Frontend : http://localhost
- Backend API : http://localhost:8080/api
- Health Check : http://localhost:8080/api/health

### Installation manuelle

#### Backend
```bash
cd back
mvn clean install
mvn spring-boot:run
```

#### Frontend
```bash
cd front
npm install
npm start
```

## 📖 Utilisation

### Première connexion

1. **S'inscrire** sur http://localhost/auth/register
   - Créer un compte utilisateur
   - Le rôle "EM" est assigné automatiquement

2. **Se connecter** sur http://localhost/auth/login
   - Utiliser les identifiants créés
   - Un token JWT est généré et stocké

3. **Accéder au Dashboard**
   - Vue d'ensemble de l'application
   - Navigation vers les modules

### Gestion des projets

- **Lister** : `/projects` - Voir tous les projets
- **Créer** : Cliquer sur "Nouveau projet"
- **Modifier** : Icône crayon sur un projet
- **Supprimer** : Icône poubelle sur un projet

### Gestion des collaborateurs

- **Lister** : `/collaborators` - Voir tous les collaborateurs
- **Créer** : Cliquer sur "Nouveau collaborateur"
- **Modifier** : Icône crayon sur un collaborateur
- **Supprimer** : Icône poubelle sur un collaborateur
- **Filtrer disponibles** : Voir uniquement les collaborateurs disponibles

## ☁️ Déploiement Azure

### Déploiement de l'infrastructure

```bash
# Se connecter à Azure
az login

# Déployer l'infrastructure avec Bicep
az deployment sub create \
  --location westeurope \
  --template-file infrastructure/main.bicep \
  --parameters environmentName=prod projectName=digicamp-monitoring
```

### Déploiement du Backend

```bash
cd back
mvn clean package
az webapp deploy \
  --resource-group digicamp-monitoring-prod-rg \
  --name digicamp-monitoring-backend-prod \
  --src-path target/*.jar
```

### Déploiement du Frontend

```bash
cd front
npm run build -- --configuration production
az staticwebapp deploy \
  --name digicamp-monitoring-frontend-prod \
  --resource-group digicamp-monitoring-prod-rg \
  --app-location dist/digicamp-monitoring
```

## ✨ Fonctionnalités

### ✅ Implémenté
- [x] Authentification JWT (inscription, connexion, déconnexion)
- [x] Gestion des utilisateurs avec rôles (EM)
- [x] CRUD Projets (liste paginée, création, modification, suppression)
- [x] Statuts de projets paramétrables
- [x] CRUD Collaborateurs (liste paginée, création, modification, suppression)
- [x] Gestion de la disponibilité des collaborateurs
- [x] Dashboard avec navigation
- [x] API REST sécurisée
- [x] Architecture hexagonale (DDD)
- [x] Responsive design avec PrimeNG
- [x] Docker et Docker Compose
- [x] Infrastructure as Code (Bicep)

### 🔄 En cours / TODO
- [ ] Dialogues de création/modification de projets
- [ ] Dialogues de création/modification de collaborateurs
- [ ] Affectation de collaborateurs aux projets
- [ ] Gestion des besoins en ressources
- [ ] Génération de newsletter PDF
- [ ] Upload de logos de projets
- [ ] Filtres et recherche avancée
- [ ] Pagination côté serveur
- [ ] Tests unitaires et d'intégration
- [ ] Tests E2E

## 📁 Structure du projet

```
DigicampMonitoring/
├── back/                    # Backend Spring Boot
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/digicamp/monitoring/
│   │       │       ├── domain/
│   │       │       ├── application/
│   │       │       ├── infrastructure/
│   │       │       └── presentation/
│   │       └── resources/
│   │           └── application.yml
│   ├── Dockerfile
│   ├── pom.xml
│   └── README.md
│
├── front/                   # Frontend Angular
│   ├── src/
│   │   └── app/
│   │       ├── core/
│   │       ├── features/
│   │       └── shared/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── README.md
│
├── infrastructure/         # Infrastructure Azure (Bicep)
│   ├── main.bicep
│   └── modules/
│       ├── sql-server.bicep
│       ├── app-service.bicep
│       ├── storage.bicep
│       └── static-web-app.bicep
│
├── docker-compose.yml     # Configuration Docker Compose
└── README.md             # Ce fichier
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

MIT License - voir le fichier [LICENSE](LICENSE) pour plus de détails

## 👥 Auteurs

- **Soufiane** - *Développeur* - [Soufiane4906](https://github.com/Soufiane4906)

## 📞 Contact

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue sur GitHub.

---

**Fait avec ❤️ pour Digicamp**
