@echo off
REM ###############################################################################
REM Script de Redémarrage Rapide - DigicampMonitoring (Windows)
REM Ce script rebuild et redémarre les services Docker
REM ###############################################################################

title DigicampMonitoring - Rebuild Script
color 0A

echo.
echo ========================================
echo   DigicampMonitoring - Rebuild Script
echo ========================================
echo.

REM Vérifier si Docker est en cours d'exécution
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] Docker n'est pas en cours d'execution.
    echo Veuillez demarrer Docker Desktop.
    pause
    exit /b 1
)

echo [OK] Docker est en cours d'execution
echo.

REM Récupérer les dernières modifications
echo [INFO] Recuperation des dernieres modifications depuis GitHub...
git pull origin main

echo [OK] Code mis a jour
echo.

REM Arrêter les conteneurs
echo [INFO] Arret des conteneurs en cours...
docker-compose down

if errorlevel 1 (
    echo [ERREUR] Erreur lors de l'arret des conteneurs
    pause
    exit /b 1
)

echo [OK] Conteneurs arretes
echo.

REM Demander si on supprime les volumes
set /p cleanup="Voulez-vous supprimer les volumes (base de donnees reinitialisee) ? [y/N]: "
if /i "%cleanup%"=="y" (
    echo [INFO] Suppression des volumes...
    docker-compose down -v
    echo [OK] Volumes supprimes
    echo.
)

REM Rebuild les images
echo [INFO] Reconstruction des images Docker...
echo Cela peut prendre quelques minutes...
docker-compose build --no-cache

if errorlevel 1 (
    echo [ERREUR] Erreur lors de la reconstruction des images
    pause
    exit /b 1
)

echo [OK] Images reconstruites
echo.

REM Démarrer les services
echo [INFO] Demarrage des services...
docker-compose up -d

if errorlevel 1 (
    echo [ERREUR] Erreur lors du demarrage des services
    pause
    exit /b 1
)

echo [OK] Services demarres
echo.

REM Attendre que les services soient prêts
echo [INFO] Attente du demarrage des services (30 secondes)...
timeout /t 30 /nobreak >nul

REM Vérifier l'état des conteneurs
echo.
echo [INFO] Etat des conteneurs :
docker-compose ps
echo.

REM Vérifier la santé du backend
echo [INFO] Verification de la sante du backend...
curl -s -o nul -w "%%{http_code}" http://localhost:8080/actuator/health > temp_health.txt 2>nul
set /p backend_health=<temp_health.txt
del temp_health.txt >nul 2>&1

if "%backend_health%"=="200" (
    echo [OK] Backend operationnel ^(HTTP 200^)
) else (
    echo [ATTENTION] Backend non accessible ^(HTTP %backend_health%^). Verifiez les logs.
)

REM Vérifier la santé du frontend
echo [INFO] Verification de la sante du frontend...
curl -s -o nul -w "%%{http_code}" http://localhost:4200 > temp_frontend.txt 2>nul
set /p frontend_health=<temp_frontend.txt
del temp_frontend.txt >nul 2>&1

if "%frontend_health%"=="200" (
    echo [OK] Frontend operationnel ^(HTTP 200^)
) else (
    echo [ATTENTION] Frontend non accessible ^(HTTP %frontend_health%^). Verifiez les logs.
)
echo.

REM Afficher les URLs
echo ========================================
echo   Application demarree avec succes !
echo ========================================
echo.
echo URLs d'acces :
echo   Frontend:       http://localhost:4200
echo   Backend API:    http://localhost:8080/api
echo   Backend Health: http://localhost:8080/actuator/health
echo   Swagger UI:     http://localhost:8080/swagger-ui.html
echo.

REM Proposer d'afficher les logs
set /p show_logs="Voulez-vous afficher les logs en temps reel ? [y/N]: "
if /i "%show_logs%"=="y" (
    echo.
    echo [INFO] Affichage des logs ^(Ctrl+C pour quitter^)...
    echo.
    docker-compose logs -f
)

pause
