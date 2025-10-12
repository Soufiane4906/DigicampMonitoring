# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/).

## [Non publié]

## [1.0.1] - 2025-10-12

### 🐛 Corrections de bugs

#### Résolution des erreurs 403 Forbidden sur les endpoints authentifiés
**Problème** : Les requêtes POST vers `/api/projects` et `/api/collaborators` retournaient systématiquement des erreurs 403, même avec un token JWT valide.

**Cause** : 
- Double chargement de l'utilisateur dans `JwtAuthenticationFilter`
- Ordre de traitement incorrect (validation avant extraction)
- Absence de vérification du contexte de sécurité
- Gestion d'erreurs insuffisante

**Solution** :
- ✅ Réorganisation du flux : extraction → vérification → chargement → validation
- ✅ Chargement unique de `UserDetails`
- ✅ Vérification du `SecurityContext` pour éviter réauthentification
- ✅ Amélioration de la gestion des exceptions
- ✅ Ajout d'annotations `@NonNull`

**Fichiers modifiés** :
- `back/src/main/java/com/digicamp/monitoring/infrastructure/security/JwtAuthenticationFilter.java`

**Commit** : [05148f1](https://github.com/Soufiane4906/DigicampMonitoring/commit/05148f151ff2c8d9959d512fffc126800937269a)

**Documentation** : 
- [Guide de résolution 403](./FIX_403_ERRORS.md)

### 📚 Documentation

- Ajout du guide de résolution des erreurs 403 (`docs/FIX_403_ERRORS.md`)
- Ajout du CHANGELOG (`docs/CHANGELOG.md`)

## [1.0.0] - 2025-10-11

### ✨ Fonctionnalités initiales

#### Authentification
- Système d'authentification JWT complet
- Login et registration
- Guards pour la protection des routes
- Intercepteur pour l'ajout automatique du token

#### Gestion des Projets
- CRUD complet pour les projets
- Upload de logos avec drag & drop
- Éditeur riche Quill pour les descriptions
- Statuts paramétrables
- Filtres et recherche
- Affectation de collaborateurs
- Génération de newsletters PDF

#### Gestion des Collaborateurs
- CRUD complet pour les collaborateurs
- Upload de photos professionnelles
- Gestion des compétences (chips)
- Grades (A4-C3)
- Postes et sites
- Indicateur de disponibilité
- Filtres multi-critères

#### Système d'Upload
- Composant `ImageUploadComponent` standalone
- Support drag & drop avec animations
- Validation en temps réel (type, taille)
- Prévisualisation immédiate
- Support multipart et Base64
- Backend `FileStorageService` avec validation MIME

#### Infrastructure
- Docker Compose pour le déploiement
- SQL Server 2022
- Angular 17 avec standalone components
- Spring Boot 3.2
- Architecture hexagonale (DDD)

#### Documentation
- Guide de démarrage rapide
- Guide utilisateur complet
- Documentation technique avec diagrammes
- Guide de style SCSS
- Guide Docker
- Guide upload d'images
- État des endpoints API

### 🛠️ Technologies

**Backend**
- Java 17
- Spring Boot 3.2.0
- Spring Security + JWT
- JPA/Hibernate
- SQL Server 2022
- iText 7 pour PDF
- Maven

**Frontend**
- Angular 17
- TypeScript 5.2
- PrimeNG
- Quill Editor
- RxJS
- SCSS

**DevOps**
- Docker & Docker Compose
- Git & GitHub

---

## Format

Les types de changements :
- **✨ Fonctionnalités** : Nouvelles fonctionnalités
- **🐛 Corrections** : Corrections de bugs
- **📚 Documentation** : Changements dans la documentation
- **🎨 Style** : Changements qui n'affectent pas le code (formatage, etc.)
- **♻️ Refactoring** : Refactorisation du code
- **⚡ Performance** : Améliorations de performance
- **✅ Tests** : Ajout ou correction de tests
- **🔧 Configuration** : Changements de configuration
- **🔒 Sécurité** : Corrections de sécurité
