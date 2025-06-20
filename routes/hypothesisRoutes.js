// routes/hypothesisRoutes.js -
const express = require('express');
const router = express.Router();
const hypothesisController = require('../controllers/hypothesisController');
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/auth');

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// NUEVA RUTA - Agregar antes de las otras rutas
router.post('/generate-from-problem', aiController.generateHypothesisFromProblem);

// Rutas existentes
router.get('/', hypothesisController.getHypotheses);
router.get('/:id', hypothesisController.getHypothesisById);
router.post('/', hypothesisController.createHypothesis);
router.put('/:id', hypothesisController.updateHypothesis);
router.delete('/:id', hypothesisController.deleteHypothesis);

module.exports = router;