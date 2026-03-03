// src/controllers/authController.js
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const { pool } = require('../config/database'); // AJOUTEZ CETTE LIGNE

// @desc    Inscription admin (à utiliser une seule fois)
// @route   POST /api/auth/register
// @access  Public (mais à protéger en production)
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà' });
    }

    // Créer l'utilisateur
    const user = await User.create(username, email, password);

    // Générer le token
    const token = generateToken(user);

    // Mettre à jour la table users avec le token
    await pool.query(
      'UPDATE users SET last_token = $1 WHERE id = $2',
      [token, user.id]
    );

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('❌ Erreur register:', error);
    res.status(500).json({ message: 'Erreur lors de l\'inscription' });
  }
};

// @desc    Connexion admin
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const isMatch = await User.comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Générer le token
    const token = generateToken(user);

    // Mettre à jour la table users avec le token
    await pool.query(
      'UPDATE users SET last_token = $1 WHERE id = $2',
      [token, user.id]
    );

    console.log('✅ Connexion réussie pour:', user.email);
    
    res.json({
      message: 'Connexion réussie',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('❌ Erreur login:', error);
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
};

// @desc    Récupérer le profil
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    res.json({
      user: req.user
    });
  } catch (error) {
    console.error('❌ Erreur profile:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du profil' });
  }
};

module.exports = {
  register,
  login,
  getProfile
};