# Élixir Parfums — Application E-Commerce

Boutique en ligne de parfums de luxe avec dashboard admin et paiement Stripe.

## Stack technique

- **Frontend** : React 18, React Router v6, Stripe.js, Recharts
- **Backend** : Node.js, Express.js, MongoDB (Mongoose), JWT
- **Paiement** : Stripe (PaymentIntents + Webhooks)

## Structure du projet

```
elixir-parfums/
├── backend/
│   ├── server.js
│   ├── .env.example
│   ├── models/          User.js · Product.js · Order.js
│   ├── routes/          auth.js · products.js · orders.js · payments.js · admin.js
│   └── middleware/      auth.js
└── frontend/
    ├── public/          index.html
    └── src/
        ├── App.jsx
        ├── index.js
        ├── context/     AuthContext.jsx · CartContext.jsx
        ├── components/  common/Navbar.jsx
        └── pages/
            ├── HomePage.jsx
            ├── ProductPage.jsx
            ├── CartPage.jsx
            ├── CheckoutPage.jsx
            ├── LoginPage.jsx
            ├── OrdersPage.jsx
            └── admin/
                ├── AdminDashboard.jsx
                ├── AdminProducts.jsx
                └── AdminOrders.jsx
```

## Installation

### Prérequis
- Node.js >= 18
- MongoDB (local ou MongoDB Atlas)
- Compte Stripe (gratuit sur stripe.com)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Éditer .env avec vos valeurs
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Mettre votre clé publique Stripe dans .env
npm start
```

### 3. Variables d'environnement

**backend/.env**
```
PORT=5000
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/elixir-parfums
JWT_SECRET=votre_secret_fort_ici
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**frontend/.env**
```
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_...
```

### 4. Créer le premier compte admin

Après votre première inscription sur le site, passez votre compte en admin via MongoDB :

```js
// Dans MongoDB Compass ou mongosh :
db.users.updateOne(
  { email: "votre@email.com" },
  { $set: { role: "admin" } }
)
```

### 5. Stripe Webhook (en développement)

```bash
# Installer Stripe CLI : https://stripe.com/docs/stripe-cli
stripe listen --forward-to localhost:5000/api/payments/webhook
```

## Fonctionnalités

### Boutique
- Catalogue produits avec filtres par famille olfactive
- Page produit avec sélection de taille et quantité
- Panier persistant (localStorage)
- Livraison offerte dès 1 000 MAD

### Authentification
- Inscription / Connexion avec JWT
- Routes protégées (checkout, commandes)

### Paiement
- Paiement sécurisé via Stripe (carte bancaire)
- Webhooks pour confirmation automatique des commandes
- Historique des commandes

### Dashboard Admin
- Statistiques (CA, commandes, clients, panier moyen)
- Graphique des ventes sur 7 jours
- Gestion complète des produits (CRUD + variantes)
- Gestion des commandes avec mise à jour de statut

## Déploiement

- **Backend** : Railway, Render, ou VPS avec PM2
- **Frontend** : Vercel, Netlify (`npm run build`)
- **Base de données** : MongoDB Atlas (gratuit jusqu'à 512MB)
