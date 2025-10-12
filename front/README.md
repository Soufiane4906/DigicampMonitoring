# DigicampMonitoring Frontend

## Description
Frontend de l'application DigicampMonitoring - Interface utilisateur pour la gestion de projets et de ressources.

## Technologies
- Angular 17
- PrimeNG (UI Components)
- RxJS
- TypeScript 5.2

## Architecture
Architecture modulaire avec :
- **Core** : Services, guards, interceptors, models
- **Shared** : Composants réutilisables
- **Features** : Modules fonctionnels (Authentication, Dashboard, Projects, Collaborators)
- **Standalone Components** : Utilisation des composants standalone Angular 17

## Prérequis
- Node.js 18+
- npm 9+

## Installation

1. **Cloner le repository**
```bash
git clone https://github.com/Soufiane4906/DigicampMonitoring.git
cd DigicampMonitoring/front
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration**

Modifier `src/environments/environment.ts` pour l'URL du backend :
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

4. **Lancement en développement**
```bash
npm start
```

L'application sera accessible sur `http://localhost:4200`

## Build

### Development
```bash
npm run build
```

### Production
```bash
npm run build -- --configuration production
```

Les fichiers compilés seront dans `dist/digicamp-monitoring/`

## Docker

### Build l'image
```bash
docker build -t digicamp-monitoring-frontend .
```

### Run le conteneur
```bash
docker run -p 80:80 digicamp-monitoring-frontend
```

## Structure du Projet

```
src/
├── app/
│   ├── core/                 # Services, guards, interceptors
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── models/
│   │   └── services/
│   ├── features/             # Modules fonctionnels
│   │   ├── authentication/
│   │   ├── dashboard/
│   │   ├── projects/
│   │   └── collaborators/
│   ├── shared/              # Composants partagés
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── environments/
├── assets/
└── styles.scss
```

## Fonctionnalités

### Authentification
- ✅ Inscription utilisateur
- ✅ Connexion avec JWT
- ✅ Guard pour routes protégées
- ✅ Interceptor pour injection du token

### Dashboard
- ✅ Vue d'ensemble
- ✅ Navigation principale
- ✅ Gestion de session

### Projets
- ✅ Liste des projets avec pagination
- ✅ Affichage des statuts
- 🔄 Création de projet (TODO)
- 🔄 Modification de projet (TODO)
- 🔄 Suppression de projet (TODO)

### Collaborateurs
- ✅ Liste des collaborateurs avec pagination
- ✅ Affichage de la disponibilité
- 🔄 Création de collaborateur (TODO)
- 🔄 Modification de collaborateur (TODO)
- 🔄 Suppression de collaborateur (TODO)

## Tests

```bash
npm test
```

## Lint

```bash
npm run lint
```

## Déploiement Azure

### Via Azure Static Web Apps
```bash
az staticwebapp create \
  --name digicamp-monitoring-frontend \
  --resource-group digicamp-rg \
  --location westeurope \
  --source https://github.com/Soufiane4906/DigicampMonitoring \
  --branch main \
  --app-location "/front" \
  --output-location "dist/digicamp-monitoring"
```

## License
MIT