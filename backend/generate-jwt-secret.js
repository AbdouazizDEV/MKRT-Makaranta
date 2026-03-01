/**
 * Script pour générer un secret JWT sécurisé
 * Usage: node generate-jwt-secret.js
 */

const crypto = require('crypto');

// Générer un secret de 64 bytes (128 caractères hex)
const secret = crypto.randomBytes(64).toString('hex');

console.log('🔐 Secret JWT généré :');
console.log('');
console.log(secret);
console.log('');
console.log('📝 Copiez cette valeur dans votre fichier .env :');
console.log(`JWT_SECRET=${secret}`);
console.log('');
console.log('⚠️  Important : Gardez ce secret en sécurité et ne le partagez jamais !');
