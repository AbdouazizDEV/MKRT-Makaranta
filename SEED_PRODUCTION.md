# 🌱 Guide pour exécuter les seeders en production (Render)

Ce guide explique comment exécuter les seeders pour créer le compte admin en production sur Render.

## 📋 Prérequis

1. ✅ Les migrations SQL ont été exécutées (tables créées)
2. ✅ Le backend est déployé sur Render
3. ✅ Les variables d'environnement sont configurées (notamment `DATABASE_URL`)

## 🚀 Méthode 1 : Via Render Shell (Recommandé)

### Étape 1 : Ouvrir Render Shell

1. Allez sur votre dashboard Render
2. Sélectionnez votre service backend (`lumina-backend`)
3. Cliquez sur **"Shell"** dans le menu de gauche
4. Une console s'ouvre dans votre navigateur

### Étape 2 : Exécuter le script de seed

Dans la console Render Shell, exécutez :

```bash
cd /opt/render/project/src/backend
node run-seed.js
```

**Note** : Le chemin peut varier. Si le script n'est pas trouvé, vérifiez le chemin avec :
```bash
pwd
ls -la
```

### Étape 3 : Vérifier le résultat

Vous devriez voir :
```
✅ Compte admin créé avec succès!

📧 Email: admin@lumina.org
🔑 Mot de passe: Admin123!
👤 Role: admin
🆔 ID: [uuid]

⚠️  IMPORTANT: Changez ce mot de passe en production!
```

## 🚀 Méthode 2 : Via SSH local (si configuré)

Si vous avez configuré SSH pour Render :

```bash
ssh render@[votre-service].onrender.com
cd /opt/render/project/src/backend
node run-seed.js
```

## 🚀 Méthode 3 : Via script local pointant vers Render

### Étape 1 : Configurer l'environnement local

Créez un fichier `.env` dans `backend/` :

```env
DATABASE_URL=<votre_external_database_url_de_render>
```

⚠️ **Important** : Utilisez l'**External Database URL** (pas Internal) pour les connexions depuis l'extérieur.

### Étape 2 : Exécuter le script

```bash
cd backend
npm run seed
```

## ✅ Vérification

Après avoir exécuté le script, vérifiez que le compte admin existe :

### Option 1 : Via Render Shell

```bash
cd /opt/render/project/src/backend
node test-connection.js
```

### Option 2 : Via SQL direct

Connectez-vous à votre base de données et exécutez :

```sql
SELECT id, email, role FROM users WHERE email = 'admin@lumina.org';
```

Vous devriez voir le compte admin.

## 🔐 Identifiants par défaut

- **Email** : `admin@lumina.org`
- **Mot de passe** : `Admin123!`
- **Role** : `admin`

⚠️ **IMPORTANT** : Changez ce mot de passe immédiatement après la première connexion en production !

## 🐛 Dépannage

### Erreur : "La table users n'existe pas"

**Solution** : Exécutez d'abord les migrations SQL :
1. Allez dans votre base de données PostgreSQL sur Render
2. Exécutez les fichiers dans `database/migrations/` dans l'ordre

### Erreur : "Impossible de se connecter à la base de données"

**Solutions** :
1. Vérifiez que `DATABASE_URL` est correctement configuré dans les variables d'environnement Render
2. Si vous utilisez la méthode 3 (local), utilisez l'**External Database URL**
3. Si vous utilisez Render Shell, utilisez l'**Internal Database URL** (déjà configuré via variables d'environnement)

### Erreur : "L'utilisateur admin existe déjà"

**Solution** : 
- Si vous voulez réinitialiser, supprimez d'abord l'utilisateur :
  ```sql
  DELETE FROM users WHERE email = 'admin@lumina.org';
  ```
- Puis réexécutez le script

### Le script ne se trouve pas dans Render Shell

**Solution** :
1. Vérifiez le chemin avec `pwd`
2. Naviguez vers le bon répertoire : `cd /opt/render/project/src/backend`
3. Vérifiez que le fichier existe : `ls -la run-seed.js`

## 📚 Ressources

- [Documentation Render Shell](https://render.com/docs/ssh)
- [Guide de déploiement complet](./DEPLOY_BACKEND.md)
