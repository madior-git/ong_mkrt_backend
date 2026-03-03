// src/middleware/validate.js
const { body, validationResult } = require('express-validator');

// Validation pour l'inscription
const validateRegister = [
  body('username')
    .notEmpty().withMessage('Le nom d\'utilisateur est requis')
    .isLength({ min: 3 }).withMessage('Le nom d\'utilisateur doit faire au moins 3 caractères'),
  body('email')
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Email invalide'),
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis')
    .isLength({ min: 6 }).withMessage('Le mot de passe doit faire au moins 6 caractères')
];

// Validation pour la connexion
const validateLogin = [
  body('email')
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Email invalide'),
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis')
];

// Gestion des erreurs de validation
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Erreur de validation',
      errors: errors.array() 
    });
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  handleValidationErrors
};