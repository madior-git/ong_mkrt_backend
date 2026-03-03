const app = require('./src/app');

// ⚠️ IMPORTANT: Ne charger dotenv qu'en développement
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  console.log('📦 Dotenv chargé pour le développement');
}

const PORT = process.env.PORT || 5000;

// Vérification des variables d'environnement critiques
if (!process.env.JWT_SECRET) {
  console.error('❌ ERREUR CRITIQUE: JWT_SECRET non défini');
  process.exit(1);
}

// En production, vérifier aussi DATABASE_URL
if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
  console.error('❌ ERREUR CRITIQUE: DATABASE_URL non défini en production');
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`✅ Serveur backend démarré sur le port ${PORT}`);
  console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
});