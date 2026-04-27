#!/bin/bash
# =============================================================
#  Restaurant PFA – Lancement via Docker Compose
#  Prérequis : Docker Desktop installé et démarré
# =============================================================

set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'

info() { echo -e "${GREEN}[INFO]${NC} $1"; }
err()  { echo -e "${RED}[ERR]${NC}  $1"; exit 1; }

command -v docker >/dev/null 2>&1 || err "Docker non trouvé. Installe Docker Desktop depuis https://www.docker.com"
docker info >/dev/null 2>&1       || err "Docker n'est pas démarré. Lance Docker Desktop d'abord."

cd "$ROOT"

info "Construction et démarrage des conteneurs..."
docker compose up --build -d

info "Attente que les services soient prêts..."
sleep 10

# Vérifier la santé du backend
for i in {1..20}; do
  if docker compose exec backend curl -s http://localhost:8080/api/actuator/health >/dev/null 2>&1; then
    break
  fi
  sleep 3
done

echo ""
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✅ Tous les conteneurs sont démarrés !${NC}"
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo ""
echo "  Frontend  →  http://localhost:3000"
echo "  Backend   →  http://localhost:8080/api"
echo "  Swagger   →  http://localhost:8080/api/swagger-ui.html"
echo ""
echo "  Comptes de démo :"
echo "  Admin   : admin@restaurant.ma / admin123"
echo "  Cuisine : chef@restaurant.ma  / chef123"
echo "  Client  : client@restaurant.ma / client123"
echo ""
echo "  Pour voir les logs : docker compose logs -f"
echo "  Pour arrêter       : docker compose down"
echo ""
