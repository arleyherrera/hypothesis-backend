// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const { sanitizeAuth } = require('../middleware/sanitize');

// Todas las rutas de usuario requieren autenticación
router.use(authMiddleware);

// GET /api/users/profile - Obtener perfil del usuario
router.get('/profile', userController.getProfile);

// PUT /api/users/profile - Actualizar perfil del usuario
router.put('/profile', sanitizeAuth, userController.updateProfile);

// DELETE /api/users/account - Eliminar cuenta del usuario
router.delete('/account', userController.deleteAccount);

module.exports = router;