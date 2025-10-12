#!/bin/bash

###############################################################################
# Script de Redémarrage Rapide - DigicampMonitoring
# Ce script rebuild et redémarre les services Docker
###############################################################################

echo "🚀 Démarrage du rebuild DigicampMonitoring..."
echo ""

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les logs avec couleur
info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vérifier si Docker est en cours d'exécution
if ! docker info > /dev/null 2>&1; then
    error "Docker n'est pas en cours d'exécution. Veuillez démarrer Docker Desktop."
    exit 1
fi

success "Docker est en cours d'exécution"
echo ""

# Récupérer les dernières modifications
info "Récupération des dernières modifications depuis GitHub..."
git pull origin main

if [ $? -eq 0 ]; then
    success "Code mis à jour"
else
    warning "Impossible de récupérer les modifications (peut-être déjà à jour)"
fi
echo ""

# Arrêter les conteneurs
info "Arrêt des conteneurs en cours..."
docker-compose down

if [ $? -eq 0 ]; then
    success "Conteneurs arrêtés"
else
    error "Erreur lors de l'arrêt des conteneurs"
    exit 1
fi
echo ""

# Option : Nettoyer les volumes (demander confirmation)
read -p "$(echo -e ${YELLOW}Voulez-vous supprimer les volumes \(base de données réinitialisée\) ? \[y/N\]:${NC} )" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    info "Suppression des volumes..."
    docker-compose down -v
    success "Volumes supprimés"
    echo ""
fi

# Rebuild les images
info "Reconstruction des images Docker (cela peut prendre quelques minutes)..."
docker-compose build --no-cache

if [ $? -eq 0 ]; then
    success "Images reconstruites"
else
    error "Erreur lors de la reconstruction des images"
    exit 1
fi
echo ""

# Démarrer les services
info "Démarrage des services..."
docker-compose up -d

if [ $? -eq 0 ]; then
    success "Services démarrés"
else
    error "Erreur lors du démarrage des services"
    exit 1
fi
echo ""

# Attendre que les services soient prêts
info "Attente du démarrage des services (30 secondes)..."
sleep 30

# Vérifier l'état des conteneurs
echo ""
info "État des conteneurs :"
docker-compose ps
echo ""

# Vérifier la santé du backend
info "Vérification de la santé du backend..."
backend_health=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/actuator/health 2>/dev/null)

if [ "$backend_health" == "200" ]; then
    success "Backend opérationnel (HTTP 200)"
else
    warning "Backend non accessible (HTTP $backend_health). Vérifiez les logs."
fi

# Vérifier la santé du frontend
info "Vérification de la santé du frontend..."
frontend_health=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4200 2>/dev/null)

if [ "$frontend_health" == "200" ]; then
    success "Frontend opérationnel (HTTP 200)"
else
    warning "Frontend non accessible (HTTP $frontend_health). Vérifiez les logs."
fi
echo ""

# Afficher les URLs
success "🎉 Application démarrée avec succès !"
echo ""
info "📱 URLs d'accès :"
echo -e "   ${GREEN}Frontend:${NC} http://localhost:4200"
echo -e "   ${GREEN}Backend API:${NC} http://localhost:8080/api"
echo -e "   ${GREEN}Backend Health:${NC} http://localhost:8080/actuator/health"
echo -e "   ${GREEN}Swagger UI:${NC} http://localhost:8080/swagger-ui.html"
echo ""

# Proposer d'afficher les logs
read -p "$(echo -e ${YELLOW}Voulez-vous afficher les logs en temps réel ? \[y/N\]:${NC} )" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    info "Affichage des logs (Ctrl+C pour quitter)..."
    echo ""
    docker-compose logs -f
fi
