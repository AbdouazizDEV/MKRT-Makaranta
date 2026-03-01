/**
 * Script pour tester la connexion admin
 * Usage: node test-login.js
 */

require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testLogin() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Test de connexion admin...\n');
    
    // Vérifier si l'admin existe
    const result = await client.query(
      "SELECT id, email, password_hash, role FROM users WHERE email = 'admin@lumina.org'"
    );
    
    if (result.rows.length === 0) {
      console.log('❌ Aucun utilisateur admin trouvé.');
      console.log('💡 Exécutez: npm run seed\n');
      return;
    }
    
    const admin = result.rows[0];
    console.log('✅ Admin trouvé:');
    console.log('   ID:', admin.id);
    console.log('   Email:', admin.email);
    console.log('   Role:', admin.role);
    console.log('   Password hash:', admin.password_hash.substring(0, 20) + '...\n');
    
    // Tester le mot de passe
    const testPassword = 'Admin123!';
    console.log('🔐 Test du mot de passe:', testPassword);
    
    const isValid = await bcrypt.compare(testPassword, admin.password_hash);
    
    if (isValid) {
      console.log('✅ Mot de passe correct!\n');
      console.log('📋 Identifiants de connexion:');
      console.log('   Email: admin@lumina.org');
      console.log('   Password: Admin123!\n');
    } else {
      console.log('❌ Mot de passe incorrect!');
      console.log('💡 Le mot de passe dans la base ne correspond pas à "Admin123!"');
      console.log('   Vous pouvez réinitialiser avec: npm run seed\n');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    if (error.code === '42P01') {
      console.error('\n💡 La table "users" n\'existe pas.');
      console.error('   Exécutez d\'abord les migrations SQL.\n');
    }
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

testLogin();
