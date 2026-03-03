// src/routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  sendContact,
  getMessages,
  getMessage,
  deleteMessage,
  markAsRead
} = require('../controllers/contactController');

// Route publique (envoi de message)
router.post('/', sendContact);

// Routes protégées (admin uniquement)
router.get('/', protect, admin, getMessages);
router.get('/:id', protect, admin, getMessage);
router.delete('/:id', protect, admin, deleteMessage);
router.put('/:id/read', protect, admin, markAsRead);

module.exports = router;