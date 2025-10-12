# 📚 Documentation Technique - DigicampMonitoring

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture](#architecture)
3. [Diagrammes](#diagrammes)
4. [Structure du Projet](#structure-du-projet)
5. [Technologies](#technologies)
6. [Installation](#installation)
7. [Utilisation](#utilisation)

---

## 🎯 Vue d'ensemble

**DigicampMonitoring** est une application web de gestion des projets et des ressources pour le périmètre Digicamp. Elle permet de :

- 👥 Gérer les collaborateurs (CRUD)
- 📁 Gérer les projets Digicamp (CRUD)
- 🔗 Affecter des collaborateurs aux projets
- 📊 Suivre les disponibilités et compétences
- 📄 Générer des newsletters de projets en PDF

### Utilisateurs
- **EM (Engineering Manager)** du périmètre Digicamp
- Droits de délégation à un autre EM

---

## 🏗️ Architecture

### Architecture Globale

```mermaid
graph TB
    subgraph "Frontend - Angular 17"
        A[Components] --> B[Services]
        B --> C[Models]
        A --> D[Guards]
    end
    
    subgraph "Backend - Spring Boot 3.2"
        E[Controllers] --> F[Use Cases]
        F --> G[Domain Services]
        G --> H[Repositories]
        H --> I[Entities]
    end
    
    subgraph "Database"
        J[(SQL Server 2022)]
    end
    
    B -->|HTTP/REST| E
    H -->|JPA/Hibernate| J
    
    subgraph "Security"
        K[JWT Token]
        L[Spring Security]
    end
    
    B -.->|Auth| K
    E -.->|Protected| L
    
    style A fill:#667eea
    style E fill:#764ba2
    style J fill:#f5576c
```

### Architecture DDD (Domain-Driven Design)

```mermaid
graph LR
    subgraph "Presentation Layer"
        A[REST Controllers]
    end
    
    subgraph "Application Layer"
        B[Use Cases]
        C[DTOs]
    end
    
    subgraph "Domain Layer"
        D[Domain Services]
        E[Entities]
        F[Value Objects]
        G[Domain Events]
    end
    
    subgraph "Infrastructure Layer"
        H[Repositories Impl]
        I[External Services]
        J[Database]
    end
    
    A --> B
    B --> D
    D --> E
    H --> E
    H --> J
    
    style D fill:#667eea
    style E fill:#764ba2
```

---

## 📊 Diagrammes

### Diagramme de Classes - Domaine Principal

```mermaid
classDiagram
    class User {
        -Long id
        -String username
        -String password
        -String email
        -UserRole role
        +authenticate()
        +delegateRights()
    }
    
    class Project {
        -Long id
        -String name
        -String logo
        -String description
        -Date startDate
        -Date endDate
        -ProjectStatus status
        -List~Collaborator~ collaborators
        +addCollaborator()
        +removeCollaborator()
        +updateStatus()
        +generateNewsletter()
    }
    
    class Collaborator {
        -Long id
        -String firstName
        -String lastName
        -String email
        -String photo
        -Grade grade
        -String position
        -Site site
        -Boolean available
        -List~String~ skills
        +assignToProject()
        +updateAvailability()
    }
    
    class ProjectNeed {
        -Long id
        -Grade requiredGrade
        -String technology
        -Site preferredSite
        -Integer quantity
    }
    
    class ProjectStatus {
        <<enumeration>>
        EN_COURS
        TERMINE
        EN_PAUSE
        ANNULE
        PLANIFIE
    }
    
    class Grade {
        <<enumeration>>
        A4
        A5
        B1
        B2
        B3
        C1
        C2
        C3
    }
    
    class Site {
        <<enumeration>>
        CASA
        RABAT
        INDIFFERENT
    }
    
    User "1" --> "*" Project : manages
    Project "1" --> "*" Collaborator : has
    Project "1" --> "*" ProjectNeed : defines
    Collaborator --> Grade
    Collaborator --> Site
    Project --> ProjectStatus
```

### Diagramme de Séquence - Authentification

```mermaid
sequenceDiagram
    actor EM as Engineering Manager
    participant UI as Angular App
    participant Auth as Auth Service
    participant API as Backend API
    participant JWT as JWT Service
    participant DB as Database
    
    EM->>UI: Enter credentials
    UI->>Auth: login(username, password)
    Auth->>API: POST /api/auth/login
    API->>DB: Find user by username
    DB-->>API: User data
    API->>API: Validate password
    API->>JWT: Generate JWT token
    JWT-->>API: JWT token
    API-->>Auth: {token, user}
    Auth->>Auth: Store token in localStorage
    Auth-->>UI: Authentication success
    UI->>UI: Navigate to Dashboard
    UI-->>EM: Show Dashboard
    
    Note over Auth,API: All subsequent requests<br/>include JWT in headers
```

### Diagramme de Séquence - Gestion de Projet

```mermaid
sequenceDiagram
    actor EM as Engineering Manager
    participant UI as Project List
    participant Dialog as Project Dialog
    participant Service as Project Service
    participant API as Backend API
    participant DB as Database
    
    EM->>UI: Click "Nouveau projet"
    UI->>Dialog: Open dialog
    Dialog-->>EM: Show form
    
    EM->>Dialog: Fill project details
    EM->>Dialog: Upload logo
    EM->>Dialog: Click "Créer"
    
    Dialog->>Dialog: Validate form
    Dialog->>Service: createProject(data)
    Service->>API: POST /api/projects
    API->>API: Validate data
    API->>DB: Save project
    DB-->>API: Saved project
    API-->>Service: Project created
    Service-->>Dialog: Success
    Dialog->>Dialog: Close dialog
    Dialog->>UI: Refresh project list
    UI->>Service: getProjects()
    Service->>API: GET /api/projects
    API->>DB: Fetch projects
    DB-->>API: Projects data
    API-->>Service: Projects list
    Service-->>UI: Update table
    UI-->>EM: Show updated list
```

### Diagramme de Séquence - Affectation Collaborateur à Projet

```mermaid
sequenceDiagram
    actor EM as Engineering Manager
    participant UI as Project Detail
    participant Dialog as Assignment Dialog
    participant PService as Project Service
    participant CService as Collaborator Service
    participant API as Backend API
    participant DB as Database
    
    EM->>UI: View project
    UI->>PService: getProject(id)
    PService->>API: GET /api/projects/{id}
    API->>DB: Fetch project with collaborators
    DB-->>API: Project data
    API-->>PService: Project
    PService-->>UI: Display project
    
    EM->>UI: Click "Affecter collaborateur"
    UI->>Dialog: Open dialog
    Dialog->>CService: getAvailableCollaborators()
    CService->>API: GET /api/collaborators?available=true
    API->>DB: Fetch available collaborators
    DB-->>API: Collaborators list
    API-->>CService: Available collaborators
    CService-->>Dialog: Show available collaborators
    
    EM->>Dialog: Select collaborator(s)
    EM->>Dialog: Click "Affecter"
    Dialog->>PService: assignCollaborators(projectId, collaboratorIds)
    PService->>API: POST /api/projects/{id}/collaborators
    API->>DB: Create assignments
    API->>DB: Update availability
    DB-->>API: Success
    API-->>PService: Assignment complete
    PService-->>Dialog: Success
    Dialog->>UI: Refresh project
    UI-->>EM: Show updated collaborators
```

### Diagramme de Séquence - Génération Newsletter PDF

```mermaid
sequenceDiagram
    actor EM as Engineering Manager
    participant UI as Project Detail
    participant Service as Newsletter Service
    participant API as Backend API
    participant PDF as PDF Generator (iText)
    participant Storage as File Storage
    
    EM->>UI: Click "Générer newsletter"
    UI->>Service: generateNewsletter(projectId)
    Service->>API: POST /api/projects/{id}/newsletter
    
    API->>API: Fetch project data
    API->>API: Fetch collaborators
    API->>API: Fetch project needs
    
    API->>PDF: Create PDF document
    PDF->>PDF: Add project header + logo
    PDF->>PDF: Add project description
    PDF->>PDF: Add collaborators section
    PDF->>PDF: Add skills matrix
    PDF->>PDF: Add needs section
    PDF-->>API: PDF byte array
    
    API->>Storage: Save PDF file
    Storage-->>API: File URL
    
    API-->>Service: {pdfUrl, fileName}
    Service->>Service: Download PDF
    Service-->>UI: PDF downloaded
    UI-->>EM: Show success + open PDF
```

### Diagramme de Flux - Cycle de Vie d'un Projet

```mermaid
stateDiagram-v2
    [*] --> Planifié: Créer projet
    
    Planifié --> EnCours: Démarrer projet
    Planifié --> Annulé: Annuler
    
    EnCours --> EnPause: Mettre en pause
    EnCours --> Terminé: Terminer
    EnCours --> Annulé: Annuler
    
    EnPause --> EnCours: Reprendre
    EnPause --> Annulé: Annuler
    
    Terminé --> [*]
    Annulé --> [*]
    
    note right of Planifié
        Nouveau projet créé
        Pas encore démarré
    end note
    
    note right of EnCours
        Collaborateurs affectés
        Développement actif
    end note
    
    note right of Terminé
        Projet livré
        Newsletter générée
    end note
```

### Architecture Frontend - Structure des Composants

```mermaid
graph TD
    A[App Component] --> B[Auth Module]
    A --> C[Dashboard Module]
    A --> D[Projects Module]
    A --> E[Collaborators Module]
    
    B --> B1[Login Component]
    B --> B2[Register Component]
    B --> B3[Auth Guard]
    B --> B4[Auth Service]
    
    C --> C1[Dashboard Component]
    C --> C2[Stats Cards]
    C --> C3[Quick Actions]
    
    D --> D1[Project List]
    D --> D2[Project Detail]
    D --> D3[Project Form Dialog]
    D --> D4[Assignment Dialog]
    
    E --> E1[Collaborator List]
    E --> E2[Collaborator Form Dialog]
    E --> E3[Collaborator Detail]
    
    style A fill:#667eea
    style B fill:#764ba2
    style C fill:#f5576c
    style D fill:#4ecdc4
    style E fill:#f093fb
```

### Flux de Données - Architecture Réactive

```mermaid
graph LR
    subgraph "Component Layer"
        A[Component]
    end
    
    subgraph "Service Layer"
        B[Service]
        C[HTTP Client]
    end
    
    subgraph "State Management"
        D[BehaviorSubject]
        E[Observable]
    end
    
    subgraph "Backend"
        F[REST API]
    end
    
    A -->|Call method| B
    B -->|HTTP Request| C
    C -->|REST Call| F
    F -->|Response| C
    C -->|Data| B
    B -->|Update| D
    D -->|Emit| E
    E -->|Subscribe| A
    A -->|Render| A
    
    style B fill:#667eea
    style D fill:#764ba2
    style F fill:#f5576c
```

---

## 📁 Structure du Projet

### Backend (Spring Boot)

```
back/
├── src/main/java/com/digicampmonitoring/
│   ├── application/
│   │   ├── usecases/
│   │   │   ├── project/
│   │   │   │   ├── CreateProjectUseCase.java
│   │   │   │   ├── UpdateProjectUseCase.java
│   │   │   │   ├── DeleteProjectUseCase.java
│   │   │   │   ├── GetProjectsUseCase.java
│   │   │   │   └── GenerateNewsletterUseCase.java
│   │   │   ├── collaborator/
│   │   │   │   ├── CreateCollaboratorUseCase.java
│   │   │   │   ├── UpdateCollaboratorUseCase.java
│   │   │   │   ├── DeleteCollaboratorUseCase.java
│   │   │   │   └── GetCollaboratorsUseCase.java
│   │   │   └── auth/
│   │   │       ├── LoginUseCase.java
│   │   │       └── RegisterUseCase.java
│   │   └── dto/
│   ├── domain/
│   │   ├── model/
│   │   │   ├── Project.java
│   │   │   ├── Collaborator.java
│   │   │   ├── User.java
│   │   │   └── ProjectNeed.java
│   │   ├── repository/
│   │   │   ├── ProjectRepository.java
│   │   │   ├── CollaboratorRepository.java
│   │   │   └── UserRepository.java
│   │   └── service/
│   │       ├── ProjectDomainService.java
│   │       ├── CollaboratorDomainService.java
│   │       └── NewsletterService.java
│   ├── infrastructure/
│   │   ├── config/
│   │   │   ├── SecurityConfiguration.java
│   │   │   ├── JwtConfiguration.java
│   │   │   └── CorsConfiguration.java
│   │   ├── security/
│   │   │   ├── JwtTokenProvider.java
│   │   │   ├── JwtAuthenticationFilter.java
│   │   │   └── CustomUserDetailsService.java
│   │   └── persistence/
│   │       └── JpaRepositories
│   └── presentation/
│       └── controller/
│           ├── AuthController.java
│           ├── ProjectController.java
│           └── CollaboratorController.java
└── resources/
    ├── application.properties
    └── db/migration/
```

### Frontend (Angular 17)

```
front/
├── src/app/
│   ├── core/
│   │   ├── guards/
│   │   │   └── auth.guard.ts
│   │   ├── interceptors/
│   │   │   └── jwt.interceptor.ts
│   │   ├── models/
│   │   │   ├── project.model.ts
│   │   │   ├── collaborator.model.ts
│   │   │   └── user.model.ts
│   │   └── services/
│   │       ├── auth.service.ts
│   │       ├── project.service.ts
│   │       └── collaborator.service.ts
│   ├── features/
│   │   ├── authentication/
│   │   │   ├── login/
│   │   │   │   └── login.component.ts
│   │   │   └── register/
│   │   │       └── register.component.ts
│   │   ├── dashboard/
│   │   │   └── dashboard.component.ts
│   │   ├── projects/
│   │   │   ├── project-list/
│   │   │   │   └── project-list.component.ts
│   │   │   ├── project-detail/
│   │   │   │   └── project-detail.component.ts
│   │   │   └── components/
│   │   │       ├── project-form-dialog/
│   │   │       └── assignment-dialog/
│   │   └── collaborators/
│   │       ├── collaborator-list/
│   │       │   └── collaborator-list.component.ts
│   │       └── components/
│   │           └── collaborator-form-dialog/
│   ├── shared/
│   │   └── components/
│   └── app.routes.ts
```

---

## 🛠️ Technologies

### Backend
- **Java 17** - Langage de programmation
- **Spring Boot 3.2.0** - Framework backend
- **Spring Security** - Sécurité et authentification
- **JWT (JJWT 0.12.3)** - Tokens d'authentification
- **JPA/Hibernate** - ORM
- **SQL Server 2022** - Base de données
- **iText 7** - Génération PDF
- **Lombok** - Réduction du code boilerplate
- **Maven** - Gestion des dépendances

### Frontend
- **Angular 17** - Framework frontend
- **TypeScript 5.2** - Langage
- **PrimeNG** - Bibliothèque UI
  - Table, Dialog, Calendar, Editor
  - FileUpload, Dropdown, Chips
  - Button, Card, Avatar, Tag
- **RxJS** - Programmation réactive
- **SCSS** - Styles

### DevOps
- **Docker & Docker Compose** - Conteneurisation
- **Git & GitHub** - Contrôle de version

---

## 🚀 Installation

### Prérequis
- Docker Desktop
- Git
- Node.js 18+ (pour développement frontend local)
- Java 17+ (pour développement backend local)

### Installation avec Docker

```bash
# 1. Cloner le projet
git clone https://github.com/Soufiane4906/DigicampMonitoring.git
cd DigicampMonitoring

# 2. Démarrer tous les services
docker-compose up -d

# 3. Vérifier les logs
docker-compose logs -f

# 4. Accéder à l'application
# Frontend: http://localhost
# Backend API: http://localhost:8080
# SQL Server: localhost:1433
```

### Installation locale (Développement)

#### Backend
```bash
cd back
./mvnw clean install
./mvnw spring-boot:run
```

#### Frontend
```bash
cd front
npm install
npm start
# Application disponible sur http://localhost:4200
```

---

## 📖 Utilisation

### 1. Première connexion

1. Accédez à `http://localhost`
2. Créez un compte (Register)
3. Connectez-vous avec vos identifiants

### 2. Gestion des Projets

#### Créer un projet
1. Dashboard → Cliquez sur "Projets" ou carte "Gérer les projets"
2. Cliquez sur "Nouveau projet"
3. Remplissez le formulaire :
   - Nom du projet (requis)
   - Logo (optionnel, max 1MB)
   - Description/Objectifs (éditeur riche)
   - Date de début (requise)
   - Date de fin (optionnelle)
   - Statut (requis)
4. Cliquez sur "Créer"

#### Modifier un projet
1. Liste des projets → Cliquez sur l'icône "crayon"
2. Modifiez les champs souhaités
3. Cliquez sur "Mettre à jour"

#### Supprimer un projet
1. Liste des projets → Cliquez sur l'icône "corbeille"
2. Confirmez la suppression

### 3. Gestion des Collaborateurs

#### Ajouter un collaborateur
1. Dashboard → Cliquez sur "Collaborateurs"
2. Cliquez sur "Nouveau collaborateur"
3. Remplissez le formulaire :
   - Photo (optionnelle)
   - Prénom & Nom (requis)
   - Email professionnel (requis)
   - Grade (A4-C3, requis)
   - Poste/Rôle (requis)
   - Site (Casa/Rabat/Indifférent, requis)
   - Disponibilité (toggle)
   - Compétences (liste de skills)
4. Cliquez sur "Créer"

### 4. Affectation Collaborateurs → Projets

1. Accédez à un projet
2. Cliquez sur "Affecter collaborateur"
3. Sélectionnez les collaborateurs disponibles
4. Cliquez sur "Affecter"

### 5. Génération Newsletter PDF

1. Accédez à un projet
2. Cliquez sur "Générer newsletter"
3. Le PDF est généré et téléchargé automatiquement

---

## 🔐 Sécurité

### Authentification JWT

```mermaid
sequenceDiagram
    Client->>API: POST /api/auth/login
    API->>API: Validate credentials
    API->>JWT: Generate token
    JWT-->>API: JWT token
    API-->>Client: {token, user}
    
    Client->>Client: Store token in localStorage
    
    Note over Client,API: Subsequent requests
    
    Client->>API: GET /api/projects<br/>Authorization: Bearer {token}
    API->>JWT: Validate token
    JWT-->>API: Token valid
    API-->>Client: Projects data
```

### Endpoints Protégés

| Endpoint | Méthode | Auth Required | Description |
|----------|---------|---------------|-------------|
| `/api/auth/login` | POST | ❌ | Authentification |
| `/api/auth/register` | POST | ❌ | Inscription |
| `/api/projects/**` | ALL | ✅ | Gestion projets |
| `/api/collaborators/**` | ALL | ✅ | Gestion collaborateurs |
| `/api/users/**` | ALL | ✅ | Gestion utilisateurs |

---

## 📝 API Documentation

### Projets

```http
GET    /api/projects?page=0&size=10
POST   /api/projects
GET    /api/projects/{id}
PUT    /api/projects/{id}
DELETE /api/projects/{id}
POST   /api/projects/{id}/collaborators
POST   /api/projects/{id}/newsletter
```

### Collaborateurs

```http
GET    /api/collaborators?page=0&size=10&available=true
POST   /api/collaborators
GET    /api/collaborators/{id}
PUT    /api/collaborators/{id}
DELETE /api/collaborators/{id}
```

### Authentification

```http
POST   /api/auth/login
POST   /api/auth/register
GET    /api/auth/me
```

---

## 🧪 Tests

### Tests Unitaires Backend
```bash
cd back
./mvnw test
```

### Tests E2E Frontend
```bash
cd front
npm run e2e
```

---

## 📊 Modèle de Données

```mermaid
erDiagram
    USER ||--o{ PROJECT : manages
    PROJECT ||--o{ PROJECT_COLLABORATOR : has
    COLLABORATOR ||--o{ PROJECT_COLLABORATOR : assigned_to
    PROJECT ||--o{ PROJECT_NEED : defines
    
    USER {
        bigint id PK
        varchar username UK
        varchar password
        varchar email UK
        varchar role
        datetime created_at
    }
    
    PROJECT {
        bigint id PK
        varchar name
        text logo
        text description
        date start_date
        date end_date
        varchar status
        bigint user_id FK
        datetime created_at
        datetime updated_at
    }
    
    COLLABORATOR {
        bigint id PK
        varchar first_name
        varchar last_name
        varchar email UK
        text photo
        varchar grade
        varchar position
        varchar site
        boolean available
        text skills
        datetime created_at
    }
    
    PROJECT_COLLABORATOR {
        bigint project_id FK
        bigint collaborator_id FK
        date assigned_date
    }
    
    PROJECT_NEED {
        bigint id PK
        bigint project_id FK
        varchar required_grade
        varchar technology
        varchar preferred_site
        int quantity
    }
```

---

## 🎨 Design System

### Couleurs Principales

| Couleur | Hex | Usage |
|---------|-----|-------|
| Primary Purple | `#667eea` | Buttons, Links, Headers |
| Secondary Purple | `#764ba2` | Gradients, Accents |
| Success | `#4CAF50` | Success states |
| Warning | `#FF9800` | Warning states |
| Danger | `#f5576c` | Errors, Delete actions |
| Info | `#2196F3` | Information |

### Gradients

```scss
// Main gradient
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

// Collaborator gradient
background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);

// Background gradient
background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
```

---

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📄 Licence

Ce projet est privé et destiné uniquement à un usage interne.

---

## 👥 Contact

- **Engineering Manager**: Digicamp
- **Repository**: https://github.com/Soufiane4906/DigicampMonitoring

---

**Dernière mise à jour**: 12 octobre 2025
