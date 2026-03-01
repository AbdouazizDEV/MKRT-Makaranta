/**
 * Configuration de la connexion PostgreSQL
 * Utilise un pool de connexions pour optimiser les performances
 */

import { Pool, PoolConfig } from 'pg';
import env from './env';

const poolConfig: PoolConfig = {
  connectionString: env.DATABASE_URL,
  max: 20, // Nombre maximum de connexions dans le pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Création du pool de connexions
const pool = new Pool(poolConfig);

// Gestion des erreurs de connexion
pool.on('error', (err) => {
  console.error('❌ Erreur inattendue sur le client PostgreSQL:', err);
  // Ne pas faire planter l'application, juste logger l'erreur
});

// Test de connexion au démarrage (non bloquant)
pool.query('SELECT NOW()')
  .then(() => {
    console.log('✅ Connexion à PostgreSQL établie');
  })
  .catch((err) => {
    console.error('⚠️  Impossible de se connecter à PostgreSQL au démarrage:', err.message);
    console.log('ℹ️  Le serveur continue de fonctionner. La connexion sera réessayée lors de la première requête.');
    // Ne pas faire planter l'application
  });

export default pool;
