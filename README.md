#  RestaurantPFA - Application Web & Mobile

> Projet de Fin d'Année 2026 · Next.js 14 + Spring Boot 3 + PostgreSQL

---

##  Lancement rapide

### Option 1 - Docker (recommandé, tout-en-un)

```bash
# Prérequis : Docker Desktop installé et démarré
chmod +x start-docker.sh
./start-docker.sh
```

### Option 2 - Développement local (sans Docker)

```bash
# Prérequis : Java 21, Maven, Node 20+, PostgreSQL 16, Redis 7
chmod +x start-dev.sh
./start-dev.sh
```

### Option 3 - Lancement manuel

**Backend :**
```bash
cd backend
mvn spring-boot:run
```

**Frontend (dans un second terminal) :**
```bash
cd frontend
npm install
npm run dev
```

---

##  URLs

| Service  | URL |
|----------|-----|
| Frontend | http://localhost:3000 |
| API REST | http://localhost:8080/api |
| Swagger  | http://localhost:8080/api/swagger-ui.html |

---

##  Comptes de démonstration

| Rôle    | Email                    | Mot de passe |
|---------|--------------------------|--------------|
| Admin   | admin@restaurant.ma      | admin123     |
| Cuisine | chef@restaurant.ma       | chef123      |
| Client  | client@restaurant.ma     | client123    |

---

##  Architecture

```
restaurant-pfa/
├── backend/          ← Spring Boot 3 · Java 21 · PostgreSQL · Redis
│   ├── src/main/java/com/restaurant/
│   │   ├── config/           SecurityConfig, WebSocket, CORS
│   │   ├── modules/
│   │   │   ├── auth/         JWT, login, register
│   │   │   ├── menu/         Catégories + Plats CRUD
│   │   │   ├── order/        Commandes + WebSocket temps réel
│   │   │   └── accounting/   Stats + KPIs dashboard
│   │   ├── user/             Entité User + rôles
│   │   └── shared/           ApiResponse, exceptions
│   └── Dockerfile
│
├── frontend/         ← Next.js 14 · TypeScript · Tailwind CSS
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/login      Page de connexion
│   │   │   ├── (admin)/          Dashboard, Menu, Commandes, Stats, Compta
│   │   │   ├── (kitchen)/kanban  Vue Kanban cuisine (temps réel)
│   │   │   └── (client)/menu     Menu client + panier
│   │   ├── components/           UI réutilisables
│   │   ├── lib/api.ts            Client Axios
│   │   ├── store/                Zustand (auth + cart)
│   │   ├── hooks/useOrders.ts    WebSocket STOMP
│   │   └── types/                Types TypeScript
│   └── Dockerfile
│
├── docker-compose.yml
├── start-docker.sh   ← Lancement Docker tout-en-un
├── start-dev.sh      ← Lancement développement local
└── README.md
```

---

##  Fonctionnalités implémentées

### Backend (Spring Boot)
- [x] Authentification JWT (login / register / refresh)
- [x] Sécurité par rôles (ADMIN / STAFF / CLIENT)
- [x] CRUD Menu : catégories + plats + toggle disponibilité
- [x] Commandes : création, suivi de statut, WebSocket temps réel
- [x] Stats dashboard : CA jour/mois, commandes, utilisateurs
- [x] Cache Redis sur le menu
- [x] Données de démonstration auto-générées
- [x] Swagger UI documenté

### Frontend (Next.js)
- [x] Login avec JWT + persistance localStorage
- [x] Redirection automatique selon le rôle
- [x] **Admin Dashboard** : KPIs + tableau commandes actives
- [x] **Gestion Menu** : CRUD plats avec modale, filtres, toggle
- [x] **Commandes Admin** : vue 3 colonnes avec avancement statut
- [x] **Vue Kanban Cuisine** : interface dark pour la cuisine, temps réel
- [x] **Menu Client** : catalogue + panier + passage de commande
- [x] **Statistiques** : graphes Recharts (bar, pie)
- [x] **Comptabilité** : résumé CA, HT, TVA
- [x] WebSocket STOMP pour les mises à jour en temps réel

---

##  Variables d'environnement

### Backend (`application.yml`)
| Variable | Défaut | Description |
|----------|--------|-------------|
| DB_URL | jdbc:postgresql://localhost:5432/restaurant_db | URL PostgreSQL |
| DB_USER | postgres | Utilisateur BDD |
| DB_PASSWORD | postgres | Mot de passe BDD |
| REDIS_HOST | localhost | Hôte Redis |
| JWT_SECRET | (inclus) | Clé de signature JWT |

### Frontend
| Variable | Défaut | Description |
|----------|--------|-------------|
| NEXT_PUBLIC_API_URL | http://localhost:8080/api | URL de l'API |
| NEXT_PUBLIC_WS_URL | ws://localhost:8080 | URL WebSocket |

---

##  Tester l'API

Avec Swagger : http://localhost:8080/api/swagger-ui.html

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@restaurant.ma","password":"admin123"}'

# Menu complet
curl http://localhost:8080/api/menu/full

# Dashboard stats (avec token)
curl http://localhost:8080/api/stats/dashboard \
  -H "Authorization: Bearer <token>"
```
