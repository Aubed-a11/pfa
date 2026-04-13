#!/bin/bash
# =============================================================
#  Restaurant PFA – Lancement mode développement local
#  Prérequis : Java 21, Maven, Node 20+, PostgreSQL, Redis
# =============================================================

set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'

info()    { echo -e "${GREEN}[INFO]${NC} $1"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $1"; }
err()     { echo -e "${RED}[ERR]${NC}  $1"; exit 1; }

# ── Vérification des prérequis ─────────────────────────────
command -v java  >/dev/null 2>&1 || err "Java 21 non trouvé. Installe JDK 21."
command -v mvn   >/dev/null 2>&1 || err "Maven non trouvé. Installe Maven 3.9+."
command -v node  >/dev/null 2>&1 || err "Node.js non trouvé. Installe Node 20+."
command -v npm   >/dev/null 2>&1 || err "npm non trouvé."
command -v psql  >/dev/null 2>&1 || warn "psql non trouvé – assure-toi que PostgreSQL tourne sur le port 5432."

# ── Créer la base de données si elle n'existe pas ──────────
info "Vérification de la base de données PostgreSQL..."
psql -U postgres -c "SELECT 1 FROM pg_database WHERE datname='restaurant_db'" 2>/dev/null | grep -q 1 || \
  psql -U postgres -c "CREATE DATABASE restaurant_db;" 2>/dev/null || \
  warn "Impossible de créer la BDD automatiquement – assure-toi que restaurant_db existe."

# ── Backend ────────────────────────────────────────────────
info "Démarrage du backend Spring Boot..."
cd "$ROOT/backend"
mvn spring-boot:run \
  -Dspring-boot.run.jvmArguments="-Dspring.profiles.active=dev" \
  -q &
BACKEND_PID=$!
info "Backend PID : $BACKEND_PID"

# ── Attendre que le backend soit prêt ──────────────────────
info "Attente du backend sur le port 8080..."
for i in {1..30}; do
  if curl -s http://localhost:8080/api/actuator/health >/dev/null 2>&1; then
    info "Backend prêt ✓"
    break
  fi
  sleep 2
done

# ── Frontend ───────────────────────────────────────────────
info "Installation des dépendances frontend..."
cd "$ROOT/frontend"
npm install --silent

info "Démarrage du frontend Next.js..."
npm run dev &
FRONTEND_PID=$!
info "Frontend PID : $FRONTEND_PID"

# ── Résumé ─────────────────────────────────────────────────
echo ""
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✅ Application démarrée avec succès !${NC}"
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
echo "  Appuie sur Ctrl+C pour arrêter."
echo ""

# Arrêt propre
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; info 'Arrêt effectué.'" SIGINT SIGTERM
wait
