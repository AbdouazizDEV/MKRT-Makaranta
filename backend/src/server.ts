/**
 * Point d'entrée du serveur
 * Démarre l'application Express
 */

import app from './app';
import env from './config/env';
import './config/database'; // Initialise la connexion à la base de données

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📊 Environnement: ${env.NODE_ENV}`);
});
