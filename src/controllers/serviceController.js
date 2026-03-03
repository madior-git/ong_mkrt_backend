// src/controllers/serviceController.js
const { pool } = require('../config/database');

const getServices = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM services ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Erreur getServices:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const getService = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM services WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Service non trouvé' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Erreur getService:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const createService = async (req, res) => {
  try {
    const { title, description, icon } = req.body;
    const result = await pool.query(
      'INSERT INTO services (title, description, icon, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *',
      [title, description, icon]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ Erreur createService:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, icon } = req.body;
    const result = await pool.query(
      'UPDATE services SET title = $1, description = $2, icon = $3, updated_at = NOW() WHERE id = $4 RETURNING *',
      [title, description, icon, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Service non trouvé' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Erreur updateService:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM services WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Service non trouvé' });
    }
    res.json({ message: 'Service supprimé avec succès' });
  } catch (error) {
    console.error('❌ Erreur deleteService:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  getServices,
  getService,
  createService,
  updateService,
  deleteService
};