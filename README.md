# 🌟 LUMINA - Plateforme Web ONG

**"Éclairer les esprits, bâtir l'avenir."**

Application web complète pour la gestion et la présentation des activités d'une ONG dédiée à l'éducation et à l'autonomisation des jeunes en Afrique de l'Ouest.

## 📋 Table des matières

- [Architecture](#architecture)
- [Technologies](#technologies)
- [Installation](#installation)
- [Configuration](#configuration)
- [Démarrage](#démarrage)
- [Structure du projet](#structure-du-projet)
- [API Endpoints](#api-endpoints)
- [Sécurité](#sécurité)

## 🏗️ Architecture

Le projet suit une architecture **frontend/backend séparée** :

- **Frontend** : Next.js 14 (App Router) avec TypeScript
- **Backend** : Node.js/Express avec TypeScript et PostgreSQL
- **Base de données** : PostgreSQL avec migrations
- **Authentification** : JWT (httpOnly cookies)
- **Stockage d'images** : Cloudinary

## 🛠️ Technologies

### Backend
- Express.js
- PostgreSQL (pg)
- TypeScript
- JWT (jsonwebtoken)
- bcrypt
- Zod (validation)
- Multer (upload)
- Helmet (sécurité)
- express-rate-limit

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Axios
- React Hook Form
- Zod (validation)
- React Hot Toast
- Lucide React

## 📦 Installation

### Prérequis

- Node.js 18+ et npm
- PostgreSQL 14+
- Compte Cloudinary (pour le stockage d'images)

### Étapes

1. **Cloner le projet** (si applicable)
```bash
cd MKRT-Makaranta
```

2. **Installer les dépendances backend**
```bash
cd backend
npm install
```

3. **Installer les dépendances frontend**
```bash
cd ../frontend
npm install
```

4. **Configurer PostgreSQL**

Créez une base de données :
```sql
CREATE DATABASE lumina_db;
```

5. **Exécuter les migrations**

```bash
cd ../database/migrations
# Exécutez les fichiers SQL dans l'ordre :
# 001_create_users.sql
# 002_create_activites.sql
# 003_create_services.sql
# 004_create_messages.sql
```

6. **Créer le compte admin par défaut**

```bash
cd ../seeds
# Exécutez seed_admin.sql
```

## ⚙️ Configuration

### Backend (.env)

Créez `backend/.env` :

```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/lumina_db
JWT_SECRET=votre_secret_jwt_tres_long_et_complexe_au_moins_32_caracteres
JWT_EXPIRES_IN=7d
UPLOAD_DIR=./uploads
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
```

### Frontend (.env.local)

Créez `frontend/.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🚀 Démarrage

### Backend

```bash
cd backend
npm run dev
```

Le serveur démarre sur `http://localhost:5000`

### Frontend

```bash
cd frontend
npm run dev
```

L'application démarre sur `http://localhost:3000`

## 📁 Structure du projet

```
lumina-ong/
├── frontend/          # Application Next.js
├── backend/           # API REST Node.js/Express
├── database/          # Scripts SQL & migrations
├── .env.example
└── README.md
```

Voir la documentation complète dans les fichiers du projet pour plus de détails.

## 🔗 API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion admin
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/me` - Informations utilisateur connecté

### Activités
- `GET /api/activites` - Liste publique
- `GET /api/activites/:id` - Détail
- `POST /api/activites` - Créer (admin)
- `PUT /api/activites/:id` - Modifier (admin)
- `DELETE /api/activites/:id` - Supprimer (admin)
- `GET /api/admin/activites` - Toutes (admin)

### Services
- `GET /api/services` - Liste publique
- `POST /api/services` - Créer (admin)
- `PUT /api/services/:id` - Modifier (admin)
- `DELETE /api/services/:id` - Supprimer (admin)

### Messages
- `POST /api/messages` - Envoyer un message
- `GET /api/messages` - Liste (admin)
- `PATCH /api/messages/:id/read` - Marquer comme lu (admin)
- `DELETE /api/messages/:id` - Supprimer (admin)

## 🔐 Sécurité

- Mots de passe hashés avec bcrypt (salt rounds ≥ 12)
- JWT stocké en httpOnly cookie
- Validation Zod (backend et frontend)
- Requêtes SQL paramétrées
- CORS configuré strictement
- Helmet.js activé
- Rate limiting sur auth et contact
- Protection des routes admin

## 👤 Compte admin par défaut

Après avoir exécuté le seed :
- **Email** : admin@lumina.org
- **Password** : `Admin123!` (à changer en production)

## 📝 Notes

- Les images sont stockées sur Cloudinary
- Le backend expose uniquement des endpoints REST
- Aucune logique métier dans le frontend
- Architecture respectant les principes SOLID

## 🐛 Dépannage

### Erreur de connexion à la base de données
Vérifiez que PostgreSQL est démarré et que `DATABASE_URL` est correcte.

### Erreur CORS
Assurez-vous que `NEXT_PUBLIC_API_URL` correspond à l'URL du backend.

### Erreur d'upload d'image
Vérifiez vos credentials Cloudinary dans `backend/.env`.

---

**Développé avec ❤️ pour LUMINA**
