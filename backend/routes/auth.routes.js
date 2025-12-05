const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');
const { protect } = require('../middleware/auth');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '24h'
  });
};

// @route   POST /api/auth/register
// @desc    Register user (citoyen)
router.post('/register', [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 6 }).withMessage('Mot de passe: minimum 6 caractères'),
  body('firstName').notEmpty().withMessage('Prénom requis'),
  body('lastName').notEmpty().withMessage('Nom requis')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password, firstName, lastName, phone, cin } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email déjà utilisé'
      });
    }

    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      phone,
      cin,
      role: 'citoyen'
    });

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Inscription réussie',
      data: { user, token }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Mot de passe requis')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Compte désactivé'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      });
    }

    await user.update({ lastLogin: new Date() });

    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Connexion réussie',
      data: { user, token }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

// @route   PUT /api/auth/password
// @desc    Update password
router.put('/password', protect, [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 })
], async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findByPk(req.user.id);
    const isMatch = await user.matchPassword(currentPassword);
    
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Mot de passe actuel incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Mot de passe modifié'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

module.exports = router;
