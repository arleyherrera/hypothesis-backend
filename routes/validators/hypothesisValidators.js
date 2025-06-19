const { body, param } = require('express-validator');

const createHypothesisValidation = [
  // CAMBIO: Problema primero con validación más estricta
  body('problem')
    .trim()
    .isLength({ min: 20, max: 5000 })
    .withMessage('El problema debe tener entre 20 y 5000 caracteres')
    .custom((value) => {
      const wordCount = value.split(/\s+/).length;
      if (wordCount < 5) {
        throw new Error('El problema debe contener al menos 5 palabras');
      }
      return true;
    }),
  body('name')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('El nombre debe tener entre 3 y 200 caracteres'),
  body('solution')
    .trim()
    .isLength({ min: 10 })
    .withMessage('La solución debe tener al menos 10 caracteres'),
  body('customerSegment')
    .trim()
    .isLength({ min: 5 })
    .withMessage('El segmento de clientes debe tener al menos 5 caracteres'),
  body('valueProposition')
    .trim()
    .isLength({ min: 10 })
    .withMessage('La propuesta de valor debe tener al menos 10 caracteres')
];
const idValidation = [
  param('id')
    .isUUID()
    .withMessage('ID inválido')
];

module.exports = {
  createHypothesisValidation,
  idValidation
};