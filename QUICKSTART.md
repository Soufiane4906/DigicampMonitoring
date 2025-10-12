# 🚀 Guide de démarrage rapide - DigicampMonitoring

Ce guide vous permettra de démarrer rapidement avec l'application DigicampMonitoring.

## ⚡ Démarrage avec Docker Compose (Recommandé)

### Prérequis
- Docker Desktop installé
- Git installé

### Étapes

1. **Cloner le projet**
```bash
git clone https://github.com/Soufiane4906/DigicampMonitoring.git
cd DigicampMonitoring
```

2. **Démarrer l'application**
```bash
docker-compose up -d
```

3. **Attendre que tous les services soient prêts** (environ 2-3 minutes)
```bash
# Vérifier les logs
docker-compose logs -f
```

4. **Accéder à l'application**
- Frontend : http://localhost
- Backend API : http://localhost:8080/api
- Health Check : http://localhost:8080/api/health

5. **S'inscrire et se connecter**
- Créer un compte sur http://localhost/auth/register
- Se connecter sur http://localhost/auth/login

### Arrêter l'application
```bash
docker-compose down
```

### Supprimer les données (reset complet)
```bash
docker-compose down -v
```

---

## 💻 Démarrage manuel (Développement)

### Backend

1. **Prérequis**
- Java 17+
- Maven 3.6+
- SQL Server (ou Docker : `docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourPassword123!" -p 1433:1433 -d mcr.microsoft.com/mssql/server:2022-latest`)

2. **Configuration**
Créer le fichier `back/src/main/resources/application-local.yml` :
```yaml
spring:
  datasource:
    url: jdbc:sqlserver://localhost:1433;databaseName=digicampdb;encrypt=true;trustServerCertificate=true
    username: sa
    password: YourPassword123!
```

3. **Démarrer**
```bash
cd back
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

### Frontend

1. **Prérequis**
- Node.js 18+
- npm 9+

2. **Installation**
```bash
cd front
npm install
```

3. **Démarrer**
```bash
npm start
```

L'application sera accessible sur http://localhost:4200

---

## 📊 Initialiser la base de données

### Option 1 : Automatique avec Spring Boot
L'application créera automatiquement les tables au démarrage (mode `spring.jpa.hibernate.ddl-auto=update`)

### Option 2 : Manuel avec SQL
```bash
# Se connecter à SQL Server
sqlcmd -S localhost -U sa -P "YourPassword123!"

# Exécuter le script d'initialisation
:r back/src/main/resources/db/init.sql
GO
```

---

## 🧪 Tester l'API

### Health Check
```bash
curl http://localhost:8080/api/health
```

### Inscription
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Connexion
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

### Liste des projets (avec token)
```bash
TOKEN="votre_token_jwt"
curl http://localhost:8080/api/projects \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔧 Troubleshooting

### Le backend ne démarre pas
**Problème** : `Connection refused` ou `Cannot connect to database`

**Solution** :
1. Vérifier que SQL Server est démarré
2. Vérifier les credentials dans `application.yml`
3. Vérifier que le port 1433 n'est pas utilisé : `netstat -an | grep 1433`

### Le frontend ne charge pas
**Problème** : `Cannot connect to backend`

**Solution** :
1. Vérifier que le backend est démarré sur le port 8080
2. Vérifier l'URL dans `front/src/environments/environment.ts`
3. Vérifier les CORS dans `back/.../SecurityConfiguration.java`

### Docker Compose échoue
**Problème** : `Error response from daemon`

**Solution** :
1. Vérifier que Docker Desktop est démarré
2. Vérifier les ports disponibles (80, 8080, 1433)
3. Nettoyer : `docker-compose down -v && docker system prune -a`

### Erreur 401 Unauthorized
**Problème** : Token JWT expiré ou invalide

**Solution** :
1. Se reconnecter pour obtenir un nouveau token
2. Vérifier que le token est bien dans le header `Authorization: Bearer <token>`
3. Vérifier la date d'expiration du token (24h par défaut)

---

## 📚 Ressources supplémentaires

- [README principal](README.md)
- [Backend README](back/README.md)
- [Frontend README](front/README.md)
- [Documentation API](http://localhost:8080/swagger-ui.html) *(à implémenter)*

---

## 🎯 Prochaines étapes

Après avoir démarré l'application :

1. ✅ Créer un compte utilisateur
2. ✅ Se connecter au dashboard
3. ✅ Créer des statuts de projets
4. ✅ Créer des projets
5. ✅ Ajouter des collaborateurs
6. 🔄 Affecter des collaborateurs aux projets *(à venir)*
7. 🔄 Générer une newsletter PDF *(à venir)*

---

**Besoin d'aide ?** Ouvrez une issue sur [GitHub](https://github.com/Soufiane4906/DigicampMonitoring/issues)
