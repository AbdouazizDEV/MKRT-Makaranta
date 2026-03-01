/**
 * Script pour tester la connexion à PostgreSQL
 * Usage: node test-db-connection.js
 */

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000,
});

async function testConnection() {
  console.log('🔍 Test de connexion à PostgreSQL...');
  console.log(`📊 DATABASE_URL: ${process.env.DATABASE_URL ? 'Configurée' : 'Non configurée'}`);
  console.log('');

  try {
    // Test de connexion
    const result = await pool.query('SELECT NOW() as current_time, version() as version');
    console.log('✅ Connexion réussie !');
    console.log(`   Heure serveur: ${result.rows[0].current_time}`);
    console.log(`   Version PostgreSQL: ${result.rows[0].version.split(' ')[0]} ${result.rows[0].version.split(' ')[1]}`);
    console.log('');

    // Vérifier si les tables existent
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

    console.log('📋 Tables existantes:');
    if (tablesResult.rows.length === 0) {
      console.log('   ⚠️  Aucune table trouvée. Exécutez les migrations SQL.');
    } else {
      tablesResult.rows.forEach((row) => {
        console.log(`   ✓ ${row.table_name}`);
      });
    }

    // Vérifier si le compte admin existe
    const adminResult = await pool.query('SELECT COUNT(*) as count FROM users WHERE email = $1', [
      'admin@lumina.org',
    ]);
    const adminCount = parseInt(adminResult.rows[0].count);
    if (adminCount > 0) {
      console.log('');
      console.log('✅ Compte admin trouvé dans la base de données');
    } else {
      console.log('');
      console.log('⚠️  Compte admin non trouvé. Exécutez: node ../database/seeds/seed_admin.js');
    }

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    console.log('');
    console.log('💡 Vérifications à faire:');
    console.log('   1. Vérifiez que PostgreSQL est démarré');
    console.log('   2. Vérifiez que DATABASE_URL dans .env est correcte');
    console.log('   3. Vérifiez vos identifiants de connexion');
    console.log('   4. Vérifiez que le serveur de base de données est accessible');
    await pool.end();
    process.exit(1);
  }
}

testConnection();
