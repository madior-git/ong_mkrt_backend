// src/controllers/activityController.js
const { pool } = require('../config/database');

// @desc    Récupérer toutes les activités
// @route   GET /api/activities
const getActivities = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM activities ORDER BY date DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Erreur getActivities:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Récupérer une activité par ID
// @route   GET /api/activities/:id
const getActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM activities WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Activité non trouvée' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Erreur getActivity:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Créer une activité
// @route   POST /api/activities
const createActivity = async (req, res) => {
  try {
    const { title, description, date, location } = req.body;
    
    const result = await pool.query(
      `INSERT INTO activities (title, description, date, location, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, NOW(), NOW()) 
       RETURNING *`,
      [title, description, date, location]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ Erreur createActivity:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Mettre à jour une activité
// @route   PUT /api/activities/:id
const updateActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, location } = req.body;
    
    const result = await pool.query(
      `UPDATE activities 
       SET title = $1, description = $2, date = $3, location = $4, updated_at = NOW() 
       WHERE id = $5 
       RETURNING *`,
      [title, description, date, location, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Activité non trouvée' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Erreur updateActivity:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Supprimer une activité
// @route   DELETE /api/activities/:id
const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM activities WHERE id = $1 RETURNING id',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Activité non trouvée' });
    }
    
    res.json({ message: 'Activité supprimée avec succès' });
  } catch (error) {
    console.error('❌ Erreur deleteActivity:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  getActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity
};