/**
 * Script pour arrêter le serveur backend sur le port 5000
 * Usage: node stop-server.js
 */

const { exec } = require('child_process');

const port = 5000;

// Trouver le processus sur le port 5000
exec(`lsof -ti:${port}`, (error, stdout, stderr) => {
  if (error || !stdout.trim()) {
    console.log(`ℹ️  Aucun processus trouvé sur le port ${port}`);
    return;
  }

  const pid = stdout.trim();
  console.log(`🔍 Processus trouvé sur le port ${port} (PID: ${pid})`);
  console.log(`🛑 Arrêt du processus...`);

  // Arrêter le processus
  exec(`kill ${pid}`, (killError) => {
    if (killError) {
      console.error(`❌ Erreur lors de l'arrêt: ${killError.message}`);
      // Essayer avec kill -9 si kill normal échoue
      exec(`kill -9 ${pid}`, (forceKillError) => {
        if (forceKillError) {
          console.error(`❌ Impossible d'arrêter le processus: ${forceKillError.message}`);
        } else {
          console.log(`✅ Processus arrêté de force (kill -9)`);
        }
      });
    } else {
      console.log(`✅ Processus arrêté avec succès`);
    }
  });
});
