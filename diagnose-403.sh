#!/bin/bash

# Script de diagnostic pour l'erreur 403 Forbidden
# À exécuter depuis le dossier racine du projet

echo "🔍 Diagnostic de l'erreur 403 Forbidden"
echo "========================================"
echo ""

# 1. Vérifier que les conteneurs sont en cours d'exécution
echo "📦 1. Vérification des conteneurs Docker..."
docker-compose ps
echo ""

# 2. Vérifier les logs backend pour les erreurs JWT
echo "🔐 2. Recherche d'erreurs JWT dans les logs backend..."
docker-compose logs backend | grep -i "jwt\|token\|403\|authentication" | tail -20
echo ""

# 3. Tester l'authentification
echo "🔑 3. Test d'authentification..."
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | jq -r '.token')

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
  echo "✅ Authentification réussie"
  echo "Token (premiers 50 caractères): ${TOKEN:0:50}..."
  
  # 4. Tester l'accès aux projets avec le token
  echo ""
  echo "📁 4. Test d'accès aux projets avec le token..."
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Authorization: Bearer $TOKEN" \
    http://localhost:8080/api/projects)
  
  if [ "$HTTP_CODE" == "200" ]; then
    echo "✅ Accès aux projets OK (HTTP $HTTP_CODE)"
    echo ""
    echo "🎉 Le backend fonctionne correctement !"
    echo "📌 Le problème vient probablement du frontend (cache navigateur ou build)"
    echo ""
    echo "Solutions :"
    echo "  1. Videz le cache du navigateur (Ctrl+Shift+Delete)"
    echo "  2. Reconnectez-vous à l'application"
    echo "  3. Si le problème persiste, reconstruisez le frontend:"
    echo "     docker-compose restart frontend"
  else
    echo "❌ Erreur d'accès aux projets (HTTP $HTTP_CODE)"
    echo "Le backend a un problème de configuration de sécurité"
  fi
else
  echo "❌ Échec de l'authentification"
  echo "Vérifiez que le backend est démarré et que la base de données est seeded"
fi

echo ""
echo "5. Vérification de la configuration CORS..."
curl -s -I -X OPTIONS http://localhost:8080/api/projects \
  -H "Origin: http://localhost" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Authorization, Content-Type" \
  | grep -i "access-control"

echo ""
echo "======================================"
echo "Diagnostic terminé"
