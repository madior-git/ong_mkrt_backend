// src/routes/activityRoutes.js
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity
} = require('../controllers/activityController');

// Routes publiques
router.get('/', getActivities);
router.get('/:id', getActivity);

// Routes protégées (admin uniquement)
router.post('/', protect, admin, createActivity);
router.put('/:id', protect, admin, updateActivity);
router.delete('/:id', protect, admin, deleteActivity);

module.exports = router;