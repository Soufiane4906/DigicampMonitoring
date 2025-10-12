package com.digicamp.monitoring.infrastructure.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Gestionnaire personnalisé pour les erreurs 401 Unauthorized
 * Déclenché quand l'utilisateur n'est pas authentifié
 */
@Slf4j
@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void commence(HttpServletRequest request,
                        HttpServletResponse response,
                        AuthenticationException authException) throws IOException, ServletException {
        
        // Logger des informations détaillées
        log.error("=== 401 UNAUTHORIZED ===");
        log.error("URL: {} {}", request.getMethod(), request.getRequestURI());
        log.error("Remote Address: {}", request.getRemoteAddr());
        log.error("Authorization Header: {}", request.getHeader("Authorization") != null ? "Present" : "Missing");
        
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null) {
            if (authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                log.error("Token présent, longueur: {} caractères", token.length());
                log.error("Token commence par: {}...", token.substring(0, Math.min(20, token.length())));
            } else {
                log.error("Authorization header mal formaté: {}", authHeader.substring(0, Math.min(20, authHeader.length())));
            }
        }
        
        log.error("Exception: {}", authException.getMessage());
        log.error("Exception Type: {}", authException.getClass().getName());
        log.error("========================");

        // Construire une réponse JSON détaillée
        Map<String, Object> errorDetails = new HashMap<>();
        errorDetails.put("timestamp", LocalDateTime.now().toString());
        errorDetails.put("status", 401);
        errorDetails.put("error", "Unauthorized");
        errorDetails.put("message", "Authentification requise pour accéder à cette ressource");
        errorDetails.put("path", request.getRequestURI());
        errorDetails.put("method", request.getMethod());
        
        // Informations de debug
        Map<String, Object> debug = new HashMap<>();
        debug.put("hasAuthHeader", authHeader != null);
        debug.put("authHeaderFormat", authHeader != null && authHeader.startsWith("Bearer ") ? "valid" : "invalid");
        debug.put("exceptionType", authException.getClass().getSimpleName());
        debug.put("exceptionMessage", authException.getMessage());
        errorDetails.put("debug", debug);

        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write(objectMapper.writeValueAsString(errorDetails));
    }
}
