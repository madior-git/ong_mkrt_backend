const db = require('../config/database');

class Contact {
  // Créer un message de contact
  static async create(data) {
    const { name, email, subject, message } = data;
    const query = `
      INSERT INTO contacts (name, email, subject, message)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [name, email, subject, message];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  // Récupérer tous les messages
  static async findAll(status = null) {
    let query = 'SELECT * FROM contacts ORDER BY created_at DESC';
    if (status) {
      query = 'SELECT * FROM contacts WHERE status = $1 ORDER BY created_at DESC';
      const result = await db.query(query, [status]);
      return result.rows;
    }
    const result = await db.query(query);
    return result.rows;
  }

  // Récupérer un message par ID
  static async findById(id) {
    const query = 'SELECT * FROM contacts WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  // Mettre à jour le statut
  static async updateStatus(id, status) {
    const query = `
      UPDATE contacts 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    const result = await db.query(query, [status, id]);
    return result.rows[0];
  }

  // Supprimer un message
  static async delete(id) {
    const query = 'DELETE FROM contacts WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  // Compter les messages non lus
  static async countUnread() {
    const query = "SELECT COUNT(*) FROM contacts WHERE status = 'non lu'";
    const result = await db.query(query);
    return parseInt(result.rows[0].count);
  }
}

module.exports = Contact;