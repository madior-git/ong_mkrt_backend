const db = require('../config/database');

class Service {
  // Créer un service
  static async create(data) {
    const { title, description, icon, image_url, order, published } = data;
    const query = `
      INSERT INTO services (title, description, icon, image_url, "order", published)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [title, description, icon, image_url, order || 0, published !== false];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  // Récupérer tous les services
  static async findAll(publishedOnly = true) {
    let query = 'SELECT * FROM services ORDER BY "order" ASC, created_at DESC';
    if (publishedOnly) {
      query = 'SELECT * FROM services WHERE published = true ORDER BY "order" ASC, created_at DESC';
    }
    const result = await db.query(query);
    return result.rows;
  }

  // Récupérer un service par ID
  static async findById(id) {
    const query = 'SELECT * FROM services WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  // Mettre à jour un service
  static async update(id, data) {
    const { title, description, icon, image_url, order, published } = data;
    const query = `
      UPDATE services 
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          icon = COALESCE($3, icon),
          image_url = COALESCE($4, image_url),
          "order" = COALESCE($5, "order"),
          published = COALESCE($6, published),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `;
    const values = [title, description, icon, image_url, order, published, id];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  // Supprimer un service
  static async delete(id) {
    const query = 'DELETE FROM services WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Service;