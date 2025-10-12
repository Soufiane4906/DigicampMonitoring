# Guide de Déploiement - DigicampMonitoring

## 🚀 Déploiement Rapide

### Prérequis
- Docker Desktop installé et démarré
- Git installé
- Ports disponibles : 80 (frontend), 8080 (backend), 1433 (SQL Server)

## 📦 Instructions de Déploiement

### Option 1 : Script Automatique (Recommandé)

#### Windows
```bash
# Double-cliquez sur le fichier ou exécutez dans PowerShell/CMD
rebuild.bat
```

#### Linux/Mac
```bash
# Rendez le script exécutable
chmod +x rebuild.sh

# Exécutez le script
./rebuild.sh
```

### Option 2 : Commandes Manuelles

```bash
# 1. Récupérer les dernières modifications
git pull origin main

# 2. Arrêter et supprimer les conteneurs existants (avec volumes)
docker-compose down -v

# 3. Reconstruire et démarrer les conteneurs
docker-compose up -d --build

# 4. Vérifier les logs (optionnel)
docker-compose logs -f backend
```

## 🔍 Vérification du Déploiement

### 1. Vérifier que les conteneurs sont démarrés
```bash
docker-compose ps
```

Vous devriez voir 3 conteneurs en état "Up" :
- `backend` (Port 8080)
- `frontend` (Port 80)
- `sqlserver` (Port 1433)

### 2. Vérifier le seeding de la base de données

Regardez les logs du backend pour voir le seeding :
```bash
docker-compose logs backend | grep "🌱"
```

Vous devriez voir :
```
🌱 Starting database seeding...
📝 Seeding roles...
✅ Roles seeded successfully
👤 Seeding users...
✅ Users seeded successfully
📊 Seeding project statuses...
✅ Project statuses seeded successfully
👥 Seeding collaborators...
✅ Collaborators seeded successfully (6 collaborators)
📁 Seeding projects...
✅ Projects seeded successfully (4 projects)
🎉 Database seeding completed successfully!
```

### 3. Vérifier la persistance des données

```bash
# Vérifier que les volumes Docker existent
docker volume ls | grep digicampmonitoring
```

Vous devriez voir :
- `digicampmonitoring_sqlserver-data` (Données SQL Server)
- `digicampmonitoring_uploads-data` (Fichiers uploadés)

### 4. Tester l'accès à l'application

1. **Frontend** : http://localhost
2. **Backend API** : http://localhost:8080/api
3. **Swagger UI** : http://localhost:8080/swagger-ui.html
4. **Health Check** : http://localhost:8080/api/health

## 🔑 Identifiants de Test

Après le seeding, vous pouvez vous connecter avec :

| Utilisateur | Mot de passe | Rôle |
|-------------|--------------|------|
| admin | admin123 | Engineering Manager (EM) |
| soufiane | soufiane123 | User |
| mohammed | mohammed123 | User |

## 📊 Données de Test Seeded

### Rôles (2)
- EM (Engineering Manager)
- USER (Regular User)

### Utilisateurs (3)
- admin (EM)
- soufiane (USER)
- mohammed (USER)

### Statuts de Projet (5)
| Statut | Couleur | Description |
|--------|---------|-------------|
| EN_COURS | #2196F3 (Bleu) | Projet en cours |
| TERMINE | #4CAF50 (Vert) | Projet terminé |
| EN_PAUSE | #FF9800 (Orange) | Projet en pause |
| ANNULE | #F44336 (Rouge) | Projet annulé |
| PLANIFIE | #9C27B0 (Violet) | Projet planifié |

### Collaborateurs (6)
1. **Soufiane EL AMRANI** - B2, Développeur Full Stack, Casa, Disponible
2. **Mohammed BENALI** - B3, Tech Lead, Rabat, Disponible
3. **Fatima ZAHRA** - B1, Product Owner, Casa, Disponible
4. **Youssef IDRISSI** - C1, Scrum Master, Rabat, Disponible
5. **Amina TAHIRI** - B2, QA Engineer, Indifférent, Non disponible
6. **Karim ALAOUI** - A5, Développeur Frontend, Casa, Disponible

### Projets (4)
1. **DigicampMonitoring** - EN_COURS (15/01/2025 - 30/06/2025)
2. **API Gateway Microservices** - EN_COURS (01/10/2024 - 31/03/2025)
3. **Mobile Banking App** - TERMINE (01/06/2024 - 31/12/2024)
4. **Cloud Migration** - PLANIFIE (01/04/2025 - 31/12/2025)

## 🧪 Tests à Effectuer

### 1. Test de Persistance des Données
```bash
# 1. Créer un nouveau projet via l'interface
# 2. Redémarrer le backend
docker-compose restart backend

# 3. Vérifier que le projet existe toujours
# Connectez-vous et vérifiez la liste des projets
```

### 2. Test CORS et Upload d'Images
1. Connectez-vous à http://localhost
2. Allez dans "Projets" → "Nouveau projet"
3. Faites glisser une image dans la zone de drag & drop
4. Soumettez le formulaire
5. Vérifiez que l'image s'affiche dans la liste des projets
6. Ouvrez DevTools → Network pour vérifier qu'il n'y a pas d'erreurs CORS

### 3. Test des Endpoints API
```bash
# Health check
curl http://localhost:8080/api/health

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Liste des projets (avec token JWT)
curl http://localhost:8080/api/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🐛 Dépannage

### Les conteneurs ne démarrent pas
```bash
# Vérifier les logs
docker-compose logs

# Vérifier que les ports ne sont pas utilisés
netstat -ano | findstr :80
netstat -ano | findstr :8080
netstat -ano | findstr :1433
```

### Erreurs CORS
- Vérifiez que le frontend utilise `http://localhost` et non `127.0.0.1`
- Les patterns CORS incluent maintenant `http://*:4200` et `http://*:80`

### Les données ne persistent pas
```bash
# Vérifier que les volumes existent
docker volume ls | grep digicampmonitoring

# Si les volumes n'existent pas, reconstruire avec :
docker-compose down -v
docker-compose up -d --build
```

### Le seeding ne s'exécute pas
```bash
# Vérifier les logs du backend
docker-compose logs backend | grep "seeding"

# Si nécessaire, vider la base et relancer
docker-compose down -v
docker-compose up -d --build
```

## 📚 Documentation Complémentaire

- [Guide d'Upload d'Images](./IMAGE_UPLOAD_GUIDE.md)
- [Statut des Endpoints API](./API_ENDPOINTS_STATUS.md)
- [README Principal](../README.md)

## ✅ Checklist de Déploiement

- [ ] Docker Desktop est démarré
- [ ] Code récupéré avec `git pull origin main`
- [ ] Conteneurs arrêtés avec `docker-compose down -v`
- [ ] Conteneurs reconstruits avec `docker-compose up -d --build`
- [ ] Vérification des logs de seeding (🌱 🎉)
- [ ] Test de connexion avec admin/admin123
- [ ] Vérification des données de test (projets, collaborateurs)
- [ ] Test d'upload d'image
- [ ] Vérification de la persistance des données après redémarrage

## 🎯 Prochaines Étapes

Après un déploiement réussi :

1. **Phase 1** : Implémenter ProjectStatusController (2 endpoints)
2. **Phase 2** : Implémenter ProjectAssignmentController (5 endpoints)
3. **Phase 3** : Implémenter ProjectNeedController (5 endpoints)
4. **Phase 4** : Implémenter DashboardController (3 endpoints)

Voir [API_ENDPOINTS_STATUS.md](./API_ENDPOINTS_STATUS.md) pour plus de détails.

---

**Note** : Les modifications récentes incluent :
- ✅ Volumes Docker persistants pour SQL Server et uploads
- ✅ Configuration CORS améliorée avec wildcard patterns
- ✅ Seeding automatique de données de test
- ✅ Health check pour le backend
- ✅ 17/32 endpoints implémentés (53%)
