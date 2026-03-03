const { Pool } = require('pg');
// Ne pas appeler dotenv ici, il est déjà appelé dans server.js
// require('dotenv').config(); // ← À SUPPRIMER ou conditionner

let pool;

if (process.env.NODE_ENV === 'production') {
  // PRODUCTION: Utiliser DATABASE_URL (Neon)
  console.log('📡 Production: Connexion via DATABASE_URL');
  console.log('🔍 DATABASE_URL définie:', !!process.env.DATABASE_URL);
  
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // Nécessaire pour Neon
    },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
} else {
  // DÉVELOPPEMENT: Utiliser les variables séparées
  console.log('📡 Développement: Connexion via variables DB_*');
  
  // En développement, dotenv est déjà chargé par server.js
  pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
}

// Test de connexion
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Erreur de connexion à PostgreSQL:', err.message);
    console.error('📌 Vérifiez vos variables de connexion');
    return;
  }
  console.log('✅ Connecté à PostgreSQL avec succès');
  release();
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};