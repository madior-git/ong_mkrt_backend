const db = require('../config/database');

class Activity {
  // Créer une activité
  static async create(data) {
    const { title, description, image_url, date, location, published } = data;
    const query = `
      INSERT INTO activities (title, description, image_url, date, location, published)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [title, description, image_url, date, location, published || false];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  // Récupérer toutes les activités
  static async findAll(publishedOnly = false) {
    let query = 'SELECT * FROM activities ORDER BY created_at DESC';
    if (publishedOnly) {
      query = 'SELECT * FROM activities WHERE published = true ORDER BY created_at DESC';
    }
    const result = await db.query(query);
    return result.rows;
  }

  // Récupérer une activité par ID
  static async findById(id) {
    const query = 'SELECT * FROM activities WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  // Mettre à jour une activité
  static async update(id, data) {
    const { title, description, image_url, date, location, published } = data;
    const query = `
      UPDATE activities 
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          image_url = COALESCE($3, image_url),
          date = COALESCE($4, date),
          location = COALESCE($5, location),
          published = COALESCE($6, published),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `;
    const values = [title, description, image_url, date, location, published, id];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  // Supprimer une activité
  static async delete(id) {
    const query = 'DELETE FROM activities WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  // Compter les activités
  static async count() {
    const query = 'SELECT COUNT(*) FROM activities';
    const result = await db.query(query);
    return parseInt(result.rows[0].count);
  }
}

module.exports = Activity;