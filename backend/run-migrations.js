/**
 * Script pour exécuter toutes les migrations SQL
 * Usage: node run-migrations.js
 */

require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000,
});

const migrationsDir = path.join(__dirname, '../database/migrations');

async function runMigrations() {
  console.log('🔄 Exécution des migrations SQL...');
  console.log('');

  try {
    // Lire tous les fichiers de migration dans l'ordre
    const migrationFiles = [
      '001_create_users.sql',
      '002_create_activites.sql',
      '003_create_services.sql',
      '004_create_messages.sql',
    ];

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      
      if (!fs.existsSync(filePath)) {
        console.error(`❌ Fichier de migration non trouvé: ${file}`);
        continue;
      }

      const sql = fs.readFileSync(filePath, 'utf8');
      console.log(`📄 Exécution de ${file}...`);

      try {
        await pool.query(sql);
        console.log(`   ✅ ${file} exécuté avec succès`);
      } catch (error) {
        // Si la table existe déjà, on continue
        if (error.message.includes('already exists')) {
          console.log(`   ℹ️  ${file} : Les tables existent déjà`);
        } else {
          throw error;
        }
      }
    }

    console.log('');
    console.log('✅ Toutes les migrations ont été exécutées !');
    console.log('');
    console.log('📝 Prochaine étape : Créer le compte admin');
    console.log('   Exécutez: node ../database/seeds/seed_admin.js');

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution des migrations:', error.message);
    await pool.end();
    process.exit(1);
  }
}

runMigrations();
