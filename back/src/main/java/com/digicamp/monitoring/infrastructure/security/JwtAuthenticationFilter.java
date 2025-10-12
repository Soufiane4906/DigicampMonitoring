package com.digicamp.monitoring.infrastructure.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        
        String requestURI = request.getRequestURI();
        String method = request.getMethod();
        
        log.debug("=== JWT Filter - Processing request: {} {}", method, requestURI);
        
        try {
            String jwt = getJwtFromRequest(request);

            if (StringUtils.hasText(jwt)) {
                log.debug("JWT Token trouvé, longueur: {} caractères", jwt.length());
                
                // Extraire le nom d'utilisateur du token
                String username = tokenProvider.extractUsername(jwt);
                log.debug("Username extrait du token: {}", username);
                
                // Vérifier si l'utilisateur n'est pas déjà authentifié
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    log.debug("Utilisateur '{}' non encore authentifié, chargement des détails...", username);
                    
                    try {
                        // Charger les détails de l'utilisateur
                        UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
                        log.debug("UserDetails chargé pour '{}', Authorities: {}", username, userDetails.getAuthorities());
                        
                        // Valider le token
                        if (tokenProvider.validateToken(jwt, userDetails)) {
                            log.debug("Token validé avec succès pour '{}'", username);
                            
                            // Créer l'objet d'authentification
                            UsernamePasswordAuthenticationToken authentication = 
                                    new UsernamePasswordAuthenticationToken(
                                        userDetails, 
                                        null, 
                                        userDetails.getAuthorities()
                                    );
                            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                            
                            // Définir l'authentification dans le contexte de sécurité
                            SecurityContextHolder.getContext().setAuthentication(authentication);
                            log.info("✅ Authentification réussie pour '{}' - Accès à {} {}", username, method, requestURI);
                        } else {
                            log.warn("❌ Token invalide pour '{}'", username);
                        }
                    } catch (Exception e) {
                        log.error("❌ Erreur lors du chargement de l'utilisateur '{}': {}", username, e.getMessage());
                    }
                } else if (username != null) {
                    log.debug("Utilisateur '{}' déjà authentifié", username);
                } else {
                    log.warn("❌ Impossible d'extraire le username du token");
                }
            } else {
                log.debug("Aucun token JWT trouvé dans la requête {} {}", method, requestURI);
            }
        } catch (Exception ex) {
            log.error("❌ Exception dans JWT Filter pour {} {}: {}", method, requestURI, ex.getMessage(), ex);
        }

        filterChain.doFilter(request, response);
        log.debug("=== JWT Filter - Requête {} {} terminée", method, requestURI);
    }

    /**
     * Extrait le token JWT de l'en-tête Authorization
     */
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
