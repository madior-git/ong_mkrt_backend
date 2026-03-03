// backend/scripts/create-admin.js
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' });

const pool = new Pool({
  user: process.env.DB_USER || 'user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'ong_projet',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
});

async function createAdmin() {
  console.log('📡 Connexion à PostgreSQL...');
  
  try {
    // Tester la connexion
    await pool.query('SELECT NOW()');
    console.log('✅ Connecté à PostgreSQL');

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('fallou123', salt);

    // Vérifier si l'utilisateur existe déjà
    const checkUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      ['fallou@ong.com']
    );

    if (checkUser.rows.length > 0) {
      console.log('⚠️ Un utilisateur avec cet email existe déjà');
      console.log('Utilisateur trouvé:', {
        id: checkUser.rows[0].id,
        username: checkUser.rows[0].username,
        email: checkUser.rows[0].email,
        role: checkUser.rows[0].role
      });
      
      // Mettre à jour le rôle en admin et le mot de passe
      const updateUser = await pool.query(
        `UPDATE users 
         SET role = $1, 
             password_hash = $2,
             updated_at = NOW() 
         WHERE email = $3 
         RETURNING id, username, email, role`,
        ['admin', hashedPassword, 'fallou@ong.com']
      );
      
      console.log('✅ Utilisateur mis à jour en admin');
      console.log('📧 Email:', updateUser.rows[0].email);
      console.log('👤 Username:', updateUser.rows[0].username);
      console.log('🎭 Rôle:', updateUser.rows[0].role);
      console.log('🔑 Mot de passe: fallou123');
    } else {
      // Créer le nouvel admin
      const newUser = await pool.query(
        `INSERT INTO users (username, email, password_hash, role, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, NOW(), NOW()) 
         RETURNING id, username, email, role`,
        ['Fallou', 'fallou@ong.com', hashedPassword, 'admin']
      );

      console.log('\n✅ Admin créé avec succès!');
      console.log('📧 Email:', newUser.rows[0].email);
      console.log('👤 Username:', newUser.rows[0].username);
      console.log('🎭 Rôle:', newUser.rows[0].role);
      console.log('🔑 Mot de passe: fallou123');
      console.log('🆔 ID:', newUser.rows[0].id);
    }

    // Vérifions que l'utilisateur a bien été créé/mis à jour
    const verifyUser = await pool.query(
      'SELECT id, username, email, role, created_at FROM users WHERE email = $1',
      ['fallou@ong.com']
    );
    
    console.log('\n📊 Vérification en base:');
    console.log(verifyUser.rows[0]);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await pool.end();
    console.log('\n🔌 Connexion fermée');
  }
}

// Exécuter
createAdmin();