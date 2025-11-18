// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const { sanitizeAuth } = require('../middleware/sanitize');
const validateRequest = require('../middleware/validateRequest');
const { updateProfileValidation, deleteAccountValidation } = require('./validators/userValidators');

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// @route   GET /api/users/profile
// @desc    Obtener perfil del usuario actual
// @access  Private
router.get('/profile', userController.getProfile);

// @route   PUT /api/users/profile
// @desc    Actualizar perfil del usuario
// @access  Private
router.put(
  '/profile',
  sanitizeAuth,
  updateProfileValidation,
  validateRequest,
  userController.updateProfile
);

// @route   DELETE /api/users/account
// @desc    Eliminar cuenta de usuario
// @access  Private
router.delete(
  '/account',
  sanitizeAuth,
  deleteAccountValidation,
  validateRequest,
  userController.deleteAccount
);

module.exports = router;
