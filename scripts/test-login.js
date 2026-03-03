// backend/scripts/test-login.js
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' });

const pool = new Pool({
  user: 'user',
  host: 'localhost',
  database: 'ong_projet',
  password: '',
  port: 5432,
});

async function testLogin() {
  try {
    const email = 'fallou@ong.com';
    const password = 'fallou123';
    
    console.log(`🔍 Test de connexion pour ${email}`);
    
    // Chercher l'utilisateur
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      console.log('❌ Utilisateur non trouvé');
      return;
    }
    
    const user = result.rows[0];
    console.log('✅ Utilisateur trouvé:', {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });
    
    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (validPassword) {
      console.log('✅ Mot de passe valide');
      console.log('\n🎉 Vous pouvez vous connecter avec:');
      console.log('📧 Email:', email);
      console.log('🔑 Mot de passe:', password);
    } else {
      console.log('❌ Mot de passe invalide');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await pool.end();
  }
}

testLogin();