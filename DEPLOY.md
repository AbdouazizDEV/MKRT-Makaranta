# 🚀 Guide de déploiement sur Vercel

Ce guide explique comment déployer l'application LUMINA sur Vercel.

## 📋 Prérequis

- Compte GitHub avec le projet poussé
- Compte Vercel (gratuit)
- Backend déployé (Railway, Render, ou autre service)

## 🎯 Déploiement du Frontend (Next.js) sur Vercel

### Option 1 : Déploiement via l'interface Vercel (Recommandé)

1. **Connecter votre compte GitHub à Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Cliquez sur "Sign Up" et connectez-vous avec GitHub
   - Autorisez l'accès à vos repositories

2. **Importer le projet**
   - Cliquez sur "Add New Project"
   - Sélectionnez le repository `MKRT-Makaranta`
   - Vercel détectera automatiquement Next.js

3. **Configuration du projet** ⚠️ IMPORTANT
   
   **AVANT de cliquer sur "Deploy", configurez le Root Directory :**
   
   - Cliquez sur **"Settings"** (ou "Configure Project")
   - Dans la section **"General"**, trouvez **"Root Directory"**
   - Cliquez sur **"Edit"** et entrez : `frontend`
   - Cliquez sur **"Save"**
   - **Framework Preset** : Next.js (détecté automatiquement)
   - **Build Command** : `npm run build` (par défaut)
   - **Output Directory** : `.next` (par défaut)
   - **Install Command** : `npm install` (par défaut)
   
   ⚠️ **Sans cette configuration, le build échouera !**

4. **Variables d'environnement**
   Ajoutez les variables suivantes dans les paramètres du projet :
   ```
   NEXT_PUBLIC_API_URL=https://votre-backend-url.com/api
   ```
   ⚠️ Remplacez `votre-backend-url.com` par l'URL de votre backend déployé

5. **Déployer**
   - Cliquez sur "Deploy"
   - Attendez la fin du build
   - Votre application sera disponible sur `https://votre-projet.vercel.app`

### Option 2 : Déploiement via CLI Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter à Vercel
vercel login

# Aller dans le dossier frontend
cd frontend

# Déployer
vercel

# Pour la production
vercel --prod
```

## 🔧 Configuration des variables d'environnement sur Vercel

1. Allez dans votre projet sur Vercel
2. Cliquez sur **Settings** → **Environment Variables**
3. Ajoutez :
   - `NEXT_PUBLIC_API_URL` : URL de votre backend (ex: `https://lumina-backend.railway.app/api`)

## 🌐 Déploiement du Backend

Vercel peut héberger des API routes Next.js, mais pour un backend Express séparé, utilisez :

### Option 1 : Railway (Recommandé)
- [railway.app](https://railway.app)
- Connectez votre repo GitHub
- Sélectionnez le dossier `backend`
- Configurez les variables d'environnement
- Déployez

### Option 2 : Render
- [render.com](https://render.com)
- Créez un nouveau "Web Service"
- Connectez votre repo GitHub
- Root Directory : `backend`
- Build Command : `npm install && npm run build`
- Start Command : `npm start`

### Option 3 : Vercel Serverless Functions
Si vous voulez tout sur Vercel, vous devrez adapter le backend en API routes Next.js.

## 📝 Variables d'environnement du Backend

Sur votre plateforme de déploiement backend, configurez :

```env
PORT=5000
DATABASE_URL=postgresql://...
JWT_SECRET=votre_secret_jwt
JWT_EXPIRES_IN=7d
NODE_ENV=production
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
```

## ✅ Vérification après déploiement

1. **Frontend** : Visitez `https://votre-projet.vercel.app`
2. **Backend** : Testez `https://votre-backend-url.com/api/health`
3. **Connexion** : Testez la connexion admin sur le frontend déployé

## 🔄 Déploiements automatiques

Vercel déploie automatiquement à chaque push sur la branche `main` :
- Chaque commit déclenche un nouveau déploiement
- Les pull requests créent des preview deployments

## 🐛 Dépannage

### Erreur CORS
- Vérifiez que `NEXT_PUBLIC_API_URL` est correcte
- Vérifiez la configuration CORS du backend

### Erreur 404 sur les routes
- Vérifiez que `next.config.js` est correct
- Vérifiez les routes dans `app/`

### Erreur de build
- Vérifiez les logs de build sur Vercel
- Testez le build localement : `npm run build`

## 📚 Ressources

- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Next.js](https://nextjs.org/docs)
