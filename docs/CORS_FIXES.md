# 🔒 Résolution des Erreurs CORS (403 Forbidden)

**Date** : 12 octobre 2025  
**Problème** : Erreur 403 Forbidden sur les appels API  
**Cause** : Configuration CORS (Cross-Origin Resource Sharing)

---

## ❌ Symptômes

```
Failed to load resource: the server responded with a status of 403 ()
POST http://localhost:8080/api/auth/login 403 (Forbidden)
POST http://localhost:8080/api/projects 403 (Forbidden)
POST http://localhost:8080/api/collaborators 403 (Forbidden)
```

### Dans la Console du Navigateur :
```
Access to XMLHttpRequest at 'http://localhost:8080/api/...' from origin 'http://localhost:4200' 
has been blocked by CORS policy: Response to preflight request doesn't pass access control check.
```

---

## 🔍 Diagnostic

### Cause Racine
Le frontend Angular (port 4200) ne peut pas communiquer avec le backend Spring Boot (port 8080) car :
1. ❌ Les requêtes OPTIONS (preflight) ne sont pas gérées
2. ❌ Les headers CORS ne sont pas correctement configurés
3. ❌ Le backend rejette les requêtes cross-origin

---

## ✅ Solutions Appliquées

### 1. Configuration CORS Améliorée dans SecurityConfiguration

**Fichier** : `back/src/main/java/com/digicamp/monitoring/infrastructure/security/SecurityConfiguration.java`

**Changements** :
```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    
    // ✅ Utilisation de patterns wildcards pour tous les ports
    configuration.setAllowedOriginPatterns(Arrays.asList(
        "http://localhost",
        "http://localhost:*",
        "http://127.0.0.1:*",
        "http://frontend:*"  // Pour Docker
    ));
    
    // ✅ Tous les méthodes HTTP autorisées
    configuration.setAllowedMethods(Arrays.asList(
        "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"
    ));
    
    // ✅ Tous les headers autorisés
    configuration.setAllowedHeaders(Arrays.asList("*"));
    
    // ✅ Headers exposés
    configuration.setExposedHeaders(Arrays.asList(
        "Authorization", 
        "Content-Type", 
        "X-Total-Count",
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Credentials"
    ));
    
    // ✅ Credentials autorisés
    configuration.setAllowCredentials(true);
    
    // ✅ Cache preflight
    configuration.setMaxAge(3600L);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

**Endpoints publics ajoutés** :
```java
.requestMatchers("/api/auth/**").permitAll()
.requestMatchers("/api/health").permitAll()
.requestMatchers("/actuator/**").permitAll()  // ✅ Ajouté
.requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()  // ✅ Ajouté
```

---

### 2. Filtre CORS Global

**Fichier** : `back/src/main/java/com/digicamp/monitoring/infrastructure/config/CorsFilter.java`

**Nouveau filtre créé** :
```java
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CorsFilter implements Filter {
    
    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletResponse response = (HttpServletResponse) res;
        HttpServletRequest request = (HttpServletRequest) req;

        // ✅ Set CORS headers dynamiquement
        response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Methods", 
            "GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD");
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Headers", 
            "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Total-Count");
        response.setHeader("Access-Control-Expose-Headers", 
            "Authorization, Content-Type, X-Total-Count");

        // ✅ Handle OPTIONS request (preflight)
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        chain.doFilter(req, res);
    }
}
```

**Rôle** :
- Intercepte **toutes** les requêtes avant Spring Security
- Gère les requêtes **OPTIONS** (preflight)
- Définit les headers CORS **dynamiquement** basés sur l'origine

---

## 🚀 Déploiement

### Étape 1 : Récupérer les Modifications

```bash
# Pull les dernières modifications
git pull origin main
```

### Étape 2 : Rebuild Docker

```bash
# Arrêter et nettoyer
docker-compose down -v

# Reconstruire le backend
docker-compose up -d --build backend

# Vérifier les logs
docker-compose logs -f backend
```

### Étape 3 : Redémarrer le Frontend

```bash
# Redémarrer le frontend
docker-compose restart frontend

# Ou rebuild complet si nécessaire
docker-compose up -d --build
```

---

## 🧪 Test de Vérification

### 1. Test avec cURL

```bash
# Test OPTIONS (preflight)
curl -X OPTIONS http://localhost:8080/api/auth/login \
  -H "Origin: http://localhost:4200" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization" \
  -v

# Résultat attendu :
# HTTP/1.1 200 OK
# Access-Control-Allow-Origin: http://localhost:4200
# Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD
# Access-Control-Allow-Credentials: true
```

### 2. Test POST Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:4200" \
  -d '{"username":"admin","password":"admin123"}' \
  -v

# Résultat attendu :
# HTTP/1.1 200 OK (ou 401 si credentials invalides)
# Access-Control-Allow-Origin: http://localhost:4200
```

### 3. Test dans le Navigateur

1. Ouvrez `http://localhost:4200`
2. Ouvrez **DevTools** (F12)
3. Allez dans **Network**
4. Essayez de vous connecter
5. Vérifiez les headers de réponse :

```
Access-Control-Allow-Origin: http://localhost:4200
Access-Control-Allow-Credentials: true
```

---

## 🐛 Dépannage Supplémentaire

### Problème : Toujours erreur 403

#### Solution 1 : Vérifier les logs backend
```bash
docker-compose logs backend | grep -i cors
docker-compose logs backend | grep -i 403
```

#### Solution 2 : Désactiver temporairement Spring Security

Pour tester si le problème vient de CORS ou de l'authentification :

```java
// Dans SecurityConfiguration.java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(AbstractHttpConfigurer::disable)
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .authorizeHttpRequests(auth -> auth
            .anyRequest().permitAll()  // ⚠️ TEMPORAIRE pour test uniquement
        )
        .sessionManagement(session -> session
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        );
    return http.build();
}
```

⚠️ **IMPORTANT** : Ne jamais déployer en production avec `.anyRequest().permitAll()` !

---

### Problème : CORS fonctionne mais JWT invalide

```
401 Unauthorized
```

**Solution** : Vérifier que le token JWT est correctement envoyé

```typescript
// Dans les services Angular
headers: new HttpHeaders({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`  // ✅ Prefix "Bearer "
})
```

---

### Problème : CORS dans Docker mais pas en local

**Cause** : URL différente dans Docker

**Solution** : Vérifier `environment.ts`

```typescript
// Pour Docker
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'  // ✅ Correct pour Docker
};

// Pour développement local
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'  // ✅ Même chose
};
```

---

## 📊 Checklist de Vérification

- [x] `SecurityConfiguration.java` : `setAllowedOriginPatterns()` avec wildcards
- [x] `SecurityConfiguration.java` : `setAllowedMethods()` avec OPTIONS
- [x] `SecurityConfiguration.java` : `setAllowCredentials(true)`
- [x] `CorsFilter.java` : Filtre global créé
- [x] `CorsFilter.java` : `@Order(Ordered.HIGHEST_PRECEDENCE)`
- [x] `CorsFilter.java` : Gestion des requêtes OPTIONS
- [x] Backend rebuild avec `docker-compose up -d --build backend`
- [x] Frontend rebuild si nécessaire
- [x] Test cURL OPTIONS
- [x] Test cURL POST
- [x] Test navigateur avec DevTools

---

## 🎯 Résultat Attendu

Après application de toutes les corrections :

✅ **Requêtes OPTIONS** : 200 OK avec headers CORS  
✅ **Requêtes GET/POST** : Fonctionnent correctement  
✅ **Login** : Connexion réussie, token JWT reçu  
✅ **API Projects** : Liste chargée sans erreur 403  
✅ **API Collaborators** : CRUD fonctionne  

---

## 📝 Commits Associés

1. **4e9cbd18** - fix: improve CORS configuration with wildcard origins and additional endpoints
2. **473af674** - fix: add global CORS filter for preflight requests

---

## 📞 Support

Si le problème persiste après toutes ces corrections :

1. **Vérifier les logs** :
   ```bash
   docker-compose logs -f backend | grep -E "(CORS|403|OPTIONS)"
   ```

2. **Vérifier le réseau Docker** :
   ```bash
   docker network inspect digicampmonitoring_default
   ```

3. **Test depuis un conteneur** :
   ```bash
   docker-compose exec frontend curl -v http://backend:8080/api/health
   ```

4. **Ouvrir une issue GitHub** avec :
   - Logs backend complets
   - Screenshot de la console navigateur
   - Commandes docker-compose utilisées

---

<div align="center">
  <strong>Erreurs CORS Corrigées ! 🎉</strong>
  <br>
  <sub>Version 1.0.2 - CORS Fixes</sub>
</div>
