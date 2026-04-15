const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Générer un token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @route   POST /api/auth/register
// @desc    Inscription d'un nouvel utilisateur
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Créer l'utilisateur
    const user = new User({
      name,
      email,
      password,
    });

    await user.save();

    // Générer le token
    const token = generateToken(user._id);

    // Mettre à jour la dernière connexion
    user.lastLogin = new Date();
    await user.save();

    res.status(201).json({
      success: true,
      token,
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   POST /api/auth/login
// @desc    Connexion d'un utilisateur
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password, remember } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    // Trouver l'utilisateur avec le mot de passe
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifier si le compte est actif
    if (!user.isActive) {
      return res.status(401).json({ message: 'Compte désactivé' });
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Générer le token
    const token = generateToken(user._id);

    // Mettre à jour la dernière connexion
    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      token,
      user: user.getPublicProfile(),
      remember
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   GET /api/auth/me
// @desc    Obtenir les informations de l'utilisateur connecté
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user.getPublicProfile()
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   PUT /api/auth/profile
// @desc    Mettre à jour le profil utilisateur
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, bio, status, privacy, avatar } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (status !== undefined) user.status = status;
    if (privacy !== undefined) user.privacy = privacy;
    if (avatar !== undefined) user.avatar = avatar;
    
    await user.save();
    
    res.json({
      success: true,
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   POST /api/auth/logout
// @desc    Déconnexion
// @access  Private
router.post('/logout', auth, async (req, res) => {
  try {
    // Dans une vraie application, on pourrait ajouter le token à une blacklist
    res.json({
      success: true,
      message: 'Déconnexion réussie'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   DELETE /api/auth/delete
// @desc    Supprimer le compte utilisateur
// @access  Private
router.delete('/delete', auth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    
    res.json({
      success: true,
      message: 'Compte supprimé avec succès'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
