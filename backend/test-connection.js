/**
 * Script pour tester la connexion à la base de données et vérifier les tables
 * Usage: node test-connection.js
 */

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
  try {
    console.log('🔍 Test de connexion à la base de données...\n');
    
    // Test de connexion
    const client = await pool.connect();
    console.log('✅ Connexion réussie!\n');
    
    // Vérifier les tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('📊 Tables trouvées:');
    if (tablesResult.rows.length === 0) {
      console.log('  ⚠️  Aucune table trouvée. Les migrations n\'ont peut-être pas été exécutées.');
    } else {
      tablesResult.rows.forEach(row => {
        console.log(`  - ${row.table_name}`);
      });
    }
    console.log('');
    
    // Vérifier la table users
    if (tablesResult.rows.some(row => row.table_name === 'users')) {
      const usersResult = await client.query('SELECT COUNT(*) as count FROM users');
      console.log(`👥 Nombre d'utilisateurs: ${usersResult.rows[0].count}`);
      
      if (parseInt(usersResult.rows[0].count) > 0) {
        const adminResult = await client.query(
          "SELECT id, email, role FROM users WHERE role = 'admin' LIMIT 1"
        );
        if (adminResult.rows.length > 0) {
          console.log(`   Admin trouvé: ${adminResult.rows[0].email}`);
        } else {
          console.log('   ⚠️  Aucun utilisateur admin trouvé.');
        }
      }
    } else {
      console.log('⚠️  La table "users" n\'existe pas. Exécutez les migrations SQL.');
    }
    
    client.release();
    await pool.end();
    
    console.log('\n✅ Test terminé avec succès!');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('   La base de données n\'est pas accessible. Vérifiez DATABASE_URL.');
    } else if (error.code === '42P01') {
      console.error('   La table n\'existe pas. Exécutez les migrations SQL.');
    }
    process.exit(1);
  }
}

testConnection();
