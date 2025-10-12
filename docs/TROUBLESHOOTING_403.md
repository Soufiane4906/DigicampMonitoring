# 🔒 Guide de Dépannage - Erreur 403 Forbidden

## 🚨 Symptômes

Vous obtenez ces erreurs dans la console du navigateur :
```
POST http://localhost:8080/api/projects 403 (Forbidden)
POST http://localhost:8080/api/collaborators 403 (Forbidden)
```

## 🔍 Causes Possibles

### 1. Token JWT Manquant ou Invalide ⭐ (CAUSE LA PLUS FRÉQUENTE)

Le token JWT n'est pas envoyé dans la requête ou est expiré/invalide.

#### ✅ Vérification Rapide

**Ouvrez les DevTools du navigateur (F12) → Onglet Network :**

1. **Tentez une action** qui déclenche l'erreur (créer un projet)
2. **Cliquez sur la requête** POST qui a échoué
3. **Onglet Headers → Request Headers**
4. **Cherchez** `Authorization: Bearer <token>`

**Si le header Authorization est ABSENT ou VIDE** :
- ✅ C'est le problème ! Le token n'est pas envoyé.

**Si le header Authorization existe** :
- Copiez le token (sans "Bearer ")
- Allez sur https://jwt.io
- Collez le token pour le décoder
- Vérifiez la date d'expiration (`exp`)

### 2. Token Expiré

Les tokens JWT ont une durée de vie limitée (24h par défaut).

#### ✅ Solution
```typescript
// Déconnectez-vous et reconnectez-vous
localStorage.clear();
// Puis reconnectez-vous via l'interface
```

### 3. Token Non Envoyé par le Frontend

L'intercepteur HTTP n'ajoute pas le token aux requêtes.

#### ✅ Vérification

Vérifiez que le fichier `auth.interceptor.ts` existe et est bien configuré :

```typescript
// front/src/app/core/interceptors/auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(req);
};
```

**Vérifiez aussi `app.config.ts` :**

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    provideHttpClient(
      withInterceptors([authInterceptor]) // ⭐ IMPORTANT
    )
  ]
};
```

### 4. CORS Bloque les Headers

Les headers `Authorization` sont bloqués par CORS.

#### ✅ Solution

Vérifiez `SecurityConfiguration.java` :

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    
    // ✅ Doit inclure Authorization
    configuration.setAllowedHeaders(Arrays.asList("*"));
    
    // ✅ Doit exposer Authorization
    configuration.setExposedHeaders(Arrays.asList(
        "Authorization", 
        "Content-Type"
    ));
    
    // ✅ Doit permettre les credentials
    configuration.setAllowCredentials(true);
    
    return source;
}
```

### 5. Service Backend Redémarré

Si vous avez redémarré le backend, les tokens générés avant le redémarrage sont invalides (la clé secrète JWT peut changer).

#### ✅ Solution
```bash
# Déconnexion et reconnexion
localStorage.clear();
# Puis reconnectez-vous
```

## 🛠️ Diagnostics Avancés

### Vérifier les Logs Backend

```bash
# Voir les logs du backend
docker-compose logs -f backend

# Chercher les erreurs JWT
docker-compose logs backend | grep -i "jwt\|token\|authentication"
```

**Erreurs fréquentes dans les logs :**

```
JWT signature does not match locally computed signature
→ Token invalide ou clé secrète changée
→ Solution : Reconnexion

JWT expired at 2025-10-11T...
→ Token expiré
→ Solution : Reconnexion

Could not set user authentication in security context
→ Problème de validation du token
→ Solution : Vérifier JwtTokenProvider
```

### Tester l'API Manuellement avec cURL

```bash
# 1. Se connecter et récupérer le token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Réponse (copiez le token) :
# {"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}

# 2. Utiliser le token pour créer un projet
curl -X POST http://localhost:8080/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI" \
  -d '{
    "name": "Test Project",
    "description": "Test",
    "objectives": "Test objectives",
    "startDate": "2025-10-12",
    "statusId": 1
  }'
```

**Si ça fonctionne avec cURL mais pas depuis le frontend** :
→ Le problème est dans le frontend (intercepteur)

**Si ça ne fonctionne pas non plus avec cURL** :
→ Le problème est dans le backend (configuration de sécurité)

### Vérifier le Token dans localStorage

**Console du navigateur (F12 → Console) :**

```javascript
// Vérifier le token
localStorage.getItem('token')
// Devrait afficher un token JWT

// Si null ou undefined → Pas connecté
// Si "undefined" (string) → Bug dans le code de stockage
// Si token présent → Vérifier sa validité sur jwt.io
```

### Activer les Logs de Debug Spring Security

Dans `application.yml` :

```yaml
logging:
  level:
    org.springframework.security: DEBUG
    com.digicamp.monitoring.infrastructure.security: DEBUG
```

Puis redémarrez le backend :
```bash
docker-compose restart backend
```

## ✅ Solutions Rapides

### Solution 1 : Vider le Cache et Reconnexion (90% des cas)

```bash
# Dans la console du navigateur (F12)
localStorage.clear()
sessionStorage.clear()
# Puis rechargez la page (Ctrl+F5)
# Reconnectez-vous avec admin/admin123
```

### Solution 2 : Reconstruire les Conteneurs

```bash
# Windows
rebuild.bat

# Linux/Mac
./rebuild.sh
```

### Solution 3 : Vérifier que vous êtes bien connecté

```typescript
// Console navigateur
localStorage.getItem('token')
// Devrait retourner un token JWT valide, pas null
```

### Solution 4 : Vérifier l'Intercepteur HTTP

Fichier `front/src/app/app.config.ts` :

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([authInterceptor]) // ⭐ Vérifiez cette ligne
    ),
    ConfirmationService,
    MessageService
  ]
};
```

## 🔧 Fixes Permanents

### Fix 1 : Augmenter la Durée de Vie des Tokens

Dans `application.yml` :

```yaml
jwt:
  secret: ${JWT_SECRET:YourSuperSecretKeyThatIsAtLeast256BitsLongForHS256Algorithm}
  expiration: 86400000 # 24 heures (en millisecondes)
  # Pour tester : 3600000 = 1 heure
```

### Fix 2 : Ajouter un Mécanisme de Refresh Token

**Actuellement non implémenté** - À ajouter dans une prochaine version.

### Fix 3 : Améliorer la Gestion des Erreurs Frontend

Dans `auth.service.ts`, ajoutez :

```typescript
handleError(error: any) {
  if (error.status === 403) {
    console.error('🔒 Access Forbidden - Token might be expired');
    this.logout();
    this.router.navigate(['/login']);
  }
  return throwError(() => error);
}
```

## 📋 Checklist de Diagnostic

- [ ] Token présent dans localStorage ? (`localStorage.getItem('token')`)
- [ ] Token envoyé dans les headers ? (DevTools → Network → Headers)
- [ ] Token valide et non expiré ? (https://jwt.io)
- [ ] Intercepteur HTTP configuré ? (`app.config.ts`)
- [ ] CORS autorise Authorization ? (`SecurityConfiguration.java`)
- [ ] Backend démarré et accessible ? (http://localhost:8080/api/health)
- [ ] Logs backend sans erreur ? (`docker-compose logs backend`)

## 🎯 Scénario de Test Complet

### Test 1 : Authentification de Base

1. **Ouvrir** http://localhost
2. **Se connecter** avec `admin` / `admin123`
3. **Ouvrir DevTools** (F12) → Onglet Application → Local Storage
4. **Vérifier** que la clé `token` existe et contient un JWT
5. **Aller à** Projets → Nouveau Projet
6. **Ouvrir** DevTools → Onglet Network
7. **Créer** un projet
8. **Vérifier** dans Network que la requête POST contient :
   - Header `Authorization: Bearer eyJ...`
   - Status code : 201 Created (et non 403)

### Test 2 : Vérification du Token

1. **Console navigateur** (F12 → Console)
2. **Exécuter** :
   ```javascript
   const token = localStorage.getItem('token');
   console.log('Token:', token);
   console.log('Token length:', token?.length);
   ```
3. **Copier le token** (sans guillemets)
4. **Aller sur** https://jwt.io
5. **Coller** le token dans "Encoded"
6. **Vérifier** :
   - `sub` (username) : doit être "admin"
   - `exp` (expiration) : doit être dans le futur
   - `iat` (issued at) : doit être récent

### Test 3 : Test API Direct

```bash
# Terminal 1 : Se connecter
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | jq -r '.token'

# Copier le token affiché

# Terminal 2 : Tester avec le token
curl -X GET http://localhost:8080/api/projects \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -H "Content-Type: application/json"

# Devrait retourner la liste des projets (pas 403)
```

## 📞 Besoin d'Aide ?

Si le problème persiste après avoir suivi ce guide :

1. **Vérifiez les logs** : `docker-compose logs -f backend`
2. **Cherchez** les erreurs JWT/Authentication
3. **Partagez** :
   - Message d'erreur exact dans les logs
   - Contenu du header Authorization (sans le token complet)
   - Version de l'application

---

**Note** : Dans 90% des cas, le problème est résolu en vidant le cache et en se reconnectant !

```bash
# Console navigateur
localStorage.clear()
# Puis reconnexion avec admin/admin123
```
