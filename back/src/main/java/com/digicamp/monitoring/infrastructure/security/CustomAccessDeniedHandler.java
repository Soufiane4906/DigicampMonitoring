package com.digicamp.monitoring.infrastructure.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Gestionnaire personnalisé pour les erreurs 403 Access Denied
 * Fournit des informations détaillées pour le debugging
 */
@Slf4j
@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void handle(HttpServletRequest request,
                      HttpServletResponse response,
                      AccessDeniedException accessDeniedException) throws IOException, ServletException {
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        // Logger des informations détaillées
        log.error("=== 403 ACCESS DENIED ===");
        log.error("URL: {} {}", request.getMethod(), request.getRequestURI());
        log.error("Remote Address: {}", request.getRemoteAddr());
        log.error("User-Agent: {}", request.getHeader("User-Agent"));
        log.error("Authorization Header: {}", request.getHeader("Authorization") != null ? "Present" : "Missing");
        
        if (auth != null) {
            log.error("Authenticated User: {}", auth.getName());
            log.error("Authorities: {}", auth.getAuthorities());
            log.error("Is Authenticated: {}", auth.isAuthenticated());
            log.error("Principal Type: {}", auth.getPrincipal().getClass().getName());
        } else {
            log.error("Authentication: NULL - User is not authenticated!");
        }
        
        log.error("Exception Message: {}", accessDeniedException.getMessage());
        log.error("========================");

        // Construire une réponse JSON détaillée
        Map<String, Object> errorDetails = new HashMap<>();
        errorDetails.put("timestamp", LocalDateTime.now().toString());
        errorDetails.put("status", 403);
        errorDetails.put("error", "Forbidden");
        errorDetails.put("message", "Accès refusé à cette ressource");
        errorDetails.put("path", request.getRequestURI());
        errorDetails.put("method", request.getMethod());
        
        // Informations de debug (à retirer en production)
        Map<String, Object> debug = new HashMap<>();
        debug.put("authenticated", auth != null && auth.isAuthenticated());
        debug.put("username", auth != null ? auth.getName() : "anonymous");
        debug.put("authorities", auth != null ? auth.getAuthorities().toString() : "none");
        debug.put("hasAuthHeader", request.getHeader("Authorization") != null);
        errorDetails.put("debug", debug);

        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.getWriter().write(objectMapper.writeValueAsString(errorDetails));
    }
}
