# ⚡ Guide de Démarrage Rapide - DigicampMonitoring

Ce guide vous permet de démarrer rapidement avec DigicampMonitoring en moins de 5 minutes.

## 🚀 Démarrage Ultra-Rapide (Docker)

### Option 1 : Lancement en 3 commandes

```bash
git clone https://github.com/Soufiane4906/DigicampMonitoring.git
cd DigicampMonitoring
docker-compose up -d
```

**C'est tout !** 🎉

Accédez à l'application : **http://localhost**

---

## 📋 Première Utilisation (5 minutes)

### 1️⃣ Créer votre compte (30 secondes)

1. Ouvrez http://localhost
2. Cliquez sur **"S'inscrire"**
3. Remplissez :
   - Nom d'utilisateur
   - Email
   - Mot de passe (min 8 caractères)
4. **S'inscrire**

✅ Vous êtes connecté automatiquement !

### 2️⃣ Créer votre premier projet (1 minute)

1. Dashboard → **"Gérer les projets"**
2. **"Nouveau projet"**
3. Remplissez :
   - **Nom** : "Projet Test"
   - **Description** : "Mon premier projet sur Digicamp"
   - **Date de début** : Aujourd'hui
   - **Statut** : "En cours"
4. **"Créer"**

✅ Votre premier projet est créé !

### 3️⃣ Ajouter votre premier collaborateur (1 minute)

1. Dashboard → **"Gérer les collaborateurs"**
2. **"Nouveau collaborateur"**
3. Remplissez :
   - **Prénom** : "Jean"
   - **Nom** : "Dupont"
   - **Email** : "jean.dupont@company.com"
   - **Grade** : "B2"
   - **Poste** : "Développeur"
   - **Site** : "Casa"
   - **Compétences** : "Java", "Angular", "Docker"
4. **"Créer"**

✅ Votre premier collaborateur est ajouté !

---

## 🎯 Raccourcis Utiles

### URLs Importantes

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost | Application web |
| **Backend API** | http://localhost:8080/api | API REST |
| **Health Check** | http://localhost:8080/actuator/health | Status backend |

### Commandes Docker

```bash
# Démarrer l'application
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter l'application
docker-compose down

# Rebuild complet
docker-compose down -v
docker-compose up -d --build

# Vérifier le status
docker-compose ps
```

---

## 📚 Ressources Utiles

### Documentation

- 📖 **[Guide Utilisateur Complet](./docs/USER_GUIDE.md)** - Toutes les fonctionnalités détaillées
- 📘 **[Documentation Technique](./docs/TECHNICAL_DOCUMENTATION.md)** - Architecture et diagrammes
- 🎨 **[Guide de Style](./docs/STYLE_GUIDE.md)** - Design system SCSS

### Support

- 💬 **GitHub Issues** : [Signaler un bug](https://github.com/Soufiane4906/DigicampMonitoring/issues)
- 📧 **Email** : support@digicamp.com
- 📚 **FAQ** : Voir [USER_GUIDE.md](./docs/USER_GUIDE.md#-faq)

---

## 🆘 Dépannage Rapide

### ❌ "docker-compose command not found"

**Solution** : Installez Docker Desktop
- Windows/Mac : https://www.docker.com/products/docker-desktop
- Linux : `sudo apt-get install docker-compose`

### ❌ "Port 80 already in use"

**Solution** : Changez le port frontend dans docker-compose.yml

```yaml
ports:
  - "8081:80"  # Au lieu de "80:80"
```

### ❌ "Cannot connect to database"

**Solution** : Recréez la base
```bash
docker-compose down -v
docker-compose up -d
```

---

## ✅ Checklist de Démarrage

- [ ] Docker installé et démarré
- [ ] Application clonée depuis GitHub
- [ ] `docker-compose up -d` exécuté avec succès
- [ ] Frontend accessible sur http://localhost
- [ ] Compte utilisateur créé
- [ ] Premier projet créé
- [ ] Premier collaborateur ajouté

**Félicitations ! Vous êtes prêt à utiliser DigicampMonitoring ! 🎉**

---

<div align="center">
  <strong>Besoin d'aide ?</strong>
  <br>
  Consultez le <a href="./docs/USER_GUIDE.md">Guide Utilisateur</a> ou <a href="https://github.com/Soufiane4906/DigicampMonitoring/issues">ouvrez une issue</a>
  <br><br>
  <sub>Version 1.0.0 - 12 octobre 2025</sub>
</div>
