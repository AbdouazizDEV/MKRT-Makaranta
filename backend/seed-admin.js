/**
 * Script de seed pour créer un compte administrateur par défaut
 * Usage: node seed-admin.js
 */

require('dotenv').config();
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seedAdmin() {
  const email = 'admin@lumina.org';
  const password = 'Admin123!';
  const saltRounds = 12;

  try {
    // Générer le hash du mot de passe
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insérer l'admin en base
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, role)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO NOTHING
       RETURNING id, email, role`,
      [email, passwordHash, 'admin']
    );

    if (result.rows.length > 0) {
      console.log('✅ Compte administrateur créé avec succès !');
      console.log(`   Email: ${email}`);
      console.log(`   Password: ${password}`);
      console.log('   ⚠️  Changez le mot de passe en production !');
    } else {
      console.log('ℹ️  Le compte administrateur existe déjà.');
    }
  } catch (error) {
    console.error('❌ Erreur lors de la création du compte admin:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedAdmin();
