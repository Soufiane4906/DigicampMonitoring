# Guide de résolution des erreurs 403 Forbidden

## Problème rencontré

Les requêtes aux endpoints suivants retournaient systématiquement des erreurs **403 Forbidden** :
- `POST http://localhost:8080/api/projects`
- `POST http://localhost:8080/api/collaborators`
- Et potentiellement d'autres endpoints authentifiés

## Cause principale

Le problème se situait dans le filtre JWT (`JwtAuthenticationFilter.java`) avec plusieurs défauts critiques :

### 1. **Double chargement de l'utilisateur**
```java
// ❌ Code problématique
if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt, 
        customUserDetailsService.loadUserByUsername(tokenProvider.extractUsername(jwt)))) {
    String username = tokenProvider.extractUsername(jwt);
    UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
    // ...
}
```

L'utilisateur était chargé **deux fois** :
- Une première fois dans la condition de validation
- Une deuxième fois après validation

### 2. **Ordre de traitement incorrect**
La validation du token était tentée **avant** d'avoir correctement extrait et vérifié le username.

### 3. **Pas de vérification du contexte de sécurité**
Le filtre réauthentifiait l'utilisateur à chaque requête, même s'il était déjà authentifié.

### 4. **Gestion d'erreurs insuffisante**
Les exceptions n'étaient pas correctement gérées, causant des blocages silencieux.

## Solution appliquée

### Code corrigé

Le fichier `JwtAuthenticationFilter.java` a été corrigé avec les améliorations suivantes :

```java
@Override
protected void doFilterInternal(@NonNull HttpServletRequest request,
                                @NonNull HttpServletResponse response,
                                @NonNull FilterChain filterChain) throws ServletException, IOException {
    try {
        String jwt = getJwtFromRequest(request);

        // Vérifier si un token JWT est présent
        if (StringUtils.hasText(jwt)) {
            // 1. Extraire le nom d'utilisateur du token
            String username = tokenProvider.extractUsername(jwt);
            
            // 2. Vérifier si l'utilisateur n'est pas déjà authentifié
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // 3. Charger les détails de l'utilisateur UNE SEULE FOIS
                UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
                
                // 4. Valider le token
                if (tokenProvider.validateToken(jwt, userDetails)) {
                    // 5. Créer et définir l'authentification
                    UsernamePasswordAuthenticationToken authentication = 
                            new UsernamePasswordAuthenticationToken(
                                userDetails, 
                                null, 
                                userDetails.getAuthorities()
                            );
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        }
    } catch (Exception ex) {
        logger.error("Impossible de définir l'authentification de l'utilisateur", ex);
        // Ne pas bloquer la requête
    }

    filterChain.doFilter(request, response);
}
```

### Améliorations principales

1. ✅ **Ordre de traitement logique** : Extraction → Vérification → Chargement → Validation
2. ✅ **Chargement unique** : L'utilisateur n'est chargé qu'une seule fois
3. ✅ **Vérification du contexte** : Évite la réauthentification inutile
4. ✅ **Gestion robuste des erreurs** : Les exceptions sont loguées mais ne bloquent pas
5. ✅ **Annotations @NonNull** : Meilleure lisibilité et sécurité du code

## Vérification après correction

### 1. Redémarrer l'application backend

```bash
# Si vous utilisez Docker
docker-compose restart back

# Si vous utilisez Maven directement
cd back
mvn spring-boot:run
```

### 2. Tester l'authentification

```bash
# 1. Se connecter
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"votre_username","password":"votre_password"}'

# Vous devriez recevoir un token JWT
# {"token":"eyJhbGciOiJIUzI1NiIs..."}
```

### 3. Tester les endpoints protégés

```bash
# Remplacez YOUR_TOKEN par le token reçu
curl -X GET http://localhost:8080/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN"

curl -X POST http://localhost:8080/api/collaborators \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nom":"Dupont","prenom":"Jean","email":"jean.dupont@example.com"}'
```

### 4. Vérifier dans le frontend

1. Ouvrez l'application Angular (`http://localhost:4200`)
2. Connectez-vous avec vos identifiants
3. Naviguez vers les sections Projects et Collaborators
4. Tentez de créer/modifier des éléments
5. Vérifiez la console du navigateur (F12) - il ne devrait plus y avoir d'erreurs 403

## Diagnostics supplémentaires

### Vérifier les logs du backend

```bash
# Docker
docker-compose logs -f back

# Cherchez des messages comme :
# - "Impossible de définir l'authentification de l'utilisateur"
# - Stack traces liées à JWT
```

### Vérifier le token dans le navigateur

1. Ouvrez les DevTools (F12)
2. Onglet **Application** → **Local Storage**
3. Vérifiez que `auth_token` existe et contient un token valide

### Vérifier les en-têtes de requête

1. Ouvrez les DevTools (F12)
2. Onglet **Network**
3. Sélectionnez une requête vers l'API
4. Vérifiez que l'en-tête `Authorization: Bearer <token>` est présent

## Problèmes connexes possibles

### Si les erreurs 403 persistent

1. **Token expiré** : Reconnectez-vous pour obtenir un nouveau token
2. **CORS** : Vérifiez la configuration CORS dans `SecurityConfiguration.java`
3. **Permissions** : Vérifiez les rôles et permissions de l'utilisateur
4. **Base de données** : Vérifiez que l'utilisateur existe et est actif

### Vérifier la configuration CORS

Le fichier `SecurityConfiguration.java` devrait avoir :

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOriginPatterns(Arrays.asList(
        "http://localhost:*",
        "http://127.0.0.1:*"
    ));
    configuration.setAllowedMethods(Arrays.asList(
        "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"
    ));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

## Références

- Commit de correction : [05148f1](https://github.com/Soufiane4906/DigicampMonitoring/commit/05148f151ff2c8d9959d512fffc126800937269a)
- Documentation Spring Security : https://spring.io/guides/topicals/spring-security-architecture
- Documentation JWT : https://jwt.io/

## Date de résolution

**12 octobre 2025** - Problème identifié et corrigé
