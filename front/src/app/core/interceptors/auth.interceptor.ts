import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  console.log('🔍 [Auth Interceptor] Requête:', req.method, req.url);

  // Cloner la requête avec le token si disponible
  if (token) {
    console.log('✅ [Auth Interceptor] Token ajouté, longueur:', token.length);
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  } else {
    console.warn('⚠️ [Auth Interceptor] Aucun token disponible');
  }

  // Gérer les erreurs
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('❌ [Auth Interceptor] Erreur HTTP:', error.status, error.statusText);
      console.error('📍 [Auth Interceptor] URL:', req.method, req.url);
      
      if (error.status === 401) {
        console.error('🔒 [401 Unauthorized] Non authentifié');
        console.error('Details:', error.error);
        
        // Token invalide ou expiré - rediriger vers login
        authService.logout();
        router.navigate(['/auth/login'], {
          queryParams: { returnUrl: router.url, reason: 'session-expired' }
        });
      } else if (error.status === 403) {
        console.error('🚫 [403 Forbidden] Accès refusé');
        console.error('Details:', error.error);
        
        // Afficher les informations de debug si disponibles
        if (error.error?.debug) {
          console.error('🐛 Debug Info:', error.error.debug);
          console.error('  - Authentifié:', error.error.debug.authenticated);
          console.error('  - Username:', error.error.debug.username);
          console.error('  - Authorities:', error.error.debug.authorities);
          console.error('  - Auth Header:', error.error.debug.hasAuthHeader);
        }
        
        // Vérifier si le token existe toujours
        if (!authService.getToken()) {
          console.error('⚠️ Token manquant après erreur 403, redirection vers login');
          router.navigate(['/auth/login']);
        }
      } else if (error.status === 0) {
        console.error('🌐 [Network Error] Impossible de contacter le serveur');
        console.error('Vérifiez que le backend est démarré sur http://localhost:8080');
      }
      
      return throwError(() => error);
    })
  );
};
