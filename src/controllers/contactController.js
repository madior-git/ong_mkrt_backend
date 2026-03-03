// src/controllers/contactController.js
const { pool } = require('../config/database');

// @desc    Envoyer un message de contact (public)
// @route   POST /api/contacts
const sendContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validation basique
    if (!name || !email || !message) {
      return res.status(400).json({ 
        message: 'Nom, email et message sont requis' 
      });
    }

    const result = await pool.query(
      `INSERT INTO contacts (name, email, subject, message, status, created_at) 
       VALUES ($1, $2, $3, $4, 'pending', NOW()) 
       RETURNING id, name, email, subject, created_at`,
      [name, email, subject || 'Sans sujet', message]
    );
    
    res.status(201).json({
      message: 'Message envoyé avec succès',
      contact: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Erreur sendContact:', error);
    res.status(500).json({ message: 'Erreur lors de l\'envoi du message' });
  }
};

// @desc    Récupérer tous les messages (admin)
// @route   GET /api/contacts
const getMessages = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM contacts ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Erreur getMessages:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Récupérer un message par ID (admin)
// @route   GET /api/contacts/:id
const getMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM contacts WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Erreur getMessage:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Supprimer un message (admin)
// @route   DELETE /api/contacts/:id
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM contacts WHERE id = $1 RETURNING id',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }
    
    res.json({ message: 'Message supprimé avec succès' });
  } catch (error) {
    console.error('❌ Erreur deleteMessage:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Marquer un message comme lu (admin)
// @route   PUT /api/contacts/:id/read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'UPDATE contacts SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      ['read', id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Erreur markAsRead:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  sendContact,
  getMessages,
  getMessage,
  deleteMessage,
  markAsRead
};