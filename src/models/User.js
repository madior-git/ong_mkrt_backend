// src/models/User.js
const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Trouver un utilisateur par email
  static async findByEmail(email) {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      return result.rows[0];
    } catch (error) {
      console.error('❌ Erreur findByEmail:', error);
      throw error;
    }
  }

  // Trouver un utilisateur par ID
  static async findById(id) {
    try {
      const result = await pool.query(
        'SELECT id, username, email, role, created_at FROM users WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('❌ Erreur findById:', error);
      throw error;
    }
  }

  // Créer un nouvel utilisateur
  static async create(username, email, password) {
    try {
      // Hasher le mot de passe
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      const result = await pool.query(
        `INSERT INTO users (username, email, password_hash, role, created_at, updated_at) 
         VALUES ($1, $2, $3, 'user', NOW(), NOW()) 
         RETURNING id, username, email, role, created_at`,
        [username, email, password_hash]
      );

      return result.rows[0];
    } catch (error) {
      console.error('❌ Erreur create:', error);
      throw error;
    }
  }

  // Comparer les mots de passe
  static async comparePassword(password, password_hash) {
    return bcrypt.compare(password, password_hash);
  }

  // Mettre à jour le rôle
  static async updateRole(id, role) {
    try {
      const result = await pool.query(
        'UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2 RETURNING id, username, email, role',
        [role, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('❌ Erreur updateRole:', error);
      throw error;
    }
  }
}

module.exports = User;