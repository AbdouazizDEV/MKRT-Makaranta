/**
 * Script pour créer le fichier .env avec toutes les variables nécessaires
 * Usage: node setup-env.js
 */

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

// Générer un secret JWT sécurisé
const jwtSecret = crypto.randomBytes(64).toString('hex');

// Contenu du fichier .env
const envContent = `PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/lumina_db
JWT_SECRET=${jwtSecret}
JWT_EXPIRES_IN=7d
UPLOAD_DIR=./uploads
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
`;

const envPath = path.join(__dirname, '.env');

// Vérifier si le fichier existe déjà
if (fs.existsSync(envPath)) {
  console.log('⚠️  Le fichier .env existe déjà.');
  console.log('   Si vous voulez le recréer, supprimez-le d\'abord.');
  process.exit(0);
}

// Créer le fichier .env
try {
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('✅ Fichier .env créé avec succès !');
  console.log('');
  console.log('📝 Variables configurées :');
  console.log('   - PORT: 5000');
  console.log('   - DATABASE_URL: postgresql://user:password@localhost:5432/lumina_db');
  console.log('   - JWT_SECRET: (généré automatiquement)');
  console.log('   - JWT_EXPIRES_IN: 7d');
  console.log('   - NODE_ENV: development');
  console.log('');
  console.log('⚠️  IMPORTANT : Modifiez les valeurs suivantes dans .env :');
  console.log('   1. DATABASE_URL : Remplacez user:password par vos identifiants PostgreSQL');
  console.log('   2. CLOUDINARY_CLOUD_NAME : Votre nom de cloud Cloudinary');
  console.log('   3. CLOUDINARY_API_KEY : Votre clé API Cloudinary');
  console.log('   4. CLOUDINARY_API_SECRET : Votre secret API Cloudinary');
  console.log('');
} catch (error) {
  console.error('❌ Erreur lors de la création du fichier .env:', error.message);
  process.exit(1);
}
