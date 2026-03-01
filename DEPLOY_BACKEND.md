# 🚀 Guide de déploiement du Backend sur Render

Ce guide explique comment déployer le backend LUMINA sur Render.

## 📋 Prérequis

- Compte GitHub avec le projet poussé
- Compte Render (gratuit disponible sur [render.com](https://render.com))
- Base de données PostgreSQL (Render propose une base de données PostgreSQL gratuite)

## 🎯 Déploiement du Backend sur Render

### Étape 1 : Créer une base de données PostgreSQL

1. **Connecter votre compte GitHub à Render**
   - Allez sur [render.com](https://render.com)
   - Cliquez sur "Sign Up" et connectez-vous avec GitHub
   - Autorisez l'accès à vos repositories

2. **Créer une base de données PostgreSQL**
   - Dans le dashboard Render, cliquez sur **"New +"**
   - Sélectionnez **"PostgreSQL"**
   - Configurez :
     - **Name** : `lumina-db`
     - **Database** : `lumina_db`
     - **User** : (généré automatiquement)
     - **Region** : Choisissez la région la plus proche
     - **Plan** : Free (pour commencer)
   - Cliquez sur **"Create Database"**
   - ⚠️ **IMPORTANT** : Notez l'**Internal Database URL** et l'**External Database URL**

3. **Exécuter les migrations SQL**
   - Une fois la base de données créée, vous pouvez :
     - Utiliser un client PostgreSQL (pgAdmin, DBeaver, etc.)
     - Ou utiliser la console SQL de Render
   - Exécutez les fichiers SQL dans l'ordre :
     ```
     database/migrations/001_create_users.sql
     database/migrations/002_create_activites.sql
     database/migrations/003_create_services.sql
     database/migrations/004_create_messages.sql
     ```

### Étape 2 : Déployer le service Web (Backend)

1. **Créer un nouveau Web Service**
   - Dans le dashboard Render, cliquez sur **"New +"**
   - Sélectionnez **"Web Service"**
   - Connectez votre repository GitHub `MKRT-Makaranta`

2. **Configuration du service**
   - **Name** : `lumina-backend`
   - **Region** : Même région que votre base de données
   - **Branch** : `main`
   - **Root Directory** : `backend`
   - **Runtime** : `Node`
   - **Build Command** : `npm install && npm run build`
   - **Start Command** : `npm start`
   - **Plan** : Free (pour commencer)

3. **Variables d'environnement**
   Ajoutez les variables suivantes dans la section **"Environment"** :
   
   ```env
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=<votre_internal_database_url_de_render>
   JWT_SECRET=<générez_un_secret_jwt_long_et_complexe>
   JWT_EXPIRES_IN=7d
   CLOUDINARY_CLOUD_NAME=<votre_cloud_name>
   CLOUDINARY_API_KEY=<votre_api_key>
   CLOUDINARY_API_SECRET=<votre_api_secret>
   ```
   
   ⚠️ **Important** :
   - Utilisez l'**Internal Database URL** de Render (commence par `postgresql://`)
   - Pour `JWT_SECRET`, générez un secret sécurisé (vous pouvez utiliser : `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)
   - Ne partagez jamais ces secrets publiquement

4. **Déployer**
   - Cliquez sur **"Create Web Service"**
   - Render va automatiquement :
     - Cloner votre repository
     - Installer les dépendances
     - Builder le projet
     - Démarrer le service
   - Attendez la fin du déploiement (2-5 minutes)

### Étape 3 : Configurer CORS pour accepter les requêtes depuis Vercel

Une fois le backend déployé, vous obtiendrez une URL comme : `https://lumina-backend.onrender.com`

1. **Mettre à jour la configuration CORS**
   - Le fichier `backend/src/config/corsOptions.ts` doit accepter l'URL de votre frontend Vercel
   - Si nécessaire, mettez à jour le fichier pour inclure votre URL Vercel

2. **Redéployer le backend** (si vous avez modifié CORS)
   - Render redéploiera automatiquement après un push sur GitHub
   - Ou déclenchez un redéploiement manuel depuis le dashboard

### Étape 4 : Créer le compte admin

1. **Se connecter à la base de données**
   - Utilisez l'**External Database URL** de Render
   - Connectez-vous avec un client PostgreSQL

2. **Exécuter le script de seed**
   - Vous pouvez exécuter le script `backend/seed-admin.js` localement en pointant vers la base de données Render
   - Ou créer manuellement le compte admin via SQL

3. **Compte admin par défaut**
   - Email : `admin@lumina.org`
   - Password : `Admin123!`
   - ⚠️ Changez ce mot de passe en production !

### Étape 5 : Mettre à jour le frontend Vercel

1. **Ajouter la variable d'environnement sur Vercel**
   - Allez dans votre projet Vercel
   - Settings → Environment Variables
   - Ajoutez ou modifiez :
     ```
     NEXT_PUBLIC_API_URL=https://lumina-backend.onrender.com/api
     ```
   - Remplacez `lumina-backend.onrender.com` par votre URL Render réelle

2. **Redéployer le frontend**
   - Vercel redéploiera automatiquement
   - Ou déclenchez un redéploiement manuel

## ✅ Vérification après déploiement

1. **Tester le backend**
   - Visitez : `https://votre-backend.onrender.com/api/health`
   - Vous devriez voir : `{"status":"ok","timestamp":"..."}`

2. **Tester le frontend**
   - Visitez votre URL Vercel
   - Testez la connexion admin
   - Vérifiez que les appels API fonctionnent

## 🔧 Configuration avancée

### Utiliser render.yaml (Optionnel)

Le fichier `backend/render.yaml` est fourni pour une configuration automatique. Pour l'utiliser :

1. Dans Render, lors de la création du service, sélectionnez **"Apply render.yaml"**
2. Render utilisera automatiquement la configuration du fichier

### Variables d'environnement sensibles

Pour les variables sensibles (JWT_SECRET, DATABASE_URL, etc.) :
- Utilisez les **Secret Files** de Render pour les secrets très sensibles
- Ou utilisez les variables d'environnement normales (elles sont chiffrées)

## 🐛 Dépannage

### Erreur de connexion à la base de données
- Vérifiez que vous utilisez l'**Internal Database URL** (pas External)
- Vérifiez que la base de données est bien démarrée sur Render
- Vérifiez les logs du service web sur Render

### Erreur CORS
- Vérifiez que l'URL du frontend Vercel est dans la liste des origines autorisées
- Vérifiez les logs du backend pour voir les erreurs CORS

### Le service se met en veille (Free Plan)
- Sur le plan gratuit, Render met les services en veille après 15 minutes d'inactivité
- Le premier démarrage peut prendre 30-60 secondes
- Pour éviter cela, utilisez un plan payant ou un service de "ping" pour maintenir le service actif

### Erreur de build
- Vérifiez les logs de build sur Render
- Assurez-vous que `npm run build` fonctionne localement
- Vérifiez que toutes les dépendances sont dans `package.json`

## 📚 Ressources

- [Documentation Render](https://render.com/docs)
- [Documentation PostgreSQL sur Render](https://render.com/docs/databases)
- [Documentation Node.js sur Render](https://render.com/docs/node)

## 💡 Astuces

- **Plan gratuit** : Les services peuvent être mis en veille après inactivité
- **Logs** : Consultez les logs en temps réel dans le dashboard Render
- **Redéploiement** : Push sur GitHub déclenche automatiquement un redéploiement
- **Variables d'environnement** : Modifiez-les sans redéployer (sauf si nécessaire)
