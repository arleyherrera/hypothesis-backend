// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { sanitizeAuth } = require('../middleware/sanitize');
const { registerValidation, loginValidation } = require('./validators/authValidators');

// Rutas públicas con validación y sanitización
router.post('/register', 
  sanitizeAuth, // Primero sanitizar
  registerValidation, // Luego validar
  validateRequest, // Verificar errores de validación
  authController.register
);

router.post('/login',
  sanitizeAuth,
  loginValidation,
  validateRequest,
  authController.login
);

// Rutas de recuperación de contraseña
router.post('/forgot-password',
  sanitizeAuth,
  authController.forgotPassword
);

router.post('/reset-password/:token',
  sanitizeAuth,
  authController.resetPassword
);

// Rutas protegidas
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;