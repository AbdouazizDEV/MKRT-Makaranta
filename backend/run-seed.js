/**
 * Script pour exécuter les seeders en production
 * Usage: node run-seed.js
 * 
 * Ce script peut être exécuté via Render Shell ou localement
 */

require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seedAdmin() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Démarrage du seeding...\n');
    
    // Vérifier si l'admin existe déjà
    const checkResult = await client.query(
      "SELECT id FROM users WHERE email = 'admin@lumina.org'"
    );
    
    if (checkResult.rows.length > 0) {
      console.log('⚠️  L\'utilisateur admin existe déjà.');
      console.log('   Email: admin@lumina.org');
      console.log('   Pour réinitialiser, supprimez d\'abord l\'utilisateur existant.\n');
      return;
    }
    
    // Hasher le mot de passe
    const password = 'Admin123!';
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Créer l'utilisateur admin
    const result = await client.query(
      `INSERT INTO users (email, password_hash, role, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())
       RETURNING id, email, role`,
      ['admin@lumina.org', passwordHash, 'admin']
    );
    
    const admin = result.rows[0];
    
    console.log('✅ Compte admin créé avec succès!\n');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Mot de passe:', password);
    console.log('👤 Role:', admin.role);
    console.log('🆔 ID:', admin.id);
    console.log('\n⚠️  IMPORTANT: Changez ce mot de passe en production!\n');
    
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error.message);
    
    if (error.code === '42P01') {
      console.error('\n💡 La table "users" n\'existe pas.');
      console.error('   Exécutez d\'abord les migrations SQL:\n');
      console.error('   1. database/migrations/001_create_users.sql');
      console.error('   2. database/migrations/002_create_activites.sql');
      console.error('   3. database/migrations/003_create_services.sql');
      console.error('   4. database/migrations/004_create_messages.sql\n');
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      console.error('\n💡 Impossible de se connecter à la base de données.');
      console.error('   Vérifiez que DATABASE_URL est correctement configuré.\n');
    }
    
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Exécuter le seeding
seedAdmin()
  .then(() => {
    console.log('✅ Seeding terminé avec succès!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
