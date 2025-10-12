# 🔍 Guide de Diagnostic des Erreurs 403

## Système de diagnostic amélioré

Votre application dispose maintenant d'un système complet de diagnostic pour les erreurs 403 et 401.

## ✅ Modifications appliquées

### Backend

1. **CustomAccessDeniedHandler** - Gestionnaire d'erreurs 403
   - Logs détaillés de chaque erreur 403
   - Informations sur l'authentification, les autorités, les headers
   - Réponse JSON avec debug info

2. **CustomAuthenticationEntryPoint** - Gestionnaire d'erreurs 401
   - Logs pour les problèmes d'authentification
   - Validation du format du token
   - Informations de diagnostic

3. **JwtAuthenticationFilter amélioré**
   - Logs détaillés à chaque étape du processus
   - Indication claire des succès/échecs
   - Messages d'erreur explicites

4. **SecurityConfiguration mise à jour**
   - Intégration des gestionnaires d'exceptions
   - Configuration CORS maintenue

### Frontend

1. **Auth Interceptor amélioré**
   - Logs de toutes les requêtes HTTP
   - Affichage des erreurs 401/403 dans la console
   - Redirection automatique si session expirée
   - Affichage des infos de debug

## 📋 Instructions de diagnostic

### 1. Récupérer les changements

```bash
cd C:\Users\Soufiane\source\repos\DigicampMonitoring
git pull origin main
```

### 2. Reconstruire et redémarrer

```bash
# Arrêter les services
docker-compose down

# Reconstruire avec les nouveaux changements
docker-compose up -d --build
```

### 3. Surveiller les logs Backend

Ouvrez un terminal et exécutez :

```bash
docker-compose logs -f backend
```

Vous verrez maintenant des logs détaillés comme :

```
=== JWT Filter - Processing request: POST /api/projects
JWT Token trouvé, longueur: 245 caractères
Username extrait du token: john.doe@example.com
UserDetails chargé pour 'john.doe@example.com', Authorities: [ROLE_USER]
Token validé avec succès pour 'john.doe@example.com'
✅ Authentification réussie pour 'john.doe@example.com' - Accès à POST /api/projects
```

**Si erreur 403 :**
```
=== 403 ACCESS DENIED ===
URL: POST /api/projects
Authenticated User: john.doe@example.com
Authorities: [ROLE_USER]
Is Authenticated: true
Exception Message: Access is denied
========================
```

**Si erreur 401 :**
```
=== 401 UNAUTHORIZED ===
URL: POST /api/projects
Authorization Header: Present
Token présent, longueur: 245 caractères
Exception: Full authentication is required
========================
```

### 4. Surveiller la console Frontend

Ouvrez la console du navigateur (F12) :

**Requête normale :**
```
🔍 [Auth Interceptor] Requête: POST http://localhost:8080/api/projects
✅ [Auth Interceptor] Token ajouté, longueur: 245
```

**Si erreur 403 :**
```
❌ [Auth Interceptor] Erreur HTTP: 403 Forbidden
📍 [Auth Interceptor] URL: POST http://localhost:8080/api/projects
🚫 [403 Forbidden] Accès refusé
Details: {timestamp: "...", status: 403, error: "Forbidden", ...}
🐛 Debug Info: {authenticated: true, username: "john.doe", authorities: "[ROLE_USER]", hasAuthHeader: true}
  - Authentifié: true
  - Username: john.doe@example.com
  - Authorities: [ROLE_USER]
  - Auth Header: true
```

**Si erreur 401 :**
```
❌ [Auth Interceptor] Erreur HTTP: 401 Unauthorized
🔒 [401 Unauthorized] Non authentifié
Details: {timestamp: "...", status: 401, error: "Unauthorized", ...}
```

## 🔍 Checklist de diagnostic

### Étape 1 : Vérifier l'authentification

1. **Connectez-vous** à l'application
2. **Ouvrez la console** du navigateur (F12)
3. **Vérifiez le localStorage** :
   ```javascript
   // Dans la console
   localStorage.getItem('auth_token')
   ```
   - Vous devez voir un token JWT

### Étape 2 : Tester une requête

1. **Créez un projet** ou un collaborateur
2. **Observez les logs** dans :
   - Console du navigateur
   - Logs Docker du backend

### Étape 3 : Analyser les logs

#### Si vous voyez dans les logs backend :

**✅ SUCCÈS** :
```
✅ Authentification réussie pour 'user@example.com'
```
→ Problème résolu !

**❌ Token invalide** :
```
❌ Token invalide pour 'user@example.com'
```
→ Le token est expiré ou corrompu. Reconnectez-vous.

**❌ Username null** :
```
❌ Impossible d'extraire le username du token
```
→ Le token est mal formé. Reconnectez-vous.

**❌ Utilisateur non trouvé** :
```
❌ Erreur lors du chargement de l'utilisateur 'user@example.com'
```
→ L'utilisateur n'existe pas dans la base de données.

#### Si vous voyez dans la console frontend :

**⚠️ Pas de token** :
```
⚠️ [Auth Interceptor] Aucun token disponible
```
→ Reconnectez-vous.

**🌐 Erreur réseau** :
```
🌐 [Network Error] Impossible de contacter le serveur
```
→ Vérifiez que le backend est démarré :
```bash
docker-compose ps
curl http://localhost:8080/api/health
```

## 🛠️ Solutions courantes

### Problème : Token expiré

**Symptôme** : Erreur 401 après un certain temps

**Solution** :
```bash
# Reconnectez-vous simplement
# Le token a une durée de vie de 24h
```

### Problème : Backend pas démarré

**Symptôme** : Erreur réseau (status 0)

**Solution** :
```bash
docker-compose restart backend
docker-compose logs -f backend
```

### Problème : Token mal formé

**Symptôme** : Token invalide dans les logs

**Solution** :
```javascript
// Dans la console du navigateur
localStorage.removeItem('auth_token');
// Puis reconnectez-vous
```

### Problème : CORS

**Symptôme** : Erreur CORS dans la console

**Solution** : Vérifier que `SecurityConfiguration.java` a bien la configuration CORS

### Problème : Base de données

**Symptôme** : Utilisateur non trouvé

**Solution** :
```bash
# Vérifier que la base de données est créée
docker exec -it digicamp-sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "YourPassword123!" -C \
  -Q "SELECT name FROM sys.databases WHERE name = 'digicampdb'"
```

## 📊 Exemple de session de diagnostic complète

### 1. Connexion

**Frontend Console** :
```
🔍 [Auth Interceptor] Requête: POST http://localhost:8080/api/auth/login
```

**Backend Logs** :
```
User 'john.doe@example.com' authenticated successfully
Generated token for user: john.doe@example.com
```

### 2. Création de projet

**Frontend Console** :
```
🔍 [Auth Interceptor] Requête: POST http://localhost:8080/api/projects
✅ [Auth Interceptor] Token ajouté, longueur: 245
```

**Backend Logs** :
```
=== JWT Filter - Processing request: POST /api/projects
JWT Token trouvé, longueur: 245 caractères
Username extrait du token: john.doe@example.com
Utilisateur 'john.doe@example.com' non encore authentifié, chargement des détails...
UserDetails chargé pour 'john.doe@example.com', Authorities: [ROLE_USER]
Token validé avec succès pour 'john.doe@example.com'
✅ Authentification réussie pour 'john.doe@example.com' - Accès à POST /api/projects
=== JWT Filter - Requête POST /api/projects terminée
```

**Résultat** : ✅ Succès

## 📞 Support

Si malgré tous ces logs vous avez toujours une erreur 403 :

1. **Copiez les logs complets** du backend (partie `=== 403 ACCESS DENIED ===`)
2. **Copiez les logs** de la console frontend (partie erreur 403)
3. **Vérifiez** le contenu du token dans localStorage
4. **Partagez** ces informations pour un diagnostic approfondi

## 🎯 Points de vérification critiques

- [ ] `git pull origin main` effectué
- [ ] `docker-compose up -d --build` effectué
- [ ] Backend démarré (`docker-compose ps` montre `Up`)
- [ ] Connexion réussie
- [ ] Token présent dans localStorage
- [ ] Logs backend affichent "JWT Token trouvé"
- [ ] Logs backend affichent "Token validé avec succès"
- [ ] Logs backend affichent "✅ Authentification réussie"

Si tous ces points sont verts et que vous avez toujours une erreur 403, les logs détaillés nous donneront la réponse exacte.
