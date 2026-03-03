const app = require('./src/app');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Vérification des variables d'environnement critiques
if (!process.env.JWT_SECRET) {
  console.error('❌ ERREUR CRITIQUE: JWT_SECRET non défini dans .env');
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`✅ Serveur backend démarré sur le port ${PORT}`);
  console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
});